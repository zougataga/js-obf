const domain = "https://freedrive-llx.herokuapp.com"
let html = "<span id='alert'>Aucun fichier trouvé</span>"
$(document).ready(function () {

    $('#searchFrom').keypress(function (event) {
        if (event.keyCode == 13 || event.which == 13) {

            let s = $("#searchText").val();
            if (s == "" || !s) return;
            if (!document.getElementsByClassName("grid")) window.location = `${domain}`;
            get(s);
        }
    });
})
function get(pp) {
    axios.get(`${domain}/all/${user}`)
        .then((response) => {
            let a = ""
            let array = []
            let output = ``
            let sze = ""
            response.data.slm.filter(rr => {
                if (rr.name.toLowerCase().includes(pp.toLowerCase()) || rr.name.toLowerCase() === pp.toLowerCase()) {
                    a = true, array.push(rr), sze += rr.base

                }
            })
            if (sze === "") sze = 0
            if (a != "") {
                $('#count').html(array.length);
                $('#size').html(sz(sze));
                $.each(array, (index, m) => {
                    output += `<a href="${domain}/fichier/${user}/${m.name}.${m.ext}"><div class="gallery"><div class="item"><i class="${m.img}"></i><span>${m.name}</span><p>${m.size} - Fichier ${m.ext}</p></div></div></a>`
                })
                $('.grid').html(output);
            } else {
                return $('.grid').html(html);

            }
        }).catch((err) => {
            console.log(err);
            return $('.grid').html(html);
        });
}


function sz(size) {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + " " + ['B', 'KB', 'MB', 'GB', 'TB'][i];
};