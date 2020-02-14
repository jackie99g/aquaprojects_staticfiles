$(function() {
    $(window).on('aquaproject_popstate', function() {
        if ('/' + location.pathname.replace(location.origin, '').split('/')[1] === '/twitter') {
            console.log('twitter!')
            changeFontSize()
            setTweetCreated_at()
            twitterViewAllPictures()
            twitterViewAllVideos()
            changeTwitterPictureHeight()
            twitterAccount()
            twitterTrends()
            setClearIcon()
            console.log('twitter! popstate event finished.')
        }
    })
    if ('/' + location.pathname.replace(location.origin, '').split('/')[1] === '/twitter') {
        window.dispatchEvent(new Event('aquaproject_popstate'));
    }

    setInterval(() => {
        if (location.href.replace(location.origin, '') === '/twitter') {
            var currentTime = new Date()
            console.log(currentTime)
            var tweet_id = $('.format_timeline > div:first').next().data('tweet_id');
            if (document.hidden === false) {
                loadMoreTweet(tweet_id, 'new');
            }
        }
    }, 60 * 1000);

    var alreadyBottom = false;
    $(window).scroll(function() {
        if ($(document).height() - $('.tweet-load_more_old_tweet').innerHeight() - $('.tweet').innerHeight() * 3 <= $(window).scrollTop() + $(window).innerHeight() && alreadyBottom === false) {
            console.log('Reach bottom.')
            var tweet_id = $('.format_timeline > div:last').prev().data('tweet_id');
            loadMoreTweet(tweet_id, 'old');
        }
    })

    $(document).on('click', '.tweet-twitter_picture', tweetTwitterPicture)

    function tweetTwitterPicture(event) {
        event.stopPropagation()
        if ($('.tweet-twitter_picture_show').css('display') == 'none') {
            $('.tweet-twitter_picture_show').css({
                'display': 'flex',
            })
            var current_img_src = $(this).data('img-src')
            var img_table = []
            $(this).parent().parent().parent().find('.tweet-twitter_picture').each(function(index, element) {
                img_table.push($(element).data('img-src'))
                if ($(element).data('img-src') === current_img_src) {
                    localStorage.setItem('twitter-img_current_number', index)
                }
            })
            localStorage.setItem('twitter-img_length', img_table.length - 1)
            console.table(img_table)
            localStorage.setItem('twitter-img_table', img_table)
            var get_img_table = localStorage.getItem('twitter-img_table').split(',')
            var get_img_current_number = localStorage.getItem('twitter-img_current_number')
            $('.tweet-twitter_picture_show_img').attr('src', get_img_table[get_img_current_number])
            $('.tweet-twitter_picture_show_img').addClass('animated fadeInUp')
        }
    }

    $(document).on('keydown', function(event) {
        if ($('.tweet-twitter_picture_show').css('display') != 'none') {
            var keycode = event.keyCode
            if (keycode === 37) {
                twitterPictureShowButton('prev')
            } else if (keycode === 39) {
                twitterPictureShowButton('next')
            }
        }
    })

    $(document).on('click', '.tweet-twitter_picture_show_prev', function() {
        twitterPictureShowButton('prev')
    })
    $(document).on('click', '.tweet-twitter_picture_show_next', function() {
        twitterPictureShowButton('next')
    })

    function twitterPictureShowButton(mode) {
        var get_img_table = localStorage.getItem('twitter-img_table').split(',')
        var get_img_current_number = parseInt(localStorage.getItem('twitter-img_current_number'))
        var get_img_length = parseInt(localStorage.getItem('twitter-img_length'))
        if (mode === 'prev') {
            if (get_img_current_number > 0) {
                get_img_current_number -= 1
            }
        } else if (mode === 'next') {
            if (get_img_current_number < get_img_length) {
                get_img_current_number += 1
            }
        } else {
            console.error('twitterPictureShowButton error.')
        }
        $('.tweet-twitter_picture_show_img').attr('src', get_img_table[get_img_current_number])
        localStorage.setItem('twitter-img_current_number', get_img_current_number)
    }

    $(document).on('click', '.tweet-twitter_picture_show_close', tweetTwitterPictureShowClose)
    $(document).on('click', '.tweet-twitter_picture_show_img', tweetTwitterPictureShowClose)

    function tweetTwitterPictureShowClose() {
        $('.tweet-twitter_picture_show_img').removeClass('animated fadeInUp')
        $('.tweet-twitter_picture_show_img').addClass('animated fadeOutUp')
        $('.tweet-twitter_picture_show_img').on('animationend', function() {
            if ($('.tweet-twitter_picture_show_img').hasClass('animated fadeOutUp')) {
                $('.tweet-twitter_picture_show').css({
                    'display': 'none',
                })
                $('.tweet-twitter_picture_show_img').removeClass('animated fadeOutUp')
            }
        })
    }


    $(document).on('click', '.tweet-twitter_view_picture', tweetTwitterViewPicture)

    function tweetTwitterViewPicture(event) {
        event.stopPropagation()
        var data_img_src = $(this).parent().find('.tweet-twitter_picture').data('img-src')
        var img_element = '<img class="tweet-twitter_picture_img" src="' + data_img_src + '" style="object-fit: cover; width: 100%; height: ' + localStorage.getItem('twitter-image_size') + 'px; border-radius: 12px; cursor: pointer;">'
        $(this).parent().find('.tweet-twitter_picture').append(img_element)
        $(this).parent().find('.tweet-twitter_picture').css({
            'display': 'block'
        })
        $(this).css({
            'display': 'none',
        })
        window.dispatchEvent(new Event('aquaproject_popstate'));
    }

    $(document).on('click', '.tweet-twitter_view_video', tweetTwitterViewVideo)

    function tweetTwitterViewVideo(event) {
        event.stopPropagation()
        var twitter_view_video_data_video_bitrate = $(this).data('video-bitrate')
        $(this).parent().find('.tweet-twitter_video').each(function(index, element) {
            var data_video_src = $(element).data('video-src')
            var data_video_bitrate = $(element).data('video-bitrate')
            var video_element = '<video class="tweet-twitter_video_movie" style="width: 100%; height: 285px; border-radius: 12px; margin-top: 12px; outline: none; cursor: pointer;" controls><source src="' + data_video_src + '" data-bitrate="' + data_video_bitrate + '"></video>'
            if (twitter_view_video_data_video_bitrate === data_video_bitrate) {
                $(element).append(video_element)
                $(element).css({
                    'display': 'block'
                })
            }
        })
        $(this).css({
            'display': 'none',
        })
    }

    $(document).on('click', '.tweet-twitter_video', function(event) {
        event.stopPropagation()
    })

    var twittterCreateListName = ''
    var twitterCreateListDescription = ''
    var twitterCreateListMode = ''
    var selectExistOwnListResutId = ''
    var is_send_ok = false

    $(document).on('click', '.select_exist_own_list-list', function() {
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

    $(document).on('click', '.startTwitter', CheckTwitterWelcomeResult)

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

        fetch(
            post_url, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(post_data),
                headers: {
                    "X-CSRFToken": getCookie('csrftoken')
                }
            }
        ).then(response => {
            if (response.ok) {
                return response.text()
            } else {
                console.error(response)
            }
        }).then(data => {
            console.log(data)
            location.href = '/twitter'
        }).catch(err => {
            console.error(err)
        })
    }

    function changeFontSize() {
        if (localStorage.getItem('font-size')) {
            var _font_size = parseInt(localStorage.getItem('font-size'))
            var font_size, small_font_size, large_font_size = ''
            var twitter_image_size, twitter_icon_image_size = ''
            if (_font_size == 0) {
                font_size = 'x-small'
                small_font_size = 'xx-small'
                large_font_size = 'small'
                twitter_image_size = '145'
                twitter_icon_image_size = '20'
            } else if (_font_size == 25) {
                font_size = 'small'
                small_font_size = 'x-small'
                large_font_size = 'medium'
                twitter_image_size = '215'
                twitter_icon_image_size = '30'
            } else if (_font_size == 50) {
                font_size = 'medium'
                small_font_size = 'small'
                large_font_size = 'large'
                twitter_image_size = '285'
                twitter_icon_image_size = '40'
            } else if (_font_size == 75) {
                font_size = 'large'
                small_font_size = 'medium'
                large_font_size = 'x-large'
                twitter_image_size = '355'
                twitter_icon_image_size = '50'
            } else if (_font_size == 100) {
                font_size = 'x-large'
                small_font_size = 'large'
                large_font_size = 'xx-large'
                twitter_image_size = '425'
                twitter_icon_image_size = '60'
            } else {
                font_size = 'medium'
                small_font_size = 'small'
                large_font_size = 'large'
                twitter_image_size = '285'
                twitter_icon_image_size = '40'
            }
            $('.font-size').css({
                'font-size': font_size
            })
            $('.small-font-size').css({
                'font-size': small_font_size
            })
            $('.large-font-size').css({
                'font-size': large_font_size
            })
            localStorage.setItem('twitter-image_size', twitter_image_size)
            localStorage.setItem('twitter-icon_image_size', twitter_icon_image_size)
        } else {
            localStorage.setItem('font-size', '50')
            localStorage.setItem('twitter-image_size', '285')
            localStorage.setItem('twitter-icon_image_size', '40')
        }

        changeTwitterIconImageSize()

        function changeTwitterIconImageSize() {
            $('.tweet-twitter_icon').each(function(index, element) {
                $(element).find('img').css({
                    'height': localStorage.getItem('twitter-icon_image_size') + 'px',
                    'width': localStorage.getItem('twitter-icon_image_size') + 'px'
                })
            })
        }
    }

    $(document).on('click', '.twitter_anchor', twitterAnchor)

    function twitterAnchor() {
        scrollPageTop()
        var targetPage = $(this).attr('href');
        targetPage = targetPage.replace(location.origin, '')
        var currentPage = location.href;
        currentPage = currentPage.replace(location.origin, '')
        var state = {
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#main'
        };
        var replaceState = $.extend(true, {}, history.state)
        replaceState['scrollTop'] = $(window).scrollTop()
        history.replaceState(replaceState, null, currentPage)
        history.pushState(state, null, targetPage);

        var twitterUserScreenName = $(this).data('twitter_user-screen_name')
        var tweetId = $(this).data('tweet_id')
        if (twitterUserScreenName !== undefined) changeContent(targetPage, undefined, 'twitter_user', twitterUserScreenName);
        else if (tweetId !== undefined) changeContent(targetPage, undefined, 'tweet', tweetId)
        else changeContent(targetPage, undefined);
        return false;
    }

    function changeContent(href, doneFunc, anchorMode, anchorContext) {
        if (anchorMode === 'twitter_user') changeContentTwitterUser(anchorContext)
        else if (anchorMode === 'tweet') changeContentTweet(anchorContext)
        else {
            $('#main').html('<div class="loader" style="font-size: 2px; margin: 8px auto auto;"></div>');
            $('#ajax-progress-bar').removeClass('bg-danger');
            $('#ajax-progress-bar').css({
                'visibility': 'visible'
            });
            $('#ajax-progress-bar').css({
                'width': '80%'
            });
        }
        // Cache exsists.
        if (AquaProjectCache[href]) {
            if (history.state['drawLocationChanged'] == true) {
                $('#main').html($(AquaProjectCache[href]).find('#main').html());
            } else {
                $(history.state['changeLocation']).html($(AquaProjectCache[href]).find(history.state['changeLocation']).html());
            }
            // After data added, to do this method.
            if (doneFunc != undefined) {
                doneFunc()
            }
            $('#ajax-progress-bar').css({
                'width': '100%'
            });

            window.dispatchEvent(new Event('aquaproject_popstate'));
        }

        fetch(
            href, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include'
            }
        ).then(response => {
            if (response.ok) {
                return response.text()
            } else {
                console.error(response)
                showError()
            }
        }).then(data => {
            // Save Cache.
            AquaProjectCache[href] = data
            if (href != location.href.replace(location.origin, '')) {
                console.log('It seems that you moved to a different page first.')
                return false
            }
            if (history.state['drawLocationChanged'] == true) {
                $('#main').html($(data).find('#main').html());
            } else {
                $(history.state['changeLocation']).html($(data).find(history.state['changeLocation']).html());
            }
            // After data added, to do this method.
            if (doneFunc != undefined) {
                doneFunc()
            }

            window.dispatchEvent(new Event('aquaproject_popstate'));

            $('#ajax-progress-bar').css({
                'width': '100%',
                'transition': 'width 0.1s ease 0s'
            })
            wait(0.2).done(function() {
                $('#ajax-progress-bar').css({
                    'visibility': 'hidden',
                    'width': '0%',
                    'transition': 'width 0.6s ease 0s',
                })
            })
        }).catch(err => {
            console.error(err)
            showError()
        })

        function changeContentTwitterUser(screen_name) {
            // The following will be changed:
            // .twitter_user-background_image -> Expand image.
            // .twitter_user-profile_image -> Add .tweet-twitter_icon, twitter_anchor, image property.
            // .twitter_user-name_screen_name -> Add twitter_anchor
            // .twitter_user-location -> css:display
            // .twitter_user-main -> css:padding
            // .twitter_user -> border-bottom
            $('.twitter_user').each(function(index, element) {
                if ($(element).data('twitter_user-screen_name') === screen_name) {
                    $('.timeline').html($(element).prop('outerHTML'))

                    var TwitterUserBackgroundImage = $('.timeline').find('.twitter_user-background_image').data('img-src')
                    var TwitterUserBackgroundImageIMG = '<img src="' + TwitterUserBackgroundImage + '" style="width: 100%; height: 100%;">'
                    $('.timeline').find('.twitter_user-background_image').append(TwitterUserBackgroundImageIMG)

                    $('.timeline').find('.twitter_user-profile_image').css('height', '50px')
                    var twitterUserProfile = $('.timeline').find('.twitter_user-profile_image')
                    twitterUserProfile.find('img').insertBefore(twitterUserProfile.find('a'))
                    twitterUserProfile.find('a').remove()
                    $('.timeline').find('.twitter_user-profile_image').find('img').css({
                        'width': '100px',
                        'height': '100px',
                        'top': '-50px',
                        'margin-left': '10px',
                    })

                    var twitterUserNameScreenName = $('.timeline').find('.twitter_user-name_screen_name')
                    twitterUserNameScreenName.find('.twitter_user-name').insertBefore(twitterUserNameScreenName.find('a'))
                    twitterUserNameScreenName.find('.twitter_user-screen_name').insertBefore(twitterUserNameScreenName.find('a'))
                    twitterUserNameScreenName.find('a').remove()

                    var twitterUserLocation = $('.timeline').find('.twitter_user-local')
                    twitterUserLocation.css('display', 'flex')

                    $('.timeline').find('.twitter_user-main').css('padding', '0 10px')

                    $('.twitter_user').css('border-bottom', 'solid 1px #e6ecf0')
                    $('.timeline:last').append('<div class="loader" style="font-size: 2px; margin: 8px auto auto;"></div>')
                }
            })
        }

        function changeContentTweet(tweet_id) {
            $('.tweet').each(function(index, element) {
                if ($(element).data('tweet_id') === tweet_id) {
                    $('.timeline').html($(element).prop('outerHTML'))

                    $('.timeline:last').append('<div class="loader" style="font-size: 2px; margin: 8px auto auto;"></div>')
                }
            })
        }
    }

    function scrollPageTop() {
        scrollTop(500)

        function scrollTop(n) {
            var t = new Date,
                i = window.pageYOffset,
                r = setInterval(() => {
                    var u = new Date - t;
                    u > n && (clearInterval(r), u = n);
                    window.scrollTo(0, i * (1 - u / n))
                }, 10)
        }
    }

    function twitterViewAllPictures() {
        var prop = $('.load_pictures').prop('checked');
        var twitterViewPictures = localStorage.getItem('twitter-view_pictures')
        if (twitterViewPictures != null) {
            if (prop) {
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
            } else {
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
        }
    }

    function twitterViewAllVideos() {
        var prop = $('.load_videos').prop('checked');
        var twitterViewVideos = localStorage.getItem('twitter-view_videos')
        if (twitterViewVideos != null) {
            if (prop) {
                $('.tweet-twitter_view_video').each(function(index, twitter_view_video) {
                    if ($(twitter_view_video).css('display') !== 'none') {
                        var twitter_view_video_data_video_bitrate = $(twitter_view_video).data('video-bitrate')
                        $(twitter_view_video).parent().find('.tweet-twitter_video').each(function(index, element) {
                            var data_video_src = $(element).data('video-src')
                            var data_video_bitrate = $(element).data('video-bitrate')
                            var video_element = '<video class="tweet-twitter_video_movie" style="width: 100%; height: 285px; border-radius: 12px; margin-top: 12px; outline: none; cursor: pointer;" controls><source src="' + data_video_src + '" data-bitrate="' + data_video_bitrate + '"></video>'
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
            } else {
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
        }
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

    $(document).on('click', '.tweet-load_more_new_tweet', function() {
        var tweet_id = $('.format_timeline > div:first').next().data('tweet_id');
        loadMoreTweet(tweet_id, 'new');
    })
    $(document).on('click', '.tweet-load_more_old_tweet', function() {
        var tweet_id = $('.format_timeline > div:last').prev().data('tweet_id');
        loadMoreTweet(tweet_id, 'old');
    })

    // load_type = new, old
    function loadMoreTweet(tweet_id, load_type) {
        var href = '';
        if (load_type === 'new') {
            href = '/twitter?since_id=' + tweet_id;
        } else if (load_type === 'old') {
            href = '/twitter?max_id=' + tweet_id;
        } else {
            console.error('load_type is not specific.');
            return false;
        }
        loadMoreTweetLoader(load_type, true)
        if ($('#twitter_user').length > 0) {
            var screen_name = $('#twitter_user').find('.twitter_user-screen_name').text().replace('@', '')
            href = href.replace('/twitter', '/twitter/' + screen_name)
        }
        $('#ajax-progress-bar').removeClass('bg-danger');
        $('#ajax-progress-bar').css({
            'visibility': 'visible'
        });
        $('#ajax-progress-bar').css({
            'width': '80%'
        });
        alreadyBottom = true;

        fetch(
            href, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
            }
        ).then(response => {
            if (response.ok) {
                return response.text()
            } else {
                console.error(data)
                showError()
            }
        }).then(data => {
            if (load_type === 'new') {
                $('.format_timeline > div:first').next().before($(data).find('.format_timeline').html())
            } else if (load_type === 'old') {
                $('.format_timeline > div:last').prev().after($(data).find('.format_timeline').html())
            }
            loadMoreTweetLoader(load_type, false)

            setTweetCreated_at()

            twitterViewAllPictures()
            twitterViewAllVideos()
            alreadyBottom = false;

            changeFontSize()
            changeTwitterPictureHeight()
            setClearIcon()

            AquaProjectCache[location.href.replace(location.origin, '')] = $('html').html()

            $('#ajax-progress-bar').css({
                'width': '100%',
                'transition': 'width 0.1s ease 0s'
            })

            wait(0.2).done(function() {
                $('#ajax-progress-bar').css({
                    'visibility': 'hidden',
                    'width': '0%',
                    'transition': 'width 0.6s ease 0s'
                })
            })
        }).catch(err => {
            console.error(err)
            showError()
        })

        function loadMoreTweetLoader(load_type, showFlag) {
            if (load_type === 'new' || load_type === 'old') {
                if (showFlag == true) {
                    $('.tweet-load_more_' + load_type + '_tweet').find('.tweet-load_more_' + load_type + '_tweet_message').each(function(index, element) {
                        $(element).css({
                            'display': 'none'
                        })
                    })
                    $('.tweet-load_more_' + load_type + '_tweet_loader').css({
                        'display': 'block'
                    })
                } else if (showFlag == false) {
                    $('.tweet-load_more_' + load_type + '_tweet').find('.tweet-load_more_' + load_type + '_tweet_message').each(function(index, element) {
                        $(element).css({
                            'display': 'block'
                        })
                    })
                    $('.tweet-load_more_' + load_type + '_tweet_loader').css({
                        'display': 'none'
                    })
                }
            }
        }
    }

    $(document).on('click', '.tweet-twitter_urls', function(event) {
        event.stopPropagation()
    })

    function changeTwitterTimelineBackgroundSize() {
        var mainWidth = $('#main').width()
        $('.timeline_background').css({
            'width': mainWidth + 'px'
        })
    }

    $(window).resize(function() {
        changeTwitterTimelineBackgroundSize()
    })

    function twitterAccount() {
        var href = '/twitter/account'
        if (AquaProjectCache[href]) {
            $('.twitter-account').html($(AquaProjectCache[href]).find('.twitter-account').html());
            changeFontSize()
        } else {
            refreshTwitterAccount()
        }

        function refreshTwitterAccount() {
            fetch(
                href, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include'
                }
            ).then(response => {
                if (response.ok) {
                    return response.text()
                } else {
                    alert(response)
                }
            }).then(data => {
                // Save Cache.
                AquaProjectCache[href] = data
                $('.twitter-account').html($(data).find('.twitter-account').html());
            changeFontSize()
            }).catch(err => {
                alert(err)
            })
        }
    }

    function twitterTrends() {
        var href = '/twitter/trends'
        if (AquaProjectCache[href]) {
            $('.twitter-trends').html($(AquaProjectCache[href]).find('.twitter-trends').html());
            changeFontSize()
        } else {
            refreshTwitterTrends()
        }

        function refreshTwitterTrends() {
            fetch(
                href, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include',
                }
            ).then(response => {
                if (response.ok) {
                    return response.text()
                } else {
                    alert(response)
                }
            }).then(data => {
                // Save Cache.
                AquaProjectCache[href] = data
                $('.twitter-trends').html($(data).find('.twitter-trends').html());
            changeFontSize()
                hideSideContentLoader()
            }).catch(data => {
                alert(data)
            })
        }

        function hideSideContentLoader() {
            $('.side_content_loader').css({
                'display': 'none'
            })
        }
    }

    function setTweetCreated_at() {
        $('.tweet-twitter_createdat').each(function(inddex, element) {
            var createdat_title = $(element).attr('title')
            var created_at_time = new Date($(element).attr('title')).getTime()
            var currentTime = new Date().getTime()
            var diffTime = currentTime - created_at_time
            var displayTime = calculateTime(diffTime, createdat_title)
            displayTime = ' · ' + displayTime
            $(element).text(displayTime)
        })

        $('.twitter_user-created_at').each(function(index, element) {
            var createdat_title = $(element).attr('title')
            var calendarIcon = '<i class="far fa-calendar-alt" style="padding-top: 4px;"></i> '
            var created_at_time = new Date($(element).attr('title')).getTime()
            var currentTime = new Date().getTime()
            var diffTime = currentTime - created_at_time
            var displayTime = calculateJoinTime(diffTime, createdat_title)
            displayTime = '<div style="padding-left: 4px;">' + displayTime + '</div>'
            $(element).text('')
            $(element).append(calendarIcon)
            $(element).append(displayTime)
        })

        function calculateTime(diffTime, createdat_title) {
            var diffTime = diffTime
            diffTime /= 1000
            var displayTime = ''
            if (diffTime < 60) {
                displayTime = parseInt(diffTime) + 's'
            } else if (diffTime < 60 * 60) {
                displayTime = parseInt(diffTime / 60) + 'm'
            } else if (diffTime < 60 * 60 * 24) {
                displayTime = parseInt(diffTime / 60 / 60) + 'h'
            } else {
                var displayCreated_at = new Date(createdat_title)
                var month_list = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                displayTime = month_list[displayCreated_at.getMonth()] + ' ' + displayCreated_at.getDate()
            }
            return displayTime
        }

        function calculateJoinTime(diffTime, createdat_title) {
            var diffTime = diffTime
            diffTime /= 1000
            var displayTime = ''
            var displayCreated_at = new Date(createdat_title)
            var month_list = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            displayTime = month_list[displayCreated_at.getMonth()] + ' ' + displayCreated_at.getDate() + ' ' + displayCreated_at.getFullYear()
            return displayTime
        }
    }

    $(document).on('mouseenter', '.tweet-twitter_user_name', function() {
        var y = $(this).position().top + $(this).height()
        $(this).find('.tweet-twitter_user_tooltip').css('display', 'block').css('top', y)
    });

    $(document).on('mouseleave', '.tweet-twitter_user_name', function() {
        $(this).find('.tweet-twitter_user_tooltip').css('display', 'none');
    });

    $(document).on('click', '.tweet-twitter_user_tooltip', function(event) {
        event.stopPropagation()
    })

    function setClearIcon() {
        var prop = $('.load_clear_icon').prop('checked')
        var twitter_view_clear_icon_flag = localStorage.getItem('twitter-view_clear_icon')
        if (twitter_view_clear_icon_flag != null) {
            if (prop) {
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
            } else {
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
        }
    }

    $(document).on('click', '.tweet-twitter_full_text_hashtags', function(event) {
        event.stopPropagation()
    })

    $(document).on('click', '.twitter_user-follow_button', function() {
        var follow_status = $(this).data('twitter_user-follow_status')
        var screen_name = $(this).data('twitter_user-screen_name')
        var friendships = ''
        if (follow_status === true) friendships = 'destroy'
        else if (follow_status === false) friendships = 'create'
        $('.twitter_user-follow_button').each((index, element) => {
            if ($(element).data('twitter_user-screen_name') === screen_name) {
                $(element).prop('disabled', true)
            }
        })
        fetch(
            '/twitter/friendships/' + friendships, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify({
                    "screen_name": screen_name,
                }),
                headers: {
                    "X-CSRFToken": getCookie('csrftoken')
                }
            },
        ).then(response => {
            if (response.ok) {
                return response.text()
            } else {
                console.error(response)
            }
        }).then(() => {
            if (follow_status === true) {
                $('.twitter_user-follow_button').each((index, element) => {
                    if ($(element).data('twitter_user-screen_name') === screen_name) {
                        $(element).removeClass('btn-primary')
                        $(element).addClass('btn-outline-primary')
                        $(element).text('Follow')
                        $(element).data('twitter_user-follow_status', false)
                        $(element).prop('disabled', false)
                    }
                })
            } else if (follow_status === false) {
                $('.twitter_user-follow_button').each((index, element) => {
                    if ($(element).data('twitter_user-screen_name') === screen_name) {
                        $(element).removeClass('btn-outline-primary')
                        $(element).addClass('btn-primary')
                        $(element).text('Following')
                        $(element).data('twitter_user-follow_status', true)
                        $(element).prop('disabled', false)
                    }
                })
            }
        }).catch(err => {
            console.error(err)
        })
    })

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function wait(sec) {
        var objDef = new $.Deferred;
        setTimeout(function() {
            objDef.resolve(sec);
        }, sec * 1000);
        return objDef.promise();
    }

    function showError() {
        console.error('fail. something happen.')
        $('#ajax-progress-bar').addClass('bg-danger');
        $('#ajax-progress-bar').css({
            'width': '100%'
        });
        $(history.state['changeLocation']).html('<div style="word-break: break-all; margin: 8px auto auto;"><div style="margin: 0px auto; width: fit-content;"><div style="width: fit-content; margin: 0px auto;"><i class="fas fa-exclamation-circle"></i></div>Looks like you lost your connection. Please check it and try again.</div></div>')
    }
})