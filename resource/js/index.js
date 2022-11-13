//  llx404 on github

window.input = CodeMirror.fromTextArea($('#input').get(0), { mode: "javascript", gutter: true, lineNumbers: true });
window.output = CodeMirror.fromTextArea($('#output').get(0), { mode: "javascript", gutter: true, readOnly: 'nocursor', lineNumbers: true });

const inputInvisible = document.querySelector("#input");
const outputInvisible = document.querySelector("#outpout");
const allCodeMirror = document.querySelectorAll(".CodeMirror");

const Mode = {
  UNICODE_2: 'unicode-2',
  UNICODE_3: 'unicode-3'
};

inputLength();
outputLength();

let mode = Mode.UNICODE_2;


$("#obfuscate").click(() => goo());
document.addEventListener('keyup', (event) => {
  switch (event.keyCode) {
    // enter
    case 13:
      goo();
      break;
  }
});

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
  try {
    let output;
    if (mode === Mode.UNICODE_2) {
      output = await compressUnicode2(input);
    } else if (mode === Mode.UNICODE_3) {
      output = await unicode3(input);
    };
    window.output.setValue(output);
    $('#output-count')[0].innerText = `${string_length(output)} chars`;
  } catch (e) {
    console.log(e);
    window.output.setValue(`Error: ${e}`);
  }
}

async function unicode2(input) {
  if (input.length % 2 === 1) {
    input += ' ';
  }
  let output = '';
  for (let i = 0; i < input.length; i += 2) {
    output += String.fromCharCode(0xD800 + input.charCodeAt(i));
    output += String.fromCharCode(0xDC00 + input.charCodeAt(i + 1))
  }
  if (unescape(escape(output).replace(/u../g, '')) !== input) {
    throw 'Une erreur est survenue !';
  };
  let code = `eval(unescape(escape\`${output}\`.replace(/u../g,'')))`;
  code = await obfuscate(code);
  return code;
}

async function unicode3(input) {
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
  if (test !== input) {
    throw 'Une erreur est survenue !';
  };
  let code = `for(_=i=3;i--;)for(c of'${output}')_+=String.fromCharCode(c.codePointAt()/97**i%97+31);eval(_)`;
  code = await obfuscate(code);
  return code;
}

function obfuscate(code, compres) {
  if (!compres) compres = { compact: true, controlFlowFlattening: true, controlFlowFlatteningThreshold: 1, numbersToExpressions: true, simplify: true, stringArrayShuffle: true, splitStrings: true, simplify: true, stringArrayWrappersType: 'variable', stringArrayThreshold: 1 };
  else compres = { compact: true, };
  const result = JavaScriptObfuscator.obfuscate(code, compres);
  return result.getObfuscatedCode();
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
  $().simpleModal({
    name: 'settings',
    title: 'Settings',
    content: `
    <span style="font-weight:500">- Unicode</span>
    <div class="mode-selector">
    ${!getCookMode() || getCookMode() == Mode.UNICODE_2 ? `
    <input id="mode-unicode-2" type="radio" name="mode" value="unicode-2" checked>
    <label for="mode-unicode-2">Unicode 2</label>
    <input id="mode-unicode-3" type="radio" name="mode" value="unicode-3">
    <label for="mode-unicode-3">Unicode 3</label>
    `: `
    <input id="mode-unicode-2" type="radio" name="mode" value="unicode-2" >
    <label for="mode-unicode-2">Unicode 2</label>
    <input id="mode-unicode-3" type="radio" name="mode" value="unicode-3" checked>
    <label for="mode-unicode-3">Unicode 3</label>
    `}
    </div>
    `,
    size: 'small',
    freeze: true,
    callback: function () {
      $("#mode-unicode-2").change(() => setMode(Mode.UNICODE_2));
      $("#mode-unicode-3").change(() => setMode(Mode.UNICODE_3));
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
  $('#input-count')[0].innerText = `${string_length(input)} caractère`;
}
function outputLength() {
  const output = window.output.getValue();
  $('#output-count')[0].innerText = `${string_length(output)} caractère`;
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
