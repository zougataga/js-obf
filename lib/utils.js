const
    JavaScriptObfuscator = require("javascript-obfuscator"),
    buffer = require('safe-buffer').Buffer,
    randombytes = require('randombytes'),
    fs = require('fs'),
    browserify = require("browserify"),
    uglifyjs = require('uglify-js');

// Javascript-obfuscator
function ObfuscatorIo(code, compres) {
    if (!compres) compres = {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: true,
        simplify: true,
        stringArrayShuffle: true, splitStrings: true, simplify: true, stringArrayWrappersType: 'variable', stringArrayThreshold: 1
    };
    else compres = { compact: true, };
    return (JavaScriptObfuscator.obfuscate(code, compres)).getObfuscatedCode();
}
exports.ObfuscatorIo = ObfuscatorIo;

// MODE
async function mode0(input) {
    const
        code = uglifyjs.minify(input).code,
        template = `(function() {var buffer = require('safe-buffer').Buffer, code = buffer.from('{{code}}', 'hex'), decoded = buffer.allocUnsafe(0);for(var i = 0; i < code.length; i = i + {{number}}) decoded = buffer.concat([ decoded, code.slice(i+1, i + {{number}})]);eval(decoded.toString('utf8'));})();`,
        obfuscated = JavaScriptObfuscator.obfuscate(code, {
            compact: true,
            controlFlowFlattening: true
        }),
        code_buffer = buffer.from(obfuscated.getObfuscatedCode()),
        byteDepth = Math.floor(Math.random() * (8 - 4 + 1)) + 4;
    let finalBuf = buffer.allocUnsafe(0);

    for (let i = 0; i < code_buffer.length; i = i + byteDepth) { finalBuf = buffer.concat([finalBuf, buffer.from(randombytes(1)), code_buffer.slice(i, i + byteDepth)]) };

    fs.writeFileSync(__dirname + "/obfuscatedcode.js", template.replace(/\{\{number\}\}/gi, byteDepth + 1));
    return await new Promise(resolve => {
        browserify(__dirname + "/obfuscatedcode.js")
            .bundle(function (err, buf) {
                const finalCode = JavaScriptObfuscator.obfuscate(uglifyjs.minify(buf.toString('utf8')).code.replace(/\{\{code\}\}/gi, finalBuf.toString('hex')), {
                    compact: true,
                    controlFlowFlattening: true
                });
                try { fs.unlinkSync(__dirname + "/obfuscatedcode.js") } catch (error) { }
                resolve(finalCode.getObfuscatedCode())
            })
    })
}
exports.mode0 = mode0;

