const fs = require("fs")
function sz(size) {
     const i = Math.floor(Math.log(size) / Math.log(1024)); 
     return (size / Math.pow(1024, i)).toFixed(2) * 1 + " " + ['B', 'KB', 'MB', 'GB', 'TB'][i];
 };

function img(e) {
    if (e === "txt" || e === "pdf") return "fa fa-file-text-o";
    if (e === "png" || e === "jpg" || e === "webp" || e === "ico" || e === "gif" || e === "jpeg" || e === "svg") return "fa fa-file-image-o";
    if (e === "mp4" || e === "mov") return "fa fa-file-video-o";
    if (e === "mp3") return "fa fa-file-sound-o";
    if (e === "html" || e === "css" || e === "js" || e === "ejs" || e === "json" || e === "php" || e === "py" || e === "cpp" || e === "cs" || e === "c" || e === "scss") return "fa fa-file-code-o";
    if (e === "zip" || e === "rar" || e === "exe") return "fa fa-file-archive-o";

    if (e) return "fa fa-file-o";
}
function base64(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}

module.exports = {sz,img,base64}