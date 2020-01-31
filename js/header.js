$(function() {
    $(document).ready(function() {
        var show_left_sidebar_flag = localStorage.getItem('show_left_sidebar')
        if (show_left_sidebar_flag == 'true') {
            showLeftSidebar()
        } else {
            hideLeftSidebar()
        }
    })

    $('.header_contents_shortcut').on('click', function() {
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

    win.on('load scroll', function() {
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
            changeTwitterPictureHeight()
        } else {
            twitterHiddenPictures()
        }
    });

    function twitterViewPictures() {
        localStorage.setItem('twitter-view_pictures', true)
        $('.tweet-twitter_picture').each(function(index, element) {
            if ($(element).data('possibly_sensitive') === 'False') {
                if ($(element).parent().find('.tweet-twitter_view_picture').css('display') !== 'none') {
                    var data_img_src = $(element).data('img-src')
                    var img_element = '<img class="tweet-twitter_picture_img" src="' + data_img_src + '" style="object-fit: cover; width: 100%; height: ' + localStorage.getItem('twitter-image_size') + 'px; border-radius: 12px; cursor: pointer;">'
                    $(element).append(img_element)
                }
            }
            $(element).css({
                'display': 'block'
            })
        })
        $('.tweet-twitter_view_picture').each(function(index, element) {
            if ($(element).parent().find('.tweet-twitter_picture').data('possibly_sensitive') === 'False') {
                $(element).css({
                    'display': 'none',
                })
            }
        })
    }

    function twitterHiddenPictures() {
        localStorage.removeItem('twitter-view_pictures')
        $('.tweet-twitter_picture_img').each(function(index, element) {
            if ($(element).parent().parent().find('.tweet-twitter_view_picture').css('display') === 'none') {
                $(element).parent().css({
                    'display': 'block'
                })
                $(element).remove()
            }
        })
        $('.tweet-twitter_view_picture').each(function(index, element) {
            $(element).css({
                'display': 'block',
            })
        })
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

    function changeTwitterPictureHeight() {
        $('.tweet-twitter_picture_length').each(function(index, element) {
            var picture_length = parseInt($(element).data('picture_length'))
            if (picture_length == 3) {
                var tweet_twitter_pictures = $(element).parent()
                var picture_height = localStorage.getItem('twitter-image_size')
                tweet_twitter_pictures.find('.tweet-twitter_picture_img').each(function(index, element_img) {
                    $(element).css({
                        'margin-top': '0',
                    })
                    if (index == 0) {
                        $(element_img).css({
                            'border-radius': '12px 0 0 12px',
                            'padding-right': '2px',
                        })
                    } else if (index == 1) {
                        $(element_img).css({
                            'border-radius': '0 12px 0 0',
                            'padding-bottom': '2px',
                            'padding-left': '2px',
                        })
                    } else if (index == 2) {
                        $(element_img).css({
                            'border-radius': '0 0 12px',
                            'padding-top': '2px',
                            'padding-left': '2px',
                        })
                    }
                    if (index == 0) {
                        $(element_img).css({
                            'height': picture_height + 'px'
                        })
                    } else if (index > 0) {
                        $(element_img).css({
                            'height': picture_height / 2 + 'px'
                        })
                    }
                })
            }
            if (picture_length == 4) {
                var tweet_twitter_pictures = $(element).parent()
                var picture_width = localStorage.getItem('twitter-image_size')
                tweet_twitter_pictures.find('.tweet-twitter_picture_img').each(function(index, element_img) {
                    $(element).css({
                        'margin-top': '0',
                    })
                    if (index == 0) {
                        $(element_img).css({
                            'border-radius': '12px 0 0 0',
                            'padding-bottom': '2px',
                            'padding-right': '2px',
                        })
                    } else if (index == 1) {
                        $(element_img).css({
                            'border-radius': '0 12px 0 0',
                            'padding-bottom': '2px',
                            'padding-left': '2px',
                        })
                    } else if (index == 2) {
                        $(element_img).css({
                            'border-radius': '0 0 0 12px',
                            'padding-top': '2px',
                            'padding-right': '2px',
                        })
                    } else if (index == 3) {
                        $(element_img).css({
                            'border-radius': '0 0 12px 0',
                            'padding-top': '2px',
                            'padding-left': '2px',
                        })
                    }
                    $(element_img).css({
                        'height': picture_width / 2 + 'px'
                    })
                })
            }
            if (picture_length == 2) {
                var tweet_twitter_pictures = $(element).parent()
                var picture_width = tweet_twitter_pictures.find('.tweet-twitter_picture_img').height()
                tweet_twitter_pictures.find('.tweet-twitter_picture_img').each(function(index, element_img) {
                    $(element).css({
                        'margin-top': '0',
                    })
                    if (index == 0) {
                        $(element_img).css({
                            'border-radius': '12px 0 0 12px',
                            'padding-right': '2px',
                        })
                    } else if (index == 1) {
                        $(element_img).css({
                            'border-radius': '0 12px 12px 0',
                            'padding-left': '2px',
                        })
                    }
                })
            }
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
        $('.tweet-twitter_icon').find('img').each(function(index, element) {
            var tweetTwitterIcon = $(element).attr('src')
            tweetTwitterIcon = tweetTwitterIcon.replace('_normal', '_400x400')
            $(element).attr('src', tweetTwitterIcon)
        })
        $('.twitter_user-profile_image').find('img').each(function(index, element) {
            var tweetTwitterIcon = $(element).attr('src')
            tweetTwitterIcon = tweetTwitterIcon.replace('_normal', '_400x400')
            $(element).attr('src', tweetTwitterIcon)
        })
    }

    function twitterHideClearIcon() {
        localStorage.removeItem('twitter-view_clear_icon')
        $('.tweet-twitter_icon').find('img').each(function(index, element) {
            var tweetTwitterIcon = $(element).attr('src')
            tweetTwitterIcon = tweetTwitterIcon.replace('_400x400', '_normal')
            $(element).attr('src', tweetTwitterIcon)
        })
        $('.twitter_user-profile_image').find('img').each(function(index, element) {
            var tweetTwitterIcon = $(element).attr('src')
            tweetTwitterIcon = tweetTwitterIcon.replace('_400x400', '_normal')
            $(element).attr('src', tweetTwitterIcon)
        })
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