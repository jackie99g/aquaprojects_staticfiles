$(function() {
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
            $('.hourly-weather-chart-block').css({
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
                'overflow-x': 'hidden'
            });
            $('.hourly-weather-chart-block').css({
                'overflow-x': 'hidden'
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

    $(window).resize(function() {
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
            $('.hourly-weather-chart-block').css({
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
                'overflow-x': 'hidden'
            });
            $('.hourly-weather-chart-block').css({
                'overflow-x': 'hidden'
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

    $('.user_picture').on('click', function() {
        var visible_state = $('.account').css('visibility');
        if ($('.account').css('visibility') == 'hidden') {
            $('.account').addClass('animated fadeInUp faster')
        } else {
            $('.account').removeClass('animated fadeInUp faster')
        }
        var windowWidth = $(window).width();
        if (windowWidth < 768) {
            if (visible_state == 'hidden') {
                $('.account').css({
                    'visibility': 'visible',
                    'height': 'calc(100vh - 117.5px)',
                    'width': '100%',
                    'right': '0px',
                    'box-shadow': '0px 0px',
                    'border-radius': '0px',
                    'overflow': 'auto',
                });
                $('#main').css({
                    'display': 'none'
                });
            } else if (visible_state == 'visible') {
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
            } else if (visible_state == 'visible') {
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
        var twitter_view_pictures_flag = localStorage.getItem('twitter-view_pictures')
        var twitter_load_videos_flag = localStorage.getItem('twitter-view_videos')
        if (twitter_view_pictures_flag == 'true') {
            $('.load_pictures').prop('checked', true)
        } else {
            $('.load_pictures').prop('checked', false)
        }
        if (twitter_load_videos_flag == 'true') {
            $('.load_videos').prop('checked', true)
        } else {
            $('.load_videos').prop('checked', false)
        }
    });

    $('body').on('click', function(e) {
        var click_class = e.target.className
        if (click_class != 'user_picture' && click_class != 'account' && click_class != 'account_name' && click_class != 'account_content' && click_class != 'account_content account_user_info' && click_class != 'account_picture' && click_class != 'account_content_email' && click_class != 'tgl tgl-flat prop' && click_class != 'tgl tgl-flat animation' && click_class != 'tgl tgl-flat load_pictures' && click_class != 'tgl tgl-flat load_videos' && click_class != 'tgl-btn' && click_class != 'toggle_button_message') {
            $('.account').css({
                'visibility': 'hidden',
            });
            $('#main').css({
                'display': 'block',
            });
            $('.account').removeClass('animated fadeInUp faster')
        }

    });

    $('input[name="check"]').change(function() {
        var prop = $('.prop').prop('checked');
        if (prop) {
            $('#main').removeClass('col-lg-8');
            $('#main').addClass('col-lg-10');
            $('#aside').addClass('content_display');
            $(window).trigger('aquaproject_twitter_timeline_background')

        } else {
            $('#main').removeClass('col-lg-10');
            $('#main').addClass('col-lg-8');
            $('#aside').removeClass('content_display');
            $(window).trigger('aquaproject_twitter_timeline_background')
        }
    });

    $('input[name="check"]').change(function() {
        var prop = $('.animation').prop('checked');
        if (prop) {
            $('#index_box').removeClass('box_bg_animation');
            $('#index_box').addClass('box_bg_pattern');

        } else {
            $('#index_box').removeClass('box_bg_pattern');
            $('#index_box').addClass('box_bg_animation');
        }
    });
})