/**
 * Petición para caragar los avisos que están vigentes
 */

$.ajax({
    headers: {
        Accept: "application/json"
    },
    url: window.location.pathname + '/showNotices',
    type: 'POST',
    success: function(avisos) {
        if (avisos.length == 0) {
            $('.ui.special.cards').append(`
            <h2 class="ui icon header grey">
                <i class="folder open outline icon"></i>
                <div class="content">No hay avisos vigentes, <div class="sub header">agregue un nuevo aviso.</div>
                </div>
            </h2>`);
        } else {
            var contenedorAvisos = document.getElementById('contenedor-avisos')
            var layoutAvisos = document.getElementById('template-avisos').innerHTML
            var templateAvisos = Handlebars.compile(layoutAvisos)
            avisos.forEach(function(aviso, index, array) {
                contenedorAvisos.innerHTML += templateAvisos({
                    id: aviso.id,
                    imagen: aviso.imagen,
                    fecha: moment.unix(aviso.id).format('DD/MM/YYYY, h:mm a')
                })
            })
        }
    }
});

var avisos = document.getElementsByClassName
$(avisos).on('mousemove', '.special.cards .image', function(e) {
    $('.special.cards .image').dimmer({
        on: 'hover'
    });
});
if ($(window).width() < 768) {
    $(avisos).on('click', '.special.cards .image', function(e) {
        $('.special.cards .image').dimmer({
            on: 'click'
        });
    });
}

$("#frm-crear-aviso").on("submit", function(e) {
    e.preventDefault();
    var image = new FormData(document.getElementById('frm-crear-aviso'))
    $.ajax({
        headers: {
            Accept: "application/json"
        },
        data: image,
        url: window.location.pathname + '/newNotice',
        type: 'POST',
        cache: false,
        contentType: false,
        processData: false,
        beforeSend: function() {
            $("#frm-crear-aviso").append(` <div id='loader' class="ui active inverted dimmer">
                                            <div class="ui text loader">Loading</div>
                                            </div>`);
        },
        success: function(aviso) {
            $('#loader').remove();
            document.getElementById('frm-crear-aviso').reset()
            alert(aviso.message)
            $.ajax({
                headers: {
                    Accept: "application/json"
                },
                url: window.location.pathname + '/showNotices',
                type: 'POST',
                success: function(avisos) {
                    $('#contenedor-avisos').empty()
                    var contenedorAvisos = document.getElementById('contenedor-avisos')
                    var layoutAvisos = document.getElementById('template-avisos').innerHTML
                    var templateAvisos = Handlebars.compile(layoutAvisos)
                    console.log(aviso)
                    avisos.forEach(function(aviso, index, array) {
                        contenedorAvisos.innerHTML += templateAvisos({
                            id: aviso.id,
                            imagen: aviso.imagen,
                            fecha: moment.unix(aviso.id).format('DD/MM/YYYY, h:mm a')
                        })
                    })
                }
            });
        }
    })
})

$(avisos).on('click', '.eliminar-evento', function() {
    var aviso = this
    $('#eliminar-evento').modal({
            onApprove: function() {
                $.ajax({
                    headers: {
                        Accept: "application/json"
                    },
                    url: window.location.pathname + '/deleteNotice',
                    type: 'DELETE',
                    data: { id: $(aviso).attr('data-id') },
                    success: function(message) {
                        alert(message.message)
                        $(`#${$(aviso).attr('data-id')}`).remove()
                    }
                })
            }
        })
        .modal('show');
})