$(window).resize(function () {
    var windowWidth = $(window).width();
    console.log(windowWidth);
    if (windowWidth < 768) {
        $('.main_content').css({
            'padding-bottom': '35px'
        });
    }
    if (windowWidth >= 768) {
        $('.main_content').css({
            'padding-bottom': '0px'
        });
    }
    if (windowWidth < 992) {
        $('.aside_border').css({
            'padding': '0px'
        })
    }
    if (windowWidth >= 992) {
        $('.aside_border').css({
            'padding': '15px'
        })
    }
});
