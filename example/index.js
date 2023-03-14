const
    Obfuscator = require("js-obf"),
    obfuscator = new Obfuscator(),
    code = `
function hi() {
   console.log("Hello World!");
}
hi();`,
    codeOb = obfuscator.obfuscate(1, code);
console.log(codeOb);