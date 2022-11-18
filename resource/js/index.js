//  llx404 on github

window.input = CodeMirror.fromTextArea($('#input').get(0), { mode: "javascript", gutter: true, lineNumbers: true });
window.output = CodeMirror.fromTextArea($('#output').get(0), { mode: "javascript", gutter: true, readOnly: 'nocursor', lineNumbers: true });

const inputInvisible = document.querySelector("#input");
const outputInvisible = document.querySelector("#outpout");
const allCodeMirror = document.querySelectorAll(".CodeMirror");

const Mode = {
  UNICODE_1: "unicode-1",
  UNICODE_2: 'unicode-2',
  UNICODE_3: 'unicode-3'
};

inputLength();
outputLength();

let mode = Mode.UNICODE_2;


$("#obfuscate").click(() => goo());
// document.addEventListener('keyup', (event) => {
//   switch (event.keyCode) {
//     // enter
//     case 13:
//       goo();
//       break;
//   }
// });

$("#download-input").click(() => {
  const input = window.input.getValue();
  telecharger("input.txt", input);
  notif("Input download avec succès")
});
$("#copy-input").click(() => {
  const input = window.input.getValue();
  navigator.clipboard.writeText(input);
  notif("Input copié avec succès")
});
$("#clear-input").click(() => {
  window.input.setValue("// TON CODE");
  notif("Input clear avec succès")
});
window.input.on("change", function () {
  inputLength();
  window.input.save()
});

$("#download-output").click(() => {
  const output = window.output.getValue();
  telecharger("output.txt", output);
  notif("Output download avec succès")
});
$("#copy-output").click(() => {
  const output = window.output.getValue();
  navigator.clipboard.writeText(output);
  notif("Output copié avec succès")
});
$("#clear-output").click(() => {
  window.output.setValue("// RESULTAT");
  window.input.setValue("// TON CODE");
  notif("Input/Output clear avec succès");
});
window.output.on("change", function () { window.output.save() });




function goo() {
  const content = window.input.getValue();
  const length = string_length(content);
  if (length <= 0) {
    notiferror("Merci d'entrer du code dans l'input")
    return;
  };
  const result = new Promise((resolve) => resolve(Babel.transform(content, { presets: ['es2015'] })));
  result.then(e => {
    go();
    notif(`Code obfusquer avec succès [${mode}]`);
  }).catch(err => {
    err = `Error: ${err.toString()}`
    window.output.setValue(err);
    notiferror(`Input Javascript Error [${mode}]`)
  });
  if (window.matchMedia("(max-width: 600px)").matches) {
    $('html,body').animate({ scrollTop: $("#outputdiv").offset().top }, 'slow');
  };
}
async function go() {
  const input = window.input.getValue();
  await inputLength();
  await outputLength();
  let output;
  try {
    if (mode === Mode.UNICODE_1) {
      output = await unicode1(input);
    } else if (mode === Mode.UNICODE_2) {
      output = await unicode2(input);
    } else if (mode === Mode.UNICODE_3) {
      output = await unicode3(input);
    }
  } catch (e) {
    output = await obfuscate(input);
    // console.log(e);
    // window.output.setValue(`Error: ${e}`);
  }
  window.output.setValue(`// @{Author}: https://github.com/zougataga\n// @{JS-Obfuscator}: https://github.com/zougataga/js-obfuscator\n\n${output}`);
  $('#output-count')[0].innerText = `${string_length(output)} chars`;
}


async function unicode1(input) {
  let code = await obfuscate2('ZOUGATAGAONGITHUB', input);
  code = await obfuscate(code);
  return code;
}


async function unicode2(input) {
  input = await obfuscate(input, true);
  if (input.length % 2 === 1) {
    input += ' ';
  }
  let output = '';
  for (let i = 0; i < input.length; i += 2) {
    output += String.fromCharCode(0xD800 + input.charCodeAt(i));
    output += String.fromCharCode(0xDC00 + input.charCodeAt(i + 1))
  }
  let code = `eval(unescape(escape\`${output}\`.replace(/u../g,'')))`;
  for (const char of input) {
    if (char.charCodeAt(0) > 255) {
      code = input
    }
  }
  if (unescape(escape(output).replace(/u../g, '')) !== input) {
    code = input
    // throw 'Une erreur est survenue !';
  };
  code = await obfuscate(code);
  return code;
}

