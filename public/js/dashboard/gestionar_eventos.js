var nombreEvento
var inicioEvento
var finalEvento
var descripcionEvento
var contactoEvento
var imagenEvento
    /*  var time = moment('06/11/17', 'DD/MM/YYYY').unix();
     var format = moment.unix(time).format("DD/MM/YYYY");
     console.log(time);
     console.log(format); */

/**
 * Función que realiza una petición POST para crear un Evento
 */
$("#frm-crear-evento").on("submit", function(e) {

    e.preventDefault();
    var datosInput = new FormData(document.getElementById('frm-crear-evento'));

    $.ajax({
        headers: {
            Accept: "text/plain; charset=utf-8"
        },
        data: datosInput,
        url: window.location.pathname + '/new',
        type: 'post',
        processData: false, // Important!
        contentType: false,
        cache: false,
        beforeSend: function() {
            $("#frm-crear-evento").append(` <div id='loader' class="ui active inverted dimmer">
                                                <div class="ui text loader">Loading</div>
                                            </div>`);
        },
        success: function(response) {
            $('#loader').remove();
            var contenedorEventos = document.getElementById('contenedorEventos')
            var layoutEvento = document.getElementById('template-evento').innerHTML
            var templateEvento = Handlebars.compile(layoutEvento)
            contenedorEventos.innerHTML += templateEvento({
                id: response.evento.id,
                urlImage: response.evento.imagen[0].uri + response.evento.imagen[0].nombre,
                title: response.evento.titulo,
                fechaInicio: moment.unix(response.evento.fecha_inicio).format('DD/MM/YYYY'),
                fechaFinal: moment.unix(response.evento.fecha_final).format('DD/MM/YYYY')
            })
            document.getElementById('frm-crear-evento').reset()
        }
    });

});

/**
 * Función que realiza la carga automática de los elementos de la Lista de eventos
 */
$.ajax({
    headers: {
        Accept: "application/json"
    },
    url: window.location.pathname + '/showEvents',
    type: 'POST',
    success: function(evento) {
        console.log(evento)
        if (evento.length == 0) {
            $('#lista-eventos > .ui.items').append(`
            <h2 class="ui icon header grey">
                <i class="folder open outline icon"></i>
                <div class="content">No tiene eventos próximos <div class="sub header">Agregue eventos llenando el formulario que se encuentra en esta misma sección.</div>
                </div>
            </h2>`);
        } else {
            var contenedorEventos = document.getElementById('contenedorEventos')
            var layoutEvento = document.getElementById('template-evento').innerHTML
            var templateEvento = Handlebars.compile(layoutEvento)
            evento.forEach(function(event, index, array) {
                contenedorEventos.innerHTML += templateEvento({
                    id: event.id,
                    urlImage: event.imagen[0].uri + event.imagen[0].nombre,
                    title: event.titulo,
                    fechaInicio: moment.unix(event.fecha_inicio).format('DD/MM/YYYY'),
                    fechaFinal: moment.unix(event.fecha_final).format('DD/MM/YYYY')
                })
            });
        }
    }
});

/**
 * Añadir eventLister en cada item de la lista de eventos
 * Petición POST para eliminar un evento
 */
var btnBorrarEvento = document.getElementsByClassName;
$(btnBorrarEvento).on('click', '.btn-borrar-evento', function() {
    var idEvent = $(this).attr('data-id-evento')
    iziToast.question({
        timeout: 50000,
        close: false,
        overlay: true,
        toastOnce: true,
        id: 'question',
        zindex: 999,
        title: 'Confirme por favor.',
        message: '¿Está seguro de querer eliminar el evento?',
        titleSize: '16',
        titleLineHeight: '20',
        position: 'center',
        buttons: [
            ['<button><b>Sí</b></button>', function(instance, toast) {

                $.ajax({
                    headers: {
                        Accept: "application/json"
                    },
                    url: window.location.pathname + '/deleteEvent',
                    type: 'DELETE',
                    data: { id: idEvent },
                    success: function(message) {
                        iziToast.success({
                            title: '¡Hecho!',
                            message: 'Evento Eliminado',
                        });
                        instance.hide(toast, { transitionOut: 'fadeOut' }, 'button');
                        $(`#${idEvent}`).remove()
                    }
                })

            }, true],
            ['<button>No</button>', function(instance, toast) {

                instance.hide(toast, { transitionOut: 'fadeOut' }, 'button');

            }]
        ]
    });
});

