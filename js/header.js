$(function() {
    var win = $(window),
        header = $('.header_contents'),
        hedaerHeight = header.outerHeight() + 10,
        progress = $('.progress'),
        startPos = 0;

    win.on('scroll', function() {
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

    $('input[name="check"]').change(function() {
        var prop = $('.load_pictures').prop('checked');
        if (prop) {
            twitterViewPictures()
        } else {
            twitterHiddenPictures()
        }
    });

    function twitterViewPictures() {
        localStorage.setItem('twitter-view_pictures', true)
        var tweetTwitterPicture = document.querySelectorAll('.tweet-twitter_picture')
        for (let index = 0; index < tweetTwitterPicture.length; index++) {
            tweetTwitterPicture[index].src = tweetTwitterPicture[index].dataset.src
        }
    }

    function twitterHiddenPictures() {
        localStorage.removeItem('twitter-view_pictures')
        var tweetTwitterPicture = document.querySelectorAll('.tweet-twitter_picture')
        for (let index = 0; index < tweetTwitterPicture.length; index++) {
            tweetTwitterPicture[index].src = 'https://jackie99g.github.io/aquaprojects_staticfiles/images/icon.svg'
        }
    }

    $('input[name="check"]').change(function() {
        var prop = $('.load_videos').prop('checked');
        if (prop) {
            twitterViewVideos()
        } else {
            twitterHiddenVideos()
        }
    });

    function twitterViewVideos() {
        localStorage.setItem('twitter-view_videos', true)
        $('.tweet-twitter_view_video').each(function(index, twitter_view_video) {
            if ($(twitter_view_video).css('display') !== 'none') {
                var twitter_view_video_data_video_bitrate = $(twitter_view_video).data('video-bitrate')
                $(twitter_view_video).parent().find('.tweet-twitter_video').each(function(index, element) {
                    var data_video_src = $(element).data('video-src')
                    var data_video_bitrate = $(element).data('video-bitrate')
                    var video_element = '<video class="tweet-twitter_video_movie" style="width: 100%; height: ' + localStorage.getItem('twitter-image_size') + 'px; border-radius: 12px; margin-top: 12px; outline: none; cursor: pointer;" controls><source src="' + data_video_src + '" data-bitrate="' + data_video_bitrate + '"></video>'
                    if (twitter_view_video_data_video_bitrate === data_video_bitrate) {
                        $(element).append(video_element)
                        $(element).css({
                            'display': 'block'
                        })
                    }
                })
                $(twitter_view_video).css({
                    'display': 'none',
                })
            }
        })
    }

    function twitterHiddenVideos() {
        localStorage.removeItem('twitter-view_videos')
        $('.tweet-twitter_video_movie').each(function(index, element) {
            if ($(element).parent().parent().find('.tweet-twitter_view_video').css('display') === 'none') {
                $(element).parent().css({
                    'display': 'block'
                })
                $(element).remove()
            }
        })
        $('.tweet-twitter_view_video').each(function(index, all_video_element) {
            $(all_video_element).css({
                'display': 'block'
            })
        })
    }

    $('input[name="check"]').change(function() {
        var prop = $('.load_clear_icon').prop('checked');
        if (prop) {
            twitterViewClearIcon()
        } else {
            twitterHideClearIcon()
        }
    });

    function twitterViewClearIcon() {
        localStorage.setItem('twitter-view_clear_icon', true)
        var tweetTwitterIconImg = document.querySelectorAll('.tweet-twitter_icon img')
        for (let index = 0; index < tweetTwitterIconImg.length; index++) {
            tweetTwitterIconImg[index].src.replace('_normal', '_400x400')
        }
    }

    function twitterHideClearIcon() {
        localStorage.removeItem('twitter-view_clear_icon')
        var tweetTwitterIconImg = document.querySelectorAll('.tweet-twitter_icon img')
        for (let index = 0; index < tweetTwitterIconImg.length; index++) {
            tweetTwitterIconImg[index].src.replace('_400x400', '_normal')
        }
    }

    $(document).on('click', '.header-summarize_button', function() {
        headerSummaryButton()
    })

    $('input[name="check"]').change(function() {
        var prop = $('.show_left_sidebar').prop('checked');
        if (prop) {
            showLeftSidebar()
        } else {
            hideLeftSidebar()
        }
    });

    function showLeftSidebar() {
        localStorage.setItem('show_left_sidebar', true)
        var custom_side_pannel_lg = $('.custom_side_pannel_lg').parent()
        custom_side_pannel_lg.removeClass('col-md-1')
        custom_side_pannel_lg.addClass('col-md-2')
        custom_side_pannel_lg.css({
            'visibility': 'visible'
        })

        var custom_side_pannel_md = $('.custom_side_pannel_md').parent()
        custom_side_pannel_md.removeClass('col-md-1')
        custom_side_pannel_md.addClass('col-md-2')
        custom_side_pannel_md.css({
            'visibility': 'visible'
        })

    }

    function hideLeftSidebar() {
        localStorage.removeItem('show_left_sidebar')
        var custom_side_pannel_lg = $('.custom_side_pannel_lg').parent()
        custom_side_pannel_lg.removeClass('col-md-2')
        custom_side_pannel_lg.addClass('col-md-1')
        custom_side_pannel_lg.css({
            'visibility': 'hidden'
        })

        var custom_side_pannel_md = $('.custom_side_pannel_md').parent()
        custom_side_pannel_md.removeClass('col-md-2')
        custom_side_pannel_md.addClass('col-md-1')
        custom_side_pannel_md.css({
            'visibility': 'hidden'
        })
    }

    function headerSummaryButton() {
        var custom_side_pannel_lg = $('.custom_side_pannel_lg').parent()
        custom_side_pannel_lg.toggleClass('col-md-1')
        custom_side_pannel_lg.toggleClass('col-md-2')
        if (custom_side_pannel_lg.css('visibility') === 'visible') {
            custom_side_pannel_lg.css({
                'visibility': 'hidden'
            })
            localStorage.removeItem('show_left_sidebar')
        } else {
            custom_side_pannel_lg.css({
                'visibility': 'visible'
            })
            localStorage.setItem('show_left_sidebar', true)
        }

        var custom_side_pannel_md = $('.custom_side_pannel_md').parent()
        custom_side_pannel_md.toggleClass('col-md-1')
        custom_side_pannel_md.toggleClass('col-md-2')
        if (custom_side_pannel_md.css('visibility') === 'visible') {
            custom_side_pannel_md.css({
                'visibility': 'hidden'
            })
            localStorage.removeItem('show_left_sidebar')
        } else {
            custom_side_pannel_md.css({
                'visibility': 'visible'
            })
            localStorage.setItem('show_left_sidebar', true)
        }
    }
})