async function unicode3(input) {
  let code = "";
  input = await obfuscate(input, true);
  if (!input.startsWith(';')) {
    input = ';' + input;
  }
  while (input.length % 3 !== 0) {
    input += ' ';
  }
  let output = '';
  for (let i = 0; i < input.length / 3; i++) {
    output += String.fromCodePoint(
      (input.charCodeAt(i) - 31) * 97 * 97 +
      (input.charCodeAt(i + input.length / 3) - 31) * 97 +
      input.charCodeAt(i + 2 * input.length / 3) - 31);
  }
  let test = '';
  for (let i = 2; i >= 0; i--) {
    for (const c of output) {
      test += String.fromCharCode(c.codePointAt(0) / 97 ** i % 97 + 31);
    }
  }
  code = `for(_=i=3;i--;)for(c of'${output}')_+=String.fromCharCode(c.codePointAt()/97**i%97+31);eval(_)`;
  for (const char of input) {
    const charCode = char.charCodeAt(0);
    if (charCode < 32 || charCode > 127) {
      code = input
    }
  }
  if (test !== input) {
    code = input
    // throw 'Une erreur est survenue !';
  };
  code = await obfuscate(code)
  return code;

}

function obfuscate(code, compres) {
  if (!compres) compres = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 1,
    numbersToExpressions: true,
    simplify: true,
    stringArrayShuffle: true, splitStrings: true, simplify: true, stringArrayWrappersType: 'variable', stringArrayThreshold: 1
  };
  else compres = { compact: true, };
  const result = JavaScriptObfuscator.obfuscate(code, compres);
  return result.getObfuscatedCode();
}

