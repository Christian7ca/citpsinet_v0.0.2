$('#imagenes').multifile({
    container: ".upload-container",
    template: function(file) {
        var fileName = file.name;
        var fileExtension = file.name.split('.').pop();

        var result =
            '<p class="uploaded_image">' +
            '<a href="#" class="multifile_remove_input"><i class="icon close"></i></a>' +
            '<span class="filename">$fileName ($fileExtension)</span>' +
            '</p>';

        result = result.replace('$fileExtension', fileExtension).replace('$fileName', fileName)

        return $(result);
    }
});
$('#imagenes_update').multifile({
    container: ".update_container",
    template: function(file) {
        var fileName = file.name;
        var fileExtension = file.name.split('.').pop();

        var result =
            '<p class="uploaded_image">' +
            '<a href="#" class="multifile_remove_input"><i class="icon close"></i></a>' +
            '<span class="filename">$fileName ($fileExtension)</span>' +
            '</p>';

        result = result.replace('$fileExtension', fileExtension).replace('$fileName', fileName)

        return $(result);
    }
});
$('#archivos').multifile({
    container: ".upload-files-container",
    template: function(file) {
        var fileName = file.name;
        var fileExtension = file.name.split('.').pop();

        var result =
            '<p class="uploaded_image">' +
            '<a href="#" class="multifile_remove_input"><i class="icon close"></i></a>' +
            '<span class="filename">$fileName ($fileExtension)</span>' +
            '</p>';

        result = result.replace('$fileExtension', fileExtension).replace('$fileName', fileName)

        return $(result);
    }
});
$('#archivos_update').multifile({
    container: ".update-files-container",
    template: function(file) {
        var fileName = file.name;
        var fileExtension = file.name.split('.').pop();

        var result =
            '<p class="uploaded_image">' +
            '<a href="#" class="multifile_remove_input"><i class="icon close"></i></a>' +
            '<span class="filename">$fileName ($fileExtension)</span>' +
            '</p>';

        result = result.replace('$fileExtension', fileExtension).replace('$fileName', fileName)

        return $(result);
    }
});
$("#frm-crear-convocatoria").on("submit", function(e) {

    e.preventDefault();
    var datos = new FormData(document.getElementById('frm-crear-convocatoria'));
    $.ajax({
        headers: {
            Accept: "text/plain; charset=utf-8"
        },
        data: datos,
        url: window.location.pathname + '/newAnnouncement',
        type: 'post',
        processData: false, // Important!
        contentType: false,
        cache: false,
        beforeSend: function() {
            $("#frm-crear-convocatoria").append(` <div id='loader' class="ui active inverted dimmer">
                                                <div class="ui text loader">Loading</div>
                                            </div>`);
        },
        success: function(response) {
            $('#loader').remove();
            var contenedorConvocatorias = document.getElementById('contenedor-convocatorias')
            var layoutConvocatoria = document.getElementById('template-convocatoria').innerHTML
            var templateConvocatoria = Handlebars.compile(layoutConvocatoria)
            contenedorConvocatorias.innerHTML += templateConvocatoria({
                id: response.convocatoria.id,
                titulo: response.convocatoria.titulo,
                imagen: response.convocatoria.imagen[0].nombre,
                descripcion: response.convocatoria.descripcion,
                inicio: moment.unix(response.convocatoria.fecha_inicio).format('DD/MM/YYYY'),
                final: moment.unix(response.convocatoria.fecha_final).format('DD/MM/YYYY'),
            })
        }
    });
});

$.ajax({
    headers: {
        Accept: "application/json"
    },
    url: window.location.pathname + '/showAnnouncements',
    type: 'POST',
    success: function(convocatorias) {
        if (convocatorias.length == 0) {
            $('.ui.special.cards').append(`
            <h2 class="ui icon header grey">
                <i class="folder open outline icon"></i>
                <div class="content">No hay convocatorias vigentes, <div class="sub header">agregue una nueva convocatoria.</div>
                </div>
            </h2>`);
        } else {
            var contenedorConvocatorias = document.getElementById('contenedor-convocatorias')
            var layoutConvocatoria = document.getElementById('template-convocatoria').innerHTML
            var templateConvocatoria = Handlebars.compile(layoutConvocatoria)
            convocatorias.forEach(function(convocatoria, index, array) {
                contenedorConvocatorias.innerHTML += templateConvocatoria({
                    id: convocatoria.id,
                    titulo: convocatoria.titulo,
                    imagen: convocatoria.imagen[0].nombre,
                    descripcion: convocatoria.descripcion,
                    inicio: moment.unix(convocatoria.fecha_inicio).format('DD/MM/YYYY'),
                    final: moment.unix(convocatoria.fecha_final).format('DD/MM/YYYY'),
                })
            })
        }
    }
});