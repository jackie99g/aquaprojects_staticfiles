$(function() {
    $('.tweet-twitter_picture').on('click', function() {
        if ($('.tweet-twitter_picture_show').css('display') == 'none') {
            $('.tweet-twitter_picture_show').css({
                'display': 'block',
            })
            $('.tweet_twitter_picture_show_img').attr('src', $(this).data('img-src'))
        }
    })
    $('.tweet_twitter_picture_show_img').on('click', function() {
        $('.tweet-twitter_picture_show').css({
            'display': 'none',
        })
    })
    $('.tweet-twitter_view_picture').on('click', function() {
        var data_img_src = $(this).parent().find('.tweet-twitter_picture').data('img-src')
        var img_element = '<img class="tweet-twitter_picture_img" src="' + data_img_src + '" style="object-fit: cover; width: 100%; height: 285px; border-radius: 12px; margin-top: 12px; cursor: pointer;">'
        $(this).parent().find('.tweet-twitter_picture').append(img_element)
        $(this).parent().find('.tweet-twitter_picture').css({
            'display': 'block'
        })
        $(this).css({
            'display': 'none',
        })
    })
    $('.twitter-load_all_images').on('click', function() {
        $('.tweet-twitter_picture').each(function(index, element) {
            if ($(element).parent().find('.tweet-twitter_view_picture').css('display') !== 'none') {
                var data_img_src = $(element).data('img-src')
                var img_element = '<img class="tweet-twitter_picture_img" src="' + data_img_src + '" style="object-fit: cover; width: 100%; height: 285px; border-radius: 12px; margin-top: 12px; cursor: pointer;">'
                $(element).append(img_element)
                $(element).css({
                    'display': 'block'
                })
            }
        })
        $('.tweet-twitter_view_picture').each(function(index, element) {
            $(element).css({
                'display': 'none',
            })
        })
        $(this).css({
            'display': 'none',
        })
    })

    var twittterCreateListName = ''
    var twitterCreateListDescription = ''
    var twitterCreateListMode = ''
    var selectExistOwnListResutId = ''
    var is_send_ok = false

    $('.select_exist_own_list-list').on('click', function() {
        var checkStatus = $(this).data('check_status')
        if (checkStatus === 'none') {
            $('.select_exist_own_list-list').data('check_status', 'none')
            $(this).data('check_status', 'checked')
            selectExistOwnListResutId = $(this).find('.select_exist_own_list-list_name_id_mode').find('.select_exist_own_list-list_name_id_mode-id').text()
            $('.select_exist_own_list-list').removeClass('checked_css_opacity')
            $('.select_exist_own_list-list').addClass('check_css_opacity')
            $(this).addClass('checked_css_opacity')
        }
        if (checkStatus === 'checked') {
            $('.select_exist_own_list-list').data('check_status', 'none')
            selectExistOwnListResutId = ''
            $('.select_exist_own_list-list').removeClass('checked_css_opacity')
            $(this).addClass('check_css_opacity')
        }
    })

    $('.startTwitter').on('click', CheckTwitterWelcomeResult)
    function CheckTwitterWelcomeResult() {
        twittterCreateListName = $('.twitter_create_list-name').val()
        twitterCreateListDescription = $('.twitter_create_list-description').val()
        twitterCreateListMode = $('.twitter_create_list-mode').find('input').prop('checked')
        is_send_ok = false

        if (twittterCreateListName === '' && selectExistOwnListResutId === '') {
            alert('Create Something.')
        } else if (twittterCreateListName != '' && selectExistOwnListResutId != '') {
            alert('only select one.')
        } else {
            is_send_ok = true
        }
        console.table(twittterCreateListName, twitterCreateListDescription, twitterCreateListMode)
        if (is_send_ok === true) {
            if (twittterCreateListName != '') {
                SendTwitterWelcomeResult('CreateNewList', {
                    'twittterCreateListName': twittterCreateListName,
                    'twitterCreateListDescription': twitterCreateListDescription,
                    'twitterCreateListMode': twitterCreateListMode,
                })
            } else if (selectExistOwnListResutId != '') {
                SendTwitterWelcomeResult('SelectOwnList', {
                    'selectExistOwnListResutId': selectExistOwnListResutId,
                })
            }
        }
    }

    function SendTwitterWelcomeResult(list_mode, list_information) {
        $('.startingTwitter').css({
            'display': 'block'
        })
        var post_url = 'lists';
        var post_data = {}
        post_data['list_mode'] = list_mode
        post_data['list_information'] = list_information

        csrfSetting();
        $.ajax({
            url: post_url,
            type: 'POST',
            data: post_data,
        }).done(function(data) {
            console.log(data)
            location.href = '/twitter'
        })

        function getCookie(key) {
            var cookies = document.cookie.split(';');
            for (var _i = 0, cookies_1 = cookies; _i < cookies_1.length; _i++) {
                var cookie = cookies_1[_i];
                var cookiesArray = cookie.split('=');
                if (cookiesArray[0].trim() == key.trim()) {
                    return cookiesArray[1]; // (key[0],value[1])
                }
            }
            return '';
        }

        function csrfSetting() {
            $.ajaxSetup({
                beforeSend: function(xhr, settings) {
                    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                    }
                }
            });
        }

        function csrfSafeMethod(method) {
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }
    }
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