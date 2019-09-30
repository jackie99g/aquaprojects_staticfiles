$(document).ready(function() {
    var windowWidth = $(window).width();
    console.log(windowWidth);
    if (windowWidth < 768) {
        $('.main_content').css({
            'padding-bottom': '59px'
        });
        $('.daily-weather').css({
            'overflow-x': 'auto'
        });
        $('.hourly-weather').css({
            'overflow-x': 'auto'
        });
    }
    if (windowWidth >= 768) {
        $('.main_content').css({
            'padding-bottom': '0px'
        });
        $('.daily-weather').css({
            'overflow-x': 'hidden'
        });
        $('.hourly-weather').css({
            'overflow-x': 'hiddent'
        });
    }
    if (windowWidth < 992) {
        $('.aside_border').css({
            'padding': '0px'
        });
    }
    if (windowWidth >= 992) {
        $('.aside_border').css({
            'padding': '0px'
        });
    }
})

$(window).resize(function () {
    var windowWidth = $(window).width();
    console.log(windowWidth);
    if (windowWidth < 768) {
        $('.main_content').css({
            'padding-bottom': '59px'
        });
        $('.daily-weather').css({
            'overflow-x': 'auto'
        });
        $('.hourly-weather').css({
            'overflow-x': 'auto'
        });
    }
    if (windowWidth >= 768) {
        $('.main_content').css({
            'padding-bottom': '0px'
        });
        $('.daily-weather').css({
            'overflow-x': 'hidden'
        });
        $('.hourly-weather').css({
            'overflow-x': 'hiddent'
        });
    }
    if (windowWidth < 992) {
        $('.aside_border').css({
            'padding': '0px'
        });
    }
    if (windowWidth >= 992) {
        $('.aside_border').css({
            'padding': '0px'
        });
    }
});

$('.user_picture').on('click', function () {
    var visible_state = $('.account').css('visibility');
    var windowWidth = $(window).width();
    if (windowWidth < 768) {
        if (visible_state == 'hidden') {
            $('.account').css({
                'visibility': 'visible',
                'height': '100vh',
                'width': '100%',
                'right': '0px',
                'box-shadow': '0px 0px',
                'border-radius': '0px',
            });
            $('#main').css({
                'display': 'none'
            });
        }
        else if (visible_state == 'visible') {
            $('.account').css({
                'visibility': 'hidden',
                'height': 'auto',
                'width': '300px',
                'right': '0px',
                'box-shadow': '0px 0px',
                'border-radius': '10px',
            });
            $('#main').css({
                'display': 'block',
            });
        }
    }
    if (windowWidth >= 768) {
        if (visible_state == 'hidden') {
            $('.account').css({
                'visibility': 'visible',
                'height': 'auto',
                'width': '300px',
                'right': '5px',
                'box-shadow': '0px 8px 16px #00000026',
                'border-radius': '10px',
            });
            $('#main').css({
                'display': 'block',
            });
        }
        else if (visible_state == 'visible') {
            $('.account').css({
                'visibility': 'hidden',
                'height': 'auto',
                'width': '300px',
                'right': '5px',
                'box-shadow': '0px 0px',
                'border-radius': '10px',
            });
            $('#main').css({
                'display': 'block',
            });
        }
    }

});

$('body').on('click', function (e) {
    var click_class = e.target.className
    if (click_class != 'user_picture' && click_class != 'account' && click_class != 'account_name' && click_class != 'account_content' && click_class != 'account_content account_user_info' && click_class != 'prop account_content' && click_class != 'switch' && click_class != 'switch__label' && click_class != 'prop switch__input' && click_class != 'switch__content' && click_class != 'switch__circle' && click_class != 'account_picture' && click_class != 'animation switch__input' && click_class != 'switch__animation' && click_class != 'account_content_email') {
        $('.account').css({
            'visibility': 'hidden',
        });
        $('#main').css({
            'display': 'block',
        });
    }

});

$('input[name="check"]').change(function () {
    var prop = $('.prop').prop('checked');
    if (prop) {
        $('#main').removeClass('col-lg-8');
        $('#main').addClass('col-lg-10');
        $('#aside').addClass('content_display');

    } else {
        $('#main').removeClass('col-lg-10');
        $('#main').addClass('col-lg-8');
        $('#aside').removeClass('content_display');
    }
});

$('input[name="check"]').change(function () {
    var prop = $('.animation').prop('checked');
    if (prop) {
        $('#index_box').removeClass('box_bg_animation');
        $('#index_box').addClass('box_bg_pattern');

    } else {
        $('#index_box').removeClass('box_bg_pattern');
        $('#index_box').addClass('box_bg_animation');
    }
});

function userinfodic(changePlace, query, src) {
    $.ajax({
        url: '/userinfo?q=' + query,
        timeout: 10000,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        }
    }).done(function(data) {
        if (src == false) {
            $(changePlace).text(data)
        }
        if (src == true) {
            $(changePlace).attr('src', data)            
        }
    }).fail(function(data) {
        $(changePlace).text("Sorry, couldn't get.")
    })
}