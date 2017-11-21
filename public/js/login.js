$(document).ready(function() {

    /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
    particlesJS.load('particles-js', './../particlesjs.json', function() {
        console.log('callback - particles.js config loaded');
    });

    $('.ui.dropdown')
        .dropdown();

    $('#correo').change(function() {
        if (/([@])\w+/g.test($(this).val())) {
            alert('Solo escribe el nombre de tu correo, y selecciona el dominio justo a la derecha.')
            $(this).val("");
        }
    })

    $('#view-pass').mousedown(function() {
        $('#pass').removeAttr('type')
    }).mouseup(function() {
        $('#pass').attr('type', 'password')
    })


    $("#frm-signin").on("submit", function(e) {

        e.preventDefault();
        var correo = $('#correo').val() + $('#dominio').text()
        var pass = $('#pass').val()
        $.ajax({
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            url: '/login',
            type: 'POST',
            data: {
                correo: correo,
                password: pass
            },
            success: function(response) {
                if (response.redirect != undefined) {
                    window.location.href = response.redirect
                } else {
                    iziToast.warning({
                        title: 'Inicio de sesión incorrecto',
                        message: response.message,
                        backgroundColor: 'rgba(255,152,0,.7)',
                        position: 'topLeft',
                        titleSize: '16'
                    });
                }
            }
        });

    });

});