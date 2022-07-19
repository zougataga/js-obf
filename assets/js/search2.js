const domain = "https://freedrive-llx.herokuapp.com";
var html = "<span id='alert'>Aucun fichier trouvé</span>";
const user = document.getElementsByClassName("name")[0].innerText;

$(document).ready(function () {
    $('#searchFrom').keypress(function (event) {
        if (event.keyCode == 13 || event.which == 13) {
            var s = $("#searchText").val();
            if (s == "" || !s) return;
          get(s);
        }
    })
});
function get(pp) {
  window.location.href = "/fichier"
}
function sz(size) {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + " " + ['B', 'KB', 'MB', 'GB', 'TB'][i];
};