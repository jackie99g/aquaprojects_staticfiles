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
        hedaerHeight = header.outerHeight(),
        progress = $('.progress'),
        progressHiehgt = progress.outerHeight(),
        startPos = 0;

    win.on('load scroll', function () {
        var value = $(this).scrollTop();
        if (value > startPos && value > hedaerHeight) {
            header.css('top', '-' + hedaerHeight + progressHiehgt + 'px');
            progress.css('visibility', 'hidden');
        } else {
            header.css('top', '0');
            progress.css('hidden', '');
        }
        startPos = value;
    })
})