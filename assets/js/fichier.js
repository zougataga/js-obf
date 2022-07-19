$(document).ready(function () {
    axios.get(`${domain}/all/${user}`).then((r) => {
        var s = r.data.slm;
        $('#count').html(s.length || 0);
        $('#size').html(r.data.size || 0);
        var output = "";
        $.each(s, (index, m) => {
            output += `<a href="${domain}/fichier/${user}/${m.name}.${m.ext}"><div class="gallery"><div class="item"><i class="${m.img}"></i><span>${m.name}</span><p>${m.size} - Fichier ${m.ext}</p></div></div></a>`
        });
        if (output != "") return $('.grid').html(output);
        else {
            $('#count').html(0);
            $('#size').html(0);
            return $('.grid').html(html);
        }
    })
        .catch((err) => {
            console.log(err);
            $('#count').html(0);
            $('#size').html(0);
            return $('.grid').html(html);
        });
});
