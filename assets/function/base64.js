const fs = require("fs");
const base64 = async (file) => {
    var bitmap = fs.readFileSync(file);
    return String(new Buffer(bitmap).toString('base64'));
};
module.exports = base64;