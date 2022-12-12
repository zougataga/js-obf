// DOC
const allDocCode = document.querySelectorAll(".usage pre");

allDocCode.forEach(p => {
    const data = p.getAttribute("data");
    const code = p.getAttribute("code");
    const copied = p.querySelector(`#${data}`);
    if (copied && code) {
        p.addEventListener("mouseover", async (ev) => copied.style.opacity = "1");
        p.addEventListener("mouseout", async (ev) => copied.style.opacity = "0");
        const clipboard = new ClipboardJS(`#${data}`, {
            text: function (trigger) {
                return code;
            }
        });
        clipboard.on('success', function (e) {
            copied.classList.add("yes");
            e.clearSelection();
            setTimeout(() => {
                copied.classList.remove("yes");
            }, 1000);
        });
        
        clipboard.on('error', function (e) {
            notiferror("Une erreur est survenue.")
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });
    }
});

const clipboardCopyRaw = new ClipboardJS(`#copyRaw`, {
    text: function (trigger) {
        return "https://raw.githubusercontent.com/zougataga/js-obfuscator/main/assets/lib/js-obfuscator.js";
    }
});
clipboardCopyRaw.on('success', function (e) {
     notif("Lien héberger par github copié avec succès !")
});

clipboardCopyRaw.on('error', function (e) {
    notiferror("Une erreur est survenue.")
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});
// OB ONLINE
window.editor = CodeMirror.fromTextArea($('#code').get(0), {
    mode: "javascript",
    gutter: true,
    lineNumbers: true,
});

cmResize(window.editor, {
    resizableWidth: false,
    cssClass: "CodeMirror-Resizer"
});

const clipboard = new ClipboardJS('.clipboard-anchor', {
    text: function (trigger) {
        return window.editor.getValue();
    }
});
clipboard.on('success', function (e) {
    notif("Code copié avec succès !")
    e.clearSelection();
});

clipboard.on('error', function (e) {
    notiferror("Une erreur est survenue.")
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});

const obfuscator = new Obfuscator();

const file = $("#inFile");
const btnBrowse = $(".browse");
const btnClear = $(".clear");
const btnDownload = $(".download");
const btnLoadUrl = $(".url");
const btnFormat = $(".go");
const btnFormatLabel = btnFormat.find('span');
const btnFormatLoader = $(".spinner");

const modal = $("#modalWindow");
const modalBackdrop = $('.modal-backdrop');
const modalInput = modal.find('input');
const modalErrorHint = modal.find('.modal-error');
const modalBtn = modal.find('.modal-footer-button');
const modalBtnClose = modal.find('.modal-header').find('button');

const modeOb = $("#modeOb");

const menuAutoDetect = $('.main-button__auto');

const menuItems = $(".main-header > a");

$('button')
    .on('mouseleave', function (e) { $(this).removeClass('button-focus'); })
    .on('touchstart mousedown', function (e) { if (!$(this).hasClass('button-focus')) { $(this).addClass('button-focus') } })
    .on('touchend mouseup', function (e) { $(this).removeClass('button-focus') });

$('.footer-item')
    .on('mouseleave', function (e) { $(this).removeClass('item-focus') })
    .on('touchstart mousedown', function (e) { if (!$(this).hasClass('item-focus')) { $(this).addClass('item-focus') } })
    .on('touchend mouseup', function (e) { $(this).removeClass('item-focus') });


window.editor.on('drop', async (ev) => {
    window.editor.setValue("");
    window.editor.clearHistory();
});

let fileName;
file.on("change", async (ev) => {
    const files = file[0].files[0];
    if (files) {
        const filename = files.name;
        fileName = filename
        const fileReader = new FileReader();
        fileReader.onload = function () {
            notif("Fichier drop avec succès");
            window.editor.setValue(fileReader.result);
            file.val("");
        };
        fileReader.readAsText(files);
    }
});
btnBrowse.on("click", async (ev) => {
    file.trigger("click");
});

btnClear.on("click", async (ev) => {
    window.editor.setValue("");
    window.editor.clearHistory();
    notif("Code clear avec succès");
});

btnDownload.on("click", async (ev) => {
    if (fileName) {
        modalInput.val(fileName);
    }
    modal.data('type', 'download');
    modal.find('.modal-title').text("Taper ici une nom de fichier");
    modalBtn.text("Download");
    showModal();
    ev.preventDefault();
});
btnLoadUrl.on("click", async (ev) => {
    modal.find('.modal-title').text("Taper ici une URL");
    modalBtn.text("Load");
    modalInput.val(null);
    showModal();
    modal.data('type', 'load-url');
});

modalBtn.on("click", modalBtnClick);
modalInput.on("keyup", modalKeyUp);
modal.unbind("keyup").bind('keyup', modalKeyUp);