function maRainey(v) {
  var o = '';
  for (var i = 0; i < v; i++) {
    o += String.fromCharCode(92);
  }
  return o;
}
function obfuscate2(glob, code) {
  var r = '';
  var n;
  var t;
  var b = ["___", "__$", "_$_", "_$$", "$__", "$_$", "$$_", "$$$", "$___", "$__$", "$_$_", "$_$$", "$$__", "$$_$", "$$$_", "$$$$"];
  var s = '';
  for (var i = 0; i < code.length; i++) {
    n = code.charCodeAt(i);
    if (n == 0x22 || n == 0x5c) {
      s += maRainey(3) + code.charAt(i).toString(16);
    } else if ((0x21 <= n && n <= 0x2f) || (0x3A <= n && n <= 0x40) || (0x5b <= n && n <= 0x60) || (0x7b <= n && n <= 0x7f)) {
      s += code.charAt(i);
    } else if ((0x30 <= n && n <= 0x39) || (0x61 <= n && n <= 0x66)) {
      if (s) r += '"' + s + '"+';
      r += glob + '.' + b[n < 0x40 ? n - 0x30 : n - 0x57] + '+';
      s = "";
    } else if (n == 0x6c) {
      if (s) r += '"' + s + '"+';
      r += '(![]+"")[' + glob + '._$_]+';
      s = "";
    } else if (n == 0x6f) {
      if (s) r += '"' + s + '"+';
      r += glob + "._$+";
      s = "";
    } else if (n == 0x74) {
      if (s) r += '"' + s + '"+';
      r += glob + ".__+";
      s = "";
    } else if (n == 0x75) {
      if (s) r += '"' + s + '"+';
      r += glob + "._+";
      s = "";
    } else if (n < 128) {
      if (s) r += '"' + s;
      else r += '"';
      r += maRainey(2) + '"+' + n.toString(8).replace(/[0-7]/g, function (c) {
        return glob + '.' + b[c] + '+'
      });
      s = "";
    } else {
      if (s) r += '"' + s;
      else r += '"';
      r += maRainey(2) + '"+' + glob + '._+' + n.toString(16).replace(/[0-9a-f]/gi, function (c) {
        return glob + '.' + b[parseInt(c, 16)] + '+'
      });
      s = "";
    }
  }
  if (s) r += '"' + s + '"+';
  r = glob + "=~[];" + glob + "={___:++" + glob + ',$$$$:(![]+"")[' + glob + "],__$:++" + glob + ',$_$_:(![]+"")[' + glob + "],_$_:++" + glob + ',$_$$:({}+"")[' + glob + "],$$_$:(" + glob + "[" + glob + ']+"")[' + glob + "],_$$:++" + glob + ',$$$_:(!""+"")[' + glob + "],$__:++" + glob + ",$_$:++" + glob + ',$$__:({}+"")[' + glob + "],$$_:++" + glob + ",$$$:++" + glob + ",$___:++" + glob + ",$__$:++" + glob + "};" + glob + ".$_=" + "(" + glob + ".$_=" + glob + '+"")[' + glob + ".$_$]+" + "(" + glob + "._$=" + glob + ".$_[" + glob + ".__$])+" + "(" + glob + ".$$=(" + glob + '.$+"")[' + glob + ".__$])+" + "((!" + glob + ')+"")[' + glob + "._$$]+" + "(" + glob + ".__=" + glob + ".$_[" + glob + ".$$_])+" + "(" + glob + '.$=(!""+"")[' + glob + ".__$])+" + "(" + glob + '._=(!""+"")[' + glob + "._$_])+" + glob + ".$_[" + glob + ".$_$]+" + glob + ".__+" + glob + "._$+" + glob + ".$;" + glob + ".$$=" + glob + ".$+" + '(!""+"")[' + glob + "._$$]+" + glob + ".__+" + glob + "._+" + glob + ".$+" + glob + ".$$;" + glob + ".$=(" + glob + ".___)[" + glob + ".$_][" + glob + ".$_];" + glob + ".$(" + glob + ".$(" + glob + '.$$+"' + maRainey(1) + '""+' + r + '"' + maRainey(1) + '"")())();';
  return r;
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
function telecharger(name, content) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', name);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};



// settings

$("#open-modal").click(() => {
  const cook = getCookMode();
  const m = $().simpleModal({
    name: 'settings',
    title: 'Settings',
    content: `
    <label id="settingstitle" for="select">1. Unicode</label>
    <select name="select" id="select">
        <option value="1" ${!cook || cook == Mode.UNICODE_1 ? "selected" : ""}>Unicode 1</option>
        <option value="2" ${cook == Mode.UNICODE_2 ? "selected" : ""}>Unicode 2</option>
        <option value="3" ${cook == Mode.UNICODE_3 ? "selected" : ""}>Unicode 3</option>
    </select>
    `,
    size: 'small',
    freeze: true,
    callback: function () {
      $("#select").change(async (e) => {
        const val = $("#select").val();

        if (val == "1") await setMode(Mode.UNICODE_1);
        else if (val == "2") await setMode(Mode.UNICODE_2);
        else if (val == "3") await setMode(Mode.UNICODE_3);

        m.close("settings")
        goo();
      });
    }
  })
});
function setMode(newMode) {
  setCookie("mode", newMode, 7);
  mode = newMode;
}
function getCookMode() {
  const cook = getCookie("mode");
  return cook;
}

$(document).ready(() => {
  allCodeMirror.forEach(e => {
    const divWidth = (e.offsetWidth) + "px";
    e.style.maxWidth = divWidth;
  });
  if (getCookMode()) {
    mode = getCookMode()
  } else {
    setMode(Mode.UNICODE_1);
    //  notif("Unicode 3 définit avec succès !")
  }
});
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
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
function inputLength() {
  const input = window.input.getValue();
  const count = $('#input-count')[0];
  const length = string_length(input);

  if (length <= 0) count.classList.add("non");
  else count.classList.remove("non");

  count.innerText = `${length} caractère${length <= 1 ? "" : "s"}`;
}
function outputLength() {
  const output = window.output.getValue();
  const count = $('#output-count')[0];
  const length = string_length(output);

  if (length <= 0) count.classList.add("non");
  else count.classList.remove("non");

  count.innerText = `${length} caractère${length <= 1 ? "" : "s"}`;
}
// window.addEventListener("resize", resizeAlert(), false);
// function resizeAlert() {
//   console.log(1);
//   const e = $().simpleModal({
//     name: 'warning2',
//     title: '⚠ Attention',
//     content: `
//      <p>Merci de ne pas resize la page !</p>
//      <div class="optioncode" style="justify-content:flex-start"><a class="go" id="vue2">Ok</a></div>
//       `,
//     size: 'small',
//     freeze: true,
//     callback: function () {
//       $("#vue2").click(() => {
//         e.close("warning2");
//         window.location.reload();
//       });
//     }
//   });

//   // window.location.reload();
// }


// scroll reveal
// const sr = ScrollReveal({
//   distance: '60px',
//   interval: 50,
// });
// sr.reveal(`.col`, { origin: 'top' })
// sr.reveal(`.title`, { origin: 'left' })
// sr.reveal(`.optioncode`, { origin: 'right' })



