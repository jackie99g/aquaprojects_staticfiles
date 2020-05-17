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
        var show_side_bar_flag = localStorage.getItem('show_side_bar')
        var twitter_view_pictures_flag = localStorage.getItem('twitter-view_pictures')
        var twitter_load_videos_flag = localStorage.getItem('twitter-view_videos')
        var twitter_view_clear_icon_flag = localStorage.getItem('twitter-view_clear_icon')
        var show_left_sidebar_flag = localStorage.getItem('show_left_sidebar')
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
        if (twitter_view_clear_icon_flag == 'true') {
            $('.load_clear_icon').prop('checked', true)
        } else {
            $('.load_clear_icon').prop('checked', false)
        }
        if (show_left_sidebar_flag == 'true') {
            $('.show_left_sidebar').prop('checked', true)
        } else {
            $('.show_left_sidebar').prop('checked', false)
        }
        if (show_side_bar_flag == 'true') {
            $('.prop').prop('checked', true)
        } else {
            $('.prop').prop('checked', false)
        }
    });

    document.addEventListener('click', e => {
        function findParents(target, className) {
            if (target.className !== '' && target.classList.contains(className)) {
                return target
            }
            var currentNode = target.parentNode
            if (currentNode === document) {
                return false
            } else if (target.className !== '' && currentNode.classList.contains(className)) {
                return currentNode
            } else {
                return findParents(currentNode, className)
            }
        }

        if (!findParents(e.target, 'account') && !findParents(e.target, 'username')) {
            var accountArea = document.querySelector('.account')
            accountArea.style.visibility = 'hidden'
            accountArea.classList.remove('animated', 'fadeInUp', 'faster')
            var mainArea = document.querySelector('#main')
            mainArea.style.display = ''
        }
    })

    $('input[name="check"]').change(function() {
        var prop = $('.prop').prop('checked');
        if (prop) {
            showSideBar()
        } else {
            hideSideBar()
        }
    });

    function showSideBar() {
        $('#main').removeClass('col-lg-10');
        $('#main').addClass('col-lg-8');
        $('#aside').removeClass('content_display');
        changeTwitterTimelineBackgroundSize()
        localStorage.setItem('show_side_bar', true)
    }

    function hideSideBar() {
        $('#main').removeClass('col-lg-8');
        $('#main').addClass('col-lg-10');
        $('#aside').addClass('content_display');
        changeTwitterTimelineBackgroundSize()
        localStorage.setItem('show_side_bar', false)
    }

    function changeTwitterTimelineBackgroundSize() {
        var mainWidth = $('#main').width()
        $('.timeline_background').css({
            'width': mainWidth + 'px'
        })
    }

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