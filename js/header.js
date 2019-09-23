$(function() {
    $('.header_contents_shortcut').on('click', function() {
        $('.account').css({
            'visibility': 'hidden',
        });
        $('#main').css({
            'display': 'block',
        });
    })
})