var fileCollection = new Array();
//    var fileCollection = new Array();

$("#images").on('change', function (e) {
    var files = e.target.files;
    $.each(files, function (i, file) {
        fileCollection = [];
        fileCollection.push(file);
        //            console.log(file);
        var reader = new FileReader();
        //            console.log(reader);

        reader.readAsDataURL(file);
        reader.onload = function (e) {
            var template = '<div class="formImage"><form action="/upload" class="format">' +
                '<img src="' + e.target.result + '" class="imageThumbnail" alt="">' +
                '<button type="submit" class="btn btn-sm btn-info upload">Save</button>' +
                '</form></div>';

            $("#images-to-upload").html(template);
        }
    });
    $('div.imageContainer').css('box-shadow', "0 0 20px #333");
});
$(document).on('submit', 'form', function (e) {
    e.preventDefault();
    //
    //        console.log('form Prevented');
    //        console.log(fileCollection);
    //        console.log($(this));
    //        console.log($(this)[0]);

    var index = $(this).index();
    var formData = new FormData($(this)[0])
    formData.append('image', fileCollection[index]);

    var data = formData;


    var request = new XMLHttpRequest();
    request.open('post', 'server.php', true);
    request.send(formData);
    $('div.imageContainer').css('box-shadow', "#0275d8 0px 0px 20px");
    $('.upload').css('bottom', "250px");

})

