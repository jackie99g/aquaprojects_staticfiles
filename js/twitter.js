$(function() {
    $(window).on('aquaproject_popstate', function() {
        if ('/' + location.pathname.replace(location.origin, '').split('/')[1] === '/twitter') {
            console.log('twitter!')
            changeFontSize()
            twitterViewAllPictures()
            twitterViewAllVideos()
            changeTwitterPictureHeight()
            console.log('twitter! popstate event finished.')
        }
    })
    if ('/' + location.pathname.replace(location.origin, '').split('/')[1] === '/twitter') {
        $(window).trigger('aquaproject_popstate');
    }

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
        var img_element = '<img class="tweet-twitter_picture_img" src="' + data_img_src + '" style="object-fit: cover; width: 100%; height: ' + localStorage.getItem('twitter-image_size') + 'px; border-radius: 12px; margin-top: 12px; cursor: pointer;">'
        $(this).parent().find('.tweet-twitter_picture').append(img_element)
        $(this).parent().find('.tweet-twitter_picture').css({
            'display': 'block'
        })
        $(this).css({
            'display': 'none',
        })
        $(window).trigger('aquaproject_popstate');
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

    function changeFontSize() {
        if (localStorage.getItem('font-size')) {
            var _font_size = parseInt(localStorage.getItem('font-size'))
            var font_size, small_font_size, large_font_size = ''
            var twitter_image_size = ''
            if (_font_size == 0) {
                font_size = 'x-small'
                small_font_size = 'xx-small'
                large_font_size = 'small'
                twitter_image_size = '145'
            } else if (_font_size == 25) {
                font_size = 'small'
                small_font_size = 'x-small'
                large_font_size = 'medium'
                twitter_image_size = '215'
            } else if (_font_size == 50) {
                font_size = 'medium'
                small_font_size = 'small'
                large_font_size = 'large'
                twitter_image_size = '285'
            } else if (_font_size == 75) {
                font_size = 'large'
                small_font_size = 'medium'
                large_font_size = 'x-large'
                twitter_image_size = '355'
            } else if (_font_size == 100) {
                font_size = 'x-large'
                small_font_size = 'large'
                large_font_size = 'xx-large'
                twitter_image_size = '425'
            } else {
                font_size = 'medium'
                small_font_size = 'small'
                large_font_size = 'large'
                twitter_image_size = '285'
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
        } else {
            localStorage.setItem('twitter-image_size', '285')
        }
    }

    $(document).on('click', '.twitter_anchor', twitterAnchor)

    function twitterAnchor() {
        ScrollPageTop()
        var targetPage = $(this).attr('href');
        targetPage = targetPage.replace(location.origin, '')
        var currentPage = location.href;
        currentPage = currentPage.replace(location.origin, '')
        state = {
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#main'
        };
        history.pushState(state, null, targetPage);
        changeContent(targetPage);
        return false;
    }

    function changeContent(href, doneFunc) {
        if (history.state['drawLocationChanged'] == false) {
            $('#main').html('<div class="loader" style="font-size: 2px; margin: 8px auto auto;"></div>');
        } else {
            $(history.state['changeLocation']).html('<div class="loader" style="font-size: 2px; margin: 8px auto auto;"></div>');
        }
        $('#ajax-progress-bar').removeClass('bg-danger');
        $('#ajax-progress-bar').css({
            'visibility': 'visible'
        });
        $('#ajax-progress-bar').css({
            'width': '80%'
        });
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
        }
        $.ajax({
            url: href,
            timeout: 60000,
            type: 'GET',
            dataType: 'html',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        }).done(function(data) {
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

            twitterViewAllPictures()
            twitterViewAllVideos()

            changeFontSize()
            changeTwitterPictureHeight()

            $('#ajax-progress-bar').css({
                'width': '100%'
            });
            $('#ajax-progress-bar').css({
                'transition': 'width 0.1s ease 0s'
            });

            function wait(sec) {
                var objDef = new $.Deferred;
                setTimeout(function() {
                    objDef.resolve(sec);
                }, sec * 1000);
                return objDef.promise();
            }
            wait(0.2).done(function() {
                $('#ajax-progress-bar').css({
                    'visibility': 'hidden'
                });
                $('#ajax-progress-bar').css({
                    'width': '0%'
                });
                $('#ajax-progress-bar').css({
                    'transition': 'width 0.6s ease 0s'
                });
            });
        }).fail(function() {
            $('#ajax-progress-bar').addClass('bg-danger');
            $('#ajax-progress-bar').css({
                'width': '100%'
            });
            $(history.state['changeLocation']).html('<div style="word-break: break-all; margin: 8px auto auto;"><div style="margin: 0px auto; width: fit-content;"><div style="width: fit-content; margin: 0px auto;"><i class="fas fa-exclamation-circle"></i></div>Looks like you lost your connection. Please check it and try again.</div></div>')
        })
    }

    function ScrollPageTop() {
        $('html').animate({
            scrollTop: 0
        }, {
            duration: 1000
        }, 'linear')
    }

    function twitterViewAllPictures() {
        var prop = $('.load_pictures').prop('checked');
        var twitterViewPictures = localStorage.getItem('twitter-view_pictures')
        if (twitterViewPictures != null) {
            if (prop) {
                $('.tweet-twitter_picture').each(function(index, element) {
                    if ($(element).parent().find('.tweet-twitter_view_picture').css('display') !== 'none') {
                        var data_img_src = $(element).data('img-src')
                        var img_element = '<img class="tweet-twitter_picture_img" src="' + data_img_src + '" style="object-fit: cover; width: 100%; height: ' + localStorage.getItem('twitter-image_size') + 'px; border-radius: 12px; margin-top: 12px; cursor: pointer;">'
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
            if (picture_length >= 3) {
                var tweet_twitter_pictures = $(element).parent()
                var picture_width = localStorage.getItem('twitter-image_size')
                tweet_twitter_pictures.find('.tweet-twitter_picture_img').each(function(index, element_img) {
                    if (index > 1) {
                        $(element_img).css({
                            'margin-top': '0'
                        })
                    }
                    if (index == 0) {
                        $(element_img).css({
                            'border-radius': '12px 0 0 0'
                        })
                    } else if (index == 1) {
                        $(element_img).css({
                            'border-radius': '0 12px 0 0'
                        })
                        $(element_img).css({
                            'margin-left': '4px'
                        })
                    } else if (index == 2) {
                        $(element_img).css({
                            'border-radius': '0 0 0 12px'
                        })
                        $(element_img).css({
                            'margin-top': '4px'
                        })
                    } else if (index == 3) {
                        $(element_img).css({
                            'border-radius': '0 0 12px 0'
                        })
                        $(element_img).css({
                            'margin-top': '4px'
                        })
                        $(element_img).css({
                            'margin-left': '4px'
                        })
                    }
                    if (index == 2 && picture_length == 3) {
                        $(element_img).css({
                            'border-radius': '0 0 12px 12px'
                        })
                        $(element_img).css({
                            'margin-top': '4px'
                        })
                        $(element_img).css({
                            'margin-left': '0'
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
                    if (index == 0) {
                        $(element_img).css({
                            'border-radius': '12px 0 0 12px'
                        })
                        $(element_img).css({
                            'margin-right': '4px'
                        })
                    } else if (index == 1) {
                        $(element_img).css({
                            'border-radius': '0 12px 12px 0'
                        })
                        $(element_img).css({
                            'margin-left': '4px'
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
        if ($('.twitter_user').length > 0) {
            var screen_name = $('.twitter_user').find('.twitter_user-screen_name').text().replace('@', '')
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

        $.ajax({
            url: href,
            timeout: 60000,
            type: 'GET',
            dataType: 'html',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        }).done(function(data) {
            if (load_type === 'new') {
                $('.format_timeline > div:first').next().before($(data).find('.format_timeline').html())
            } else if (load_type === 'old') {
                $('.format_timeline > div:last').prev().after($(data).find('.format_timeline').html())
            }
            loadMoreTweetLoader(load_type, false)

            twitterViewAllPictures()
            twitterViewAllVideos()
            alreadyBottom = false;

            changeFontSize()
            changeTwitterPictureHeight()

            $('#ajax-progress-bar').css({
                'width': '100%'
            });
            $('#ajax-progress-bar').css({
                'transition': 'width 0.1s ease 0s'
            });

            function wait(sec) {
                var objDef = new $.Deferred;
                setTimeout(function() {
                    objDef.resolve(sec);
                }, sec * 1000);
                return objDef.promise();
            }
            wait(0.2).done(function() {
                $('#ajax-progress-bar').css({
                    'visibility': 'hidden'
                });
                $('#ajax-progress-bar').css({
                    'width': '0%'
                });
                $('#ajax-progress-bar').css({
                    'transition': 'width 0.6s ease 0s'
                });
            });
        }).fail(function() {
            console.error('fail. something happen.')
            $('#ajax-progress-bar').addClass('bg-danger');
            $('#ajax-progress-bar').css({
                'width': '100%'
            });
            $(history.state['changeLocation']).html('<div style="word-break: break-all; margin: 8px auto auto;"><div style="margin: 0px auto; width: fit-content;"><div style="width: fit-content; margin: 0px auto;"><i class="fas fa-exclamation-circle"></i></div>Looks like you lost your connection. Please check it and try again.</div></div>')
        })
    }

    $(document).on('click', '.tweet-twitter_urls', function(event) {
        event.stopPropagation()
    })

    $(window).on('aquaproject_twitter_timeline_background', function() {
        var mainWidth = $('#main').width()
        $('.timeline_background').css({
            'width': mainWidth + 'px'
        })
    })

    $(window).resize(function() {
        $(window).trigger('aquaproject_twitter_timeline_background')
    })

    $(window).trigger('aquaproject_twitter_timeline_background')
})