function modalBtnClick(e) {
    const value = modalInput.val();
    if (value) {
        if (modal.data('type') === 'download') {
            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(window.editor.getValue()));
            element.setAttribute('download', `${value}.txt`);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            closeModal();
        } else {
            const getFileNameFromUrl = (url) => {
                var pattern = /\.(css|html|json|js|php)/i;
                if (url) {
                    if (pattern.test(url)) {
                        return url.split('/').pop().split('#')[0].split('?')[0];
                    }
                }
                return "";
            };
            $.ajax({
                url: value,
                method: "GET",
                dataType: "json",
            }).done(function (data) {
                window.editor.setValue(data);
                closeModal();
                fileName = getFileNameFromUrl(value);
            }).fail(function (error) {
                const err = JSON.stringify(error);
                console.log(err);
                modalErrorHint.removeAttr('hidden');
            });
        }
    }
}
function modalKeyUp(e) {
    modalErrorHint.attr('hidden', '');
    if (e.which === 13) {
        modalBtnClick();
        return false;
    }

    if (e.which === 27) {
        closeModal();
        return false;
    }
}

modalBackdrop.on('click', closeModal);
modalBtnClose.on('click', closeModal);
function showModal() {
    modal.addClass('show')
    modal.show();
    modalInput.focus();
    modalBackdrop.show();
}
function closeModal() {
    modal.hide();
    modalBackdrop.hide();
    modalErrorHint.attr('hidden', '');
    modalInput.val('');
}

btnFormat.on('click', async (ev) => {
    btnFormat.addClass("disabled");
    btnFormatLabel.hide();
    btnFormatLoader.show();
    setTimeout(async () => {
        const content = window.editor.getValue();
        const length = string_length(content);
        if (length <= 0) {
            notiferror("Merci d'entrer du code dans l'input")
        } else {
            const mode = parseInt(modeOb.val());
            const result = new Promise((resolve) => resolve(Babel.transform(content, { presets: ['es2015'] })));
            result.then(e => {
                const output = obfuscator.obfuscate(mode, content);
                window.editor.setValue(output);
                notif(`Code obfusquer avec succès`);
            }).catch(err => {
                console.log(err);
                err = `Error: ${err.toString()}`;
                window.editor.setValue(err);
                // const position = getLigne(err);
                // console.log(position);
                // goLigne(position.line);
                // window.editor.addLineClass(position.line, 'background', 'line-error');
                notiferror(`Javascript Error`)
            });
        };
        btnFormat.removeClass("disabled");
        btnFormatLabel.show();
        btnFormatLoader.hide();
    }, 50);
});
function goLigne(lineNumber) {
    var lineTop = window.editor.charCoords({ line: lineNumber, ch: 0 }, "local").top;
    var middleHeight = window.editor.getScrollerElement().offsetHeight / 2;
    window.editor.scrollTo(0, lineTop - middleHeight - 5);
}
function getLigne(err) {
    if (err.indexOf("Parse Error") !== -1) {
        var line = err.split("\n")[0].match(/\d+/);
        return { line: parseInt(line) - 2, charNumber: null };
    }

    const errorElements = err.split('\n');
    var line = errorElements[0];
    const match = /([0-9]+):([0-9]+)/g.exec(line);
    if (match && match.length === 3) {
        const lineNumber = match[1] - 1;
        const charNumber = parseInt(match[2]) - 1;
        return { line: lineNumber, ch: charNumber };
    }
    return null;
}
function string_length(string) {
    let chars = 0;
    let counter = 0;
    const length = string.length;
    while (counter < length) {
        const value = string.charCodeAt(counter++);
        if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
            const extra = string.charCodeAt(counter++);
            if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
                chars++;
            } else {
                chars++;
                counter--;
            }
        } else {
            chars++;
        }
    }
    return chars;
}
function notif(content) {
    const toast = document.querySelector(".toast"),
        progress = document.querySelector(".toast .progress");

    $(".text-2").text(content);
    toast.style.display = "block";

    setTimeout(() => {

        let timer1, timer2;

        toast.classList.add("active");
        progress.classList.add("active");

        timer1 = setTimeout(() => {
            toast.classList.remove("active");
        }, 5000); //1s = 1000 milliseconds

        timer2 = setTimeout(() => {
            progress.classList.remove("active");
            toast.style.display = "none";
        }, 5300);

        $("#closetoastsucces").click(() => {
            toast.classList.remove("active");

            setTimeout(() => {
                progress.classList.remove("active");
                toast.style.display = "none";
            }, 300);

            clearTimeout(timer1);
            clearTimeout(timer2);
        });
    }, 15)
};
function notiferror(content) {
    const toast = document.querySelector(".toasterror"),
        progress = document.querySelector(".toasterror .progress");
    toast.style.display = "block";
    $(".text-4").text(content);
    setTimeout(() => {
        let timer1, timer2;

        toast.classList.add("active");
        progress.classList.add("active");

        timer1 = setTimeout(() => {
            toast.classList.remove("active");
        }, 5000); //1s = 1000 milliseconds

        timer2 = setTimeout(() => {
            progress.classList.remove("active");
            toast.style.display = "none";
        }, 5300);

        $("#closetoasterror").click(() => {
            toast.classList.remove("active");

            setTimeout(() => {
                progress.classList.remove("active");
                toast.style.display = "none";
            }, 300);

            clearTimeout(timer1);
            clearTimeout(timer2);
        });
    }, 15)
};