function mode1(code) {
    let r = '', n, t, b = ["___", "__$", "_$_", "_$$", "$__", "$_$", "$$_", "$$$", "$___", "$__$", "$_$_", "$_$$", "$$__", "$$_$", "$$$_", "$$$$"], s = '';
    const glob = "$$ZOUGATAGAONGITHUB";
    for (let i = 0; i < code.length; i++) {
        n = code.charCodeAt(i);
        if (n == 0x22 || n == 0x5c) s += maRainey(3) + code.charAt(i).toString(16);
        else if ((0x21 <= n && n <= 0x2f) || (0x3A <= n && n <= 0x40) || (0x5b <= n && n <= 0x60) || (0x7b <= n && n <= 0x7f)) s += code.charAt(i);
        else if ((0x30 <= n && n <= 0x39) || (0x61 <= n && n <= 0x66)) {
            if (s) r += '"' + s + '"+';
            r += glob + '.' + b[n < 0x40 ? n - 0x30 : n - 0x57] + '+';
            s = ""
        } else if (n == 0x6c) {
            if (s) r += '"' + s + '"+';
            r += '(![]+"")[' + glob + '._$_]+';
            s = ""
        } else if (n == 0x6f) {
            if (s) r += '"' + s + '"+';
            r += glob + "._$+";
            s = ""
        } else if (n == 0x74) {
            if (s) r += '"' + s + '"+';
            r += glob + ".__+";
            s = ""
        } else if (n == 0x75) {
            if (s) r += '"' + s + '"+';
            r += glob + "._+";
            s = ""
        } else if (n < 128) {
            if (s) r += '"' + s;
            else r += '"';
            r += maRainey(2) + '"+' + n.toString(8).replace(/[0-7]/g, function (c) {
                return glob + '.' + b[c] + '+'
            });
            s = ""
        } else {
            if (s) r += '"' + s;
            else r += '"';
            r += maRainey(2) + '"+' + glob + '._+' + n.toString(16).replace(/[0-9a-f]/gi, function (c) {
                return glob + '.' + b[parseInt(c, 16)] + '+'
            });
            s = ""
        }
    }
    if (s) r += '"' + s + '"+';
    r = glob + "=~[];" + glob + "={___:++" + glob + ',$$$$:(![]+"")[' + glob + "],__$:++" + glob + ',$_$_:(![]+"")[' + glob + "],_$_:++" + glob + ',$_$$:({}+"")[' + glob + "],$$_$:(" + glob + "[" + glob + ']+"")[' + glob + "],_$$:++" + glob + ',$$$_:(!""+"")[' + glob + "],$__:++" + glob + ",$_$:++" + glob + ',$$__:({}+"")[' + glob + "],$$_:++" + glob + ",$$$:++" + glob + ",$___:++" + glob + ",$__$:++" + glob + "};" + glob + ".$_=" + "(" + glob + ".$_=" + glob + '+"")[' + glob + ".$_$]+" + "(" + glob + "._$=" + glob + ".$_[" + glob + ".__$])+" + "(" + glob + ".$$=(" + glob + '.$+"")[' + glob + ".__$])+" + "((!" + glob + ')+"")[' + glob + "._$$]+" + "(" + glob + ".__=" + glob + ".$_[" + glob + ".$$_])+" + "(" + glob + '.$=(!""+"")[' + glob + ".__$])+" + "(" + glob + '._=(!""+"")[' + glob + "._$_])+" + glob + ".$_[" + glob + ".$_$]+" + glob + ".__+" + glob + "._$+" + glob + ".$;" + glob + ".$$=" + glob + ".$+" + '(!""+"")[' + glob + "._$$]+" + glob + ".__+" + glob + "._+" + glob + ".$+" + glob + ".$$;" + glob + ".$=(" + glob + ".___)[" + glob + ".$_][" + glob + ".$_];" + glob + ".$(" + glob + ".$(" + glob + '.$$+"' + maRainey(1) + '""+' + r + '"' + maRainey(1) + '"")())();';
    return r;
    function maRainey(v) {
        let o = '';
        for (let i = 0; i < v; i++) {
            o += String.fromCharCode(92);
        }
        return o;
    }
};
exports.mode1 = mode1;

function mode2(input) {
    if (input.length % 2 === 1) input += ' ';
    let output = '';
    for (let i = 0; i < input.length; i += 2) {
        output += String.fromCharCode(0xD800 + input.charCodeAt(i));
        output += String.fromCharCode(0xDC00 + input.charCodeAt(i + 1))
    };
    let code = `eval(unescape(escape\`${output}\`.replace(/u../g,'')))`;
    for (const char of input) {
        if (char.charCodeAt(0) > 255) {
            code = input
        }
    };
    if (unescape(escape(output).replace(/u../g, '')) !== input) {
        code = input
        // throw 'Une erreur est survenue !';
    };
    return code;
}
exports.mode2 = mode2;

function mode3(input) {
    let code = "";
    code = ObfuscatorIo(code);
    if (!input.startsWith(';')) input = ';' + input;
    while (input.length % 3 !== 0) { input += ' '; }
    let output = '';
    for (let i = 0; i < input.length / 3; i++) {
        output += String.fromCodePoint(
            (input.charCodeAt(i) - 31) * 97 * 97 +
            (input.charCodeAt(i + input.length / 3) - 31) * 97 +
            input.charCodeAt(i + 2 * input.length / 3) - 31);
    };
    let test = '';
    for (let i = 2; i >= 0; i--) {
        for (const c of output) {
            test += String.fromCharCode(c.codePointAt(0) / 97 ** i % 97 + 31)
        }
    };
    code = `for(_=i=3;i--;)for(c of'${output}')_+=String.fromCharCode(c.codePointAt()/97**i%97+31);eval(_)`;
    for (const char of input) {
        const charCode = char.charCodeAt(0);
        if (charCode < 32 || charCode > 127) code = input
    }
    if (test !== input) {
        code = input
        // throw 'Une erreur est survenue !';
    };
    return code;
}
exports.mode3 = mode3;