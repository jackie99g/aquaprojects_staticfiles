$(function () {
    $('.header_contents_shortcut').on('click', function () {
        $('.account').css({
            'visibility': 'hidden',
        });
        $('#main').css({
            'display': 'block',
        });
    })
    var win = $(window),
        header = $('.header_contents'),
        hedaerHeight = header.outerHeight() + 10,
        progress = $('.progress'),
        startPos = 0;

    win.on('load scroll', function () {
        var value = $(this).scrollTop();
        if (value > startPos && value > hedaerHeight) {
            header.css('top', '-' + hedaerHeight + 'px');
            progress.css('visibility', 'hidden');
        } else {
            header.css('top', '0');
            progress.css('hidden', '');
        }
        startPos = value;
    })
})