/**
 * Añadir eventLister en cada item de la lista de eventos
 * Petición POST que solicita los datos completos de un item y permite modificarlos
 */
var btnVerEvento = document.getElementsByClassName;
$(btnVerEvento).on('click', '.btn-ver-evento', function() {
    var idEvent = $(this).attr('data-id-evento')
    $('#modal-ver-evento').modal({
        blurring: true,
        onShow: function() {
            $.ajax({
                headers: {
                    Accept: "application/json"
                },
                url: window.location.pathname + '/getEventInfo',
                type: 'POST',
                data: { id: idEvent },
                beforeSend: function() {
                    $('#modal-ver-evento').append(` <div id='loader' class="ui active inverted dimmer">
                                                        <div class="ui text loader">Loading</div>
                                                     </div>`);
                },
                success: function(evento) {
                    nombreEvento = evento.titulo
                    inicioEvento = evento.fecha_inicio
                    finalEvento = evento.fecha_final
                    descripcionEvento = evento.descripcion
                    contactoEvento = evento.contacto
                    imagenEvento = evento.imagen[0].uri + evento.imagen[0].nombre
                    $('#nombre_evento_update').val(nombreEvento);
                    $('#descripcion_evento_update').val(descripcionEvento);
                    $('#contacto_evento_update').val(contactoEvento);
                    $('#inicio_evento_update').val(moment.unix(inicioEvento).format('YYYY-MM-DD'));
                    $('#final_evento_update').val(moment.unix(finalEvento).format('YYYY-MM-DD'));
                    $('#modal-ver-evento').attr('data-id', evento.id);
                    $('#loader').remove();
                }
            });
        },
        onApprove: function() {
            var flag = 0;
            var datosUpdate = new FormData(document.getElementById('frm-actualizar-evento'));
            if ($('#nombre_evento_update').val() == nombreEvento) {
                datosUpdate.delete('nombre_evento')
            } else {
                flag++;
            }
            if ($('#descripcion_evento_update').val() == descripcionEvento) {
                datosUpdate.delete('descripcion_evento')
            } else {
                flag++;
            }
            if ($('#contacto_evento_update').val() == contactoEvento) {
                datosUpdate.delete('contacto_evento')
            } else {
                flag++;
            }
            if (moment($('#inicio_evento_update').val()).unix() == inicioEvento) {
                datosUpdate.delete('inicio_evento')
            } else {
                flag++;
            }
            if (moment($('#final_evento_update').val()).unix() == finalEvento) {
                datosUpdate.delete('final_evento')
            } else {
                flag++;
            }
            if (document.getElementById("imagenes_evento_update").files.length == 0) {
                datosUpdate.delete("imagenes")
            } else {
                flag++;
            }
            if ($("#imagen_principal_update")[0].files[0] == undefined) {
                datosUpdate.delete('imagen')
            } else {
                flag++;
                datosUpdate.append('nombre_imagen', imagenEvento)
            }
            if (flag > 0) {
                datosUpdate.append('id', $('#modal-ver-evento').attr('data-id'))
                datosUpdate.delete('autor_evento')
                $.ajax({
                    headers: {
                        Accept: "application/json"
                    },
                    url: window.location.pathname + '/updateEvent',
                    type: 'PUT',
                    processData: false, // Important!
                    contentType: false,
                    cache: false,
                    data: datosUpdate,
                    success: function(message) {
                        iziToast.success({
                            title: '¡Listo!',
                            message: message.message,
                        });
                        document.getElementById('frm-actualizar-evento').reset()
                    }
                })
            } else {
                alert('No se han efectuado cambios!');
            }
        }
    }).modal('show');
});

/**
 * Activar la edición de un evento
 */
$('#editar_evento').change(function() {
    if ($(this).hasClass('checked')) {
        $('#nombre_evento_update,#descripcion_evento_update,#contacto_evento_update,#inicio_evento_update,#final_evento_update').removeAttr('readonly');
        $('#btn-actualizar-evento').removeClass('disabled')
    } else {
        $('#nombre_evento_update,#descripcion_evento_update,#contacto_evento_update,#inicio_evento_update,#final_evento_update').attr('readonly', '');
        $('#btn-actualizar-evento').addClass('disabled')
    }
});