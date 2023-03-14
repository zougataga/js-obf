setTimeout(function () {
    const pres = document.querySelectorAll("pre>code");
    for (var i = 0; i < pres.length; i++) { hljs.highlightBlock(pres[i]); }
    window.highlightJsBadge({
        // contentSelector: ".container",
        loadDelay: 0,
        copyIconClass: "fa fa-copy",
        checkIconClass: "fa fa-check text-success",
        onBeforeTextCopied: function (text, codeElement) {
            return text;   //  you can fix up the text here
        }
    });
}, 10);

const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    lineNumbers: true,
    matchBrackets: true,
    continueComments: "Enter",
    extraKeys: { "Ctrl-Q": "toggleComment" }
});


const
    obfuscator = new Obfuscator(),
    file = document.querySelector("#inFile"),
    btnBrowse = document.querySelector(".browse"),
    btnClear = document.querySelector(".clear"),
    btnCopy = document.querySelector(".copy"),
    btnDownload = document.querySelector(".download"),
    btnLoadUrl = document.querySelector(".url"),
    btnFormat = document.querySelector(".go"),
    btnFormatLabel = btnFormat.querySelector('span'),
    btnFormatLoader = document.querySelector(".spinner"),
    modal = document.querySelector("#modalWindow"),
    modalBackdrop = document.querySelector('.modal-backdrop'),
    modalInput = modal.querySelector('input'),
    modalErrorHint = modal.querySelector('.modal-error'),
    modalBtn = modal.querySelector('.modal-footer-button'),
    modalBtnClose = modal.querySelector('.modal-header').querySelector('button'),
    modeOb = document.querySelector("#modeOb"),
    menuAutoDetect = document.querySelector('.main-button__auto'),
    menuItems = document.querySelectorAll(".main-header > a");


let fileName;
file.addEventListener("change", async (ev) => {
    const files = file.files[0];
    if (files) {
        const
            filename = files.name,
            fileReader = new FileReader();
        fileName = filename;
        fileReader.onload = function () {
            notif("Fichier ouvert avec succès");
            editor.setValue(fileReader.result);
            file.value = "";
        };
        fileReader.readAsText(files);
    }
});
btnBrowse.addEventListener("click", async (ev) => file.click());
btnCopy.addEventListener("click", async (ev) => {
    await navigator.clipboard.writeText(editor.getValue());
    notif("Code copier avec succès");
});

btnClear.addEventListener("click", async (ev) => {
    editor.setValue("");
    notif("Code clear avec succès");
});

btnDownload.addEventListener("click", async (ev) => {
    if (fileName) modalInput.value = fileName;
    modal.setAttribute('data-type', 'download');
    modal.querySelector('.modal-title').textContent = "Taper ici un nom de fichier";
    modalBtn.textContent = "Download";
    showModal();
    ev.preventDefault();
});

btnLoadUrl.addEventListener("click", async (ev) => {
    modal.querySelector('.modal-title').textContent = "Taper ici une URL";
    modalBtn.textContent = "Load";
    modalInput.value = null;
    showModal();
    modal.setAttribute('data-type', 'load-url');
});

modalBtn.addEventListener("click", modalBtnClick);
modalInput.addEventListener("keyup", modalKeyUp);
modal.addEventListener("keyup", modalKeyUp);


function modalBtnClick(e) {
    const value = modalInput.value.replace('.txt', '').replace('.js', '').trim();
    if (value) {
        if (modal.dataset.type === 'download') {
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(editor.getValue()));
            element.setAttribute('download', `${value}.js`);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            closeModal();
        } else {
            const getFileNameFromUrl = (url) => {
                const pattern = /\.(css|html|json|js|php)/i;
                if (url) {
                    if (pattern.test(url)) {
                        return url.split('/').pop().split('#')[0].split('?')[0];
                    }
                }
                return '';
            };
            const xhr = new XMLHttpRequest();
            xhr.open('GET', value);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    const data = xhr.response;
                    editor.setValue(data);
                    closeModal();
                    fileName = getFileNameFromUrl(value);
                } else {
                    const err = JSON.stringify(xhr);
                    console.log(err);
                    modalErrorHint.removeAttribute('hidden');
                }
            };
            xhr.send();
        }
    }
}

function modalKeyUp(e) {
    modalErrorHint.setAttribute('hidden', '');
    if (e.which === 13) {
        modalBtnClick();
        return false;
    }

    if (e.which === 27) {
        closeModal();
        return false;
    }
}

modalBackdrop.addEventListener('click', closeModal);
modalBtnClose.addEventListener('click', closeModal);

function showModal() {
    modal.classList.add('show');
    modal.style.display = 'block';
    modalInput.focus();
    modalBackdrop.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
    modalBackdrop.style.display = 'none';
    modalErrorHint.setAttribute('hidden', '');
    modalInput.value = '';
}

btnFormat.addEventListener('click', async (ev) => {
    btnFormat.classList.add("disabled");
    btnFormatLabel.style.display = 'none';
    btnFormatLoader.style.display = 'block';
    setTimeout(async () => {
        const
            content = editor.getValue(),
            length = string_length(content);
        if (length <= 0) {
            notiferror("Merci d'entrer du code dans l'input");
        } else {
            const
                mode = parseInt(modeOb.value),
                result = new Promise((resolve) => resolve(Babel.transform(content, { presets: ['es2015'] })));
            result.then(e => {
                const output = obfuscator.obfuscate(mode, content);
                editor.setValue(output);
                notif(`Code obfusquer avec succès`);
            }).catch(err => {
                console.log(err);
                err = `/*\n Error: ${err.toString()}\n*/\n\n${content}`;
                editor.setValue(err);
                notiferror(`Javascript Error`);
            })
        };
        btnFormat.classList.remove("disabled");
        btnFormatLabel.style.display = 'block';
        btnFormatLoader.style.display = 'none';
    }, 50);
});
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

    document.querySelector(".text-2").innerText = content;
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

        document.querySelector("#closetoastsucces").addEventListener("click", () => {
            toast.classList.remove("active");

            setTimeout(() => {
                progress.classList.remove("active");
                toast.style.display = "none";
            }, 300);

            clearTimeout(timer1);
            clearTimeout(timer2);
        })
    }, 15)
};
function notiferror(content) {
    const toast = document.querySelector(".toasterror"),
        progress = document.querySelector(".toasterror .progress");
    toast.style.display = "block";
    document.querySelector(".text-4").innerText = content;
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

        document.querySelector("#closetoasterror").addEventListener("click", () => {
            toast.classList.remove("active");

            setTimeout(() => {
                progress.classList.remove("active");
                toast.style.display = "none";
            }, 300);

            clearTimeout(timer1);
            clearTimeout(timer2);
        })
    }, 15)
};
