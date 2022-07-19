const img = async (e) => {
    let result = "";
    if (e === "txt" || e === "pdf") result = "fa fa-file-text-o";
    if (e === "png" || e === "jpg" || e === "webp" || e === "ico" || e === "gif" || e === "jpeg" || e === "svg") result = "fa fa-file-image-o";
    if (e === "mp4" || e === "mov") result = "fa fa-file-video-o";
    if (e === "mp3") result = "fa fa-file-sound-o";
    if (e === "html" || e === "css" || e === "js" || e === "ejs" || e === "json" || e === "php" || e === "py" || e === "cpp" || e === "cs" || e === "c" || e === "scss") result = "fa fa-file-code-o";
    if (e === "zip" || e === "rar" || e === "exe") result = "fa fa-file-archive-o";
    if (result != "") return String(result);
    else return String("fa fa-file-o")
};
module.exports = img;