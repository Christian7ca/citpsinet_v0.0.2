$(document).ready(function() {
    /*
    @   Carga de elementos estáticos generales
    */

    $('.hamburger').click(function() {
        $('.ui.sidebar')
            .sidebar('setting', {
                dimPage: false,
                closable: false
            })
            .sidebar('toggle');
    });

    $('.ui.dropdown').dropdown();
    $('.ui.radio.checkbox').checkbox();
    $('.ui.checkbox').checkbox();
    $('.ui.accordion').accordion();
    $('#imagenes_evento').multifile({
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
    $('#imagenes_evento_update').multifile({
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
    var forEach = function(t, o, r) {
        if ("[object Object]" === Object.prototype.toString.call(t))
            for (var c in t) Object.prototype.hasOwnProperty.call(t, c) && o.call(r, t[c], c, t);
        else
            for (var e = 0, l = t.length; l > e; e++) o.call(r, t[e], e, t)
    };

    var hamburgers = document.querySelectorAll(".hamburger");
    if (hamburgers.length > 0) {
        forEach(hamburgers, function(hamburger) {
            hamburger.addEventListener("click", function() {
                this.classList.toggle("is-active");
            }, false);
        });
    }

    particlesJS.load('particles-js-desktop', './../particlesjs-dash.json', function() {
        console.log('callback - particles.js config loaded');
    });

    particlesJS.load('particles-js-mobile', './../particlesjs-dash.json', function() {
        console.log('callback - particles.js config loaded');
    });

});