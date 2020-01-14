$(function() {
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
            $(window).trigger('aquaproject_popstate');
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
})