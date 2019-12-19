$(function() {
    $('.tweet-twitter_picture_img').on('click', function() {
        if ($('.tweet-twitter_picture_show').css('display') == 'none') {
            $('.tweet-twitter_picture_show').css({
                'display': 'block',
            })
            $('.tweet_twitter_picture_show_img').attr('src', $(this).attr('src'))
        }
    })
    $('.tweet_twitter_picture_show_img').on('click', function() {
        $('.tweet-twitter_picture_show').css({
            'display': 'none',
        })
    })
    $('.tweet-twitter_picture_data_saver').on('click', function() {
        var data_img_src = $(this).children('.tweet-twitter_picture').data('img-src')
        var img_element = '<img class="tweet-twitter_picture_img" src="' + data_img_src + '" style="object-fit: cover; width: 100%; height: 285px; border-radius: 12px; margin-top: 12px;">'
        $(this).children('.tweet-twitter_picture').append(img_element)
        $(this).children('.tweet-twitter_picture').css({
            'display': 'block'
        })
        $(this).children('strong').css({
            'display': 'none',
        })
    })
    $('.twitter-load_all_images').on('click', function() {
        $('.tweet-twitter_picture').each(function(index, element) {
            var data_img_src = $(element).data('img-src')
            var img_element = '<img class="tweet-twitter_picture_img" src="' + data_img_src + '" style="object-fit: cover; width: 100%; height: 285px; border-radius: 12px; margin-top: 12px;">'
            $(element).append(img_element)
            $(element).css({
                'display': 'block'
            })
        })
        $('.tweet-twitter_picture_data_saver').each(function(index, element) {
            $(element).children('strong').css({
                'display': 'none',
            })
        })
        $(this).css({
            'display': 'none',
        })
    })
    $(document).ready(function() {
        $.ajax({
            url: '/userinfo?q=' + 'user_metadata--background_image',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        }).done(function(data) {
            $('.timeline_background').css({
                'background-image': 'url(' + data + ')'
            })
        })
    })
})