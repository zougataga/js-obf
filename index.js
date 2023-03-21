const {
    mode0,
    mode1,
    mode2,
    mode3,
    ObfuscatorIo
} = require("./lib/utils.js");

async function obfuscate(mode, code) {
    let output;
    try {
        if (mode == 0) output = await mode0(code);
        else if (mode == 1) output = mode1(code);
        else if (mode == 2) output = mode2(code);
        else if (mode == 3) output = mode3(code);
        output = ObfuscatorIo(output)
    } catch (e) {
        console.log(`JS-OBFUSCATOR: ${e}`);
        output = ObfuscatorIo(code);
    };
    return `// @{Author}: https://github.com/zougataga\n// @{JS-Obfuscator}: https://github.com/zougataga/js-obfuscator\n\n${output}`;
};
exports.obfuscate = obfuscate;