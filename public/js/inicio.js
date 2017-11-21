var slide = $('#slides').slippry({
    adaptiveHeight: false,
    captions: false,
    pager: false,
    controls: false
});

$('.sy-prev').click(function () {
    slide.goToPrevSlide();
    return false;
});
$('.sy-next').click(function () {
    slide.goToNextSlide();
    return false;
});

$('#modal').iziModal({
    title: 'Formulario para mas informacion',
    headerColor: "#434C64"
});

$('#btn-mas-info-inicio').on('click', function () {
    $('#modal').iziModal('open');
});

$('.ui.checkbox')
    .checkbox();
