$(function() {
    $(window).on('aquaproject_popstate', function() {
        if ('/' + location.pathname.replace(location.origin, '').split('/')[1] === '/twitter') {
            console.log('twitter!')
            changeFontSize()
            setTweetCreated_at()
            twitterViewAllPictures()
            twitterViewAllVideos()
            changeTwitterPictureSize()
            twitterProfile()
            twitterTrends()
            setClearIcon()
            changeTwitterTimelineBackgroundSize()
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

        var current_img_src = $(this).data('img-src')
        var current_img_number = 0
        var img_table = []
        $(this).parents('.tweet-twitter_pictures').find('.tweet-twitter_picture').each((index, element) => {
            img_table.push($(element).data('img-src'))
            if ($(element).data('img-src') === current_img_src) current_img_number = index
        })

        $('.tweet-twitter_picture_zoom-container').empty()
        for (let index = 0; index < img_table.length; index++) {
            var insertIMG = `
            <div class="tweet-twitter_picture_zoom-element">
            <img class="tweet-twitter_picture_zoom-element_img" src="${img_table[index]}">
            </div>
            `
            $('.tweet-twitter_picture_zoom-container').append(insertIMG)
        }

        var rgb_color = `rgb(${generateRandomNumber(0, 172)}, ${generateRandomNumber(0, 172)}, ${generateRandomNumber(0, 172)}`
        $('.tweet-twitter_picture_zoom').css('background', `${rgb_color}, 0.9)`)
        $('.tweet-twitter_picture_zoom-navigator').css('background', `${rgb_color})`)

        var tweet_twitter_picture_zoom = $('.tweet-twitter_picture_zoom')
        if (tweet_twitter_picture_zoom.css('display') === 'none') {
            tweet_twitter_picture_zoom.css('display', 'flex')
        }
        jumpToSlide(current_img_number, 0)
        tweetTwitterPictureZoomOpen(current_img_number)

        function generateRandomNumber(random_min_number, random_max_number) {
            return Math.floor(Math.random() * (random_max_number - random_min_number) + random_min_number)
        }
    }

    $(document).on('touchstart', '.tweet-twitter_picture_zoom-container', boxContainerTouchStart)
    $(document).on('touchmove', '.tweet-twitter_picture_zoom-container', boxContainerTouchMove)
    $(document).on('touchend', '.tweet-twitter_picture_zoom-container', boxContainerTouchEnd)
    // $(document).on('mousedown', '.tweet-twitter_picture_zoom-container', boxContainerMouseDown)
    // $(document).on('mousemove', '.tweet-twitter_picture_zoom-container', boxContainerMouseMove)
    // $(document).on('mouseup', '.tweet-twitter_picture_zoom-container', boxContainerMouseUp)
    // $(document).on('mouseleave', '.tweet-twitter_picture_zoom-container', boxContainerMouseLeave)
    $(document).on('click', '.tweet-twitter_picture_zoom-prev', prevSlideBtn)
    $(document).on('click', '.tweet-twitter_picture_zoom-next', nextSlideBtn)

    var touchingPositionPageX = 0
    var touchStartScrollLeft = 0
    var currentSlideNumber = {
        number: 0
    }
    var currentSlideNumberProxy = new Proxy(currentSlideNumber, {
        set: (target, property, value) => {
            target[property] = value
            tweetTwitterPictureCloseDisplayController()
            return true
        }
    })

    function boxContainerTouchStart(e) {
        touchingPositionPageX = e.changedTouches[0].pageX
        touchStartScrollLeft = this.scrollLeft
    }

    function boxContainerTouchMove(e) {
        this.scrollLeft = touchStartScrollLeft + touchingPositionPageX - e.changedTouches[0].pageX
    }

    function boxContainerTouchEnd(e) {
        if (touchingPositionPageX - e.changedTouches[0].pageX > this.offsetWidth / 4) {
            scrollContentLeft(
                this,
                ($(`.${e.target.className}`).index(e.target) + 1) * e.target.offsetWidth - this.scrollLeft,
                200
            )
            currentSlideNumberProxy.number += 1
        } else if (touchingPositionPageX - e.changedTouches[0].pageX < -(this.offsetWidth / 4)) {
            scrollContentLeft(
                this,
                ($(`.${e.target.className}`).index(e.target) - 1) * e.target.offsetWidth - this.scrollLeft,
                200
            )
            currentSlideNumberProxy.number -= 1
        } else {
            scrollContentLeft(
                this,
                $(`.${e.target.className}`).index(e.target) * e.target.offsetWidth - this.scrollLeft,
                200
            )
        }
        touchingPositionPageX = 0
        touchStartScrollLeft = 0
    }

    var clickingNow = false
    var clickingPositionOffsetX = 0
    var clickingPositionPageX = 0

    function boxContainerMouseDown(e) {
        clickingNow = true
        clickingPositionOffsetX = e.offsetX
        clickingPositionPageX = e.pageX
    }

    function boxContainerMouseMove(e) {
        if (clickingNow) {
            this.scrollLeft = this.scrollLeft + clickingPositionOffsetX - e.offsetX
        }
    }

    function boxContainerMouseUp(e) {
        if (clickingPositionPageX - e.pageX > this.offsetWidth / 4) {
            scrollContentLeft(
                this,
                ($(`.${e.target.className}`).index(e.target) + 1) * e.target.offsetWidth - this.scrollLeft,
                200
            )
            currentSlideNumberProxy.number += 1
        } else if (clickingPositionPageX - e.pageX < -(this.offsetWidth / 4)) {
            scrollContentLeft(
                this,
                ($(`.${e.target.className}`).index(e.target) - 1) * e.target.offsetWidth - this.scrollLeft,
                200
            )
            currentSlideNumberProxy.number -= 1
        } else {
            scrollContentLeft(
                this,
                $(`.${e.target.className}`).index(e.target) * e.target.offsetWidth - this.scrollLeft,
                200
            )
        }
        clickingNow = false
    }

    function boxContainerMouseLeave(e) {
        if (!clickingNow) return false
        if (clickingPositionPageX - e.pageX > this.offsetWidth / 4) {
            scrollContentLeft(
                this,
                ($(`.${e.target.className}`).index(e.target) + 1) * e.target.offsetWidth - this.scrollLeft,
                200
            )
            currentSlideNumberProxy.number += 1
        } else if (clickingPositionPageX - e.pageX < -(this.offsetWidth / 4)) {
            scrollContentLeft(
                this,
                ($(`.${e.target.className}`).index(e.target) - 1) * e.target.offsetWidth - this.scrollLeft,
                200
            )
            currentSlideNumberProxy.number -= 1
        } else {
            scrollContentLeft(
                this,
                $(`.${e.target.className}`).index(e.target) * e.target.offsetWidth - this.scrollLeft,
                200
            )
        }
        clickingNow = false
    }

    function prevSlideBtn() {
        scrollContentLeft(
            document.getElementsByClassName('tweet-twitter_picture_zoom-container')[0],
            (currentSlideNumberProxy.number - 1) * document.getElementsByClassName('tweet-twitter_picture_zoom-element')[0].offsetWidth - document.getElementsByClassName('tweet-twitter_picture_zoom-container')[0].scrollLeft,
            200
        )
        if (currentSlideNumberProxy.number > 0) {
            currentSlideNumberProxy.number -= 1
        }
    }

    function nextSlideBtn() {
        scrollContentLeft(
            document.getElementsByClassName('tweet-twitter_picture_zoom-container')[0],
            (currentSlideNumberProxy.number + 1) * document.getElementsByClassName('tweet-twitter_picture_zoom-element')[0].offsetWidth - document.getElementsByClassName('tweet-twitter_picture_zoom-container')[0].scrollLeft,
            200
        )
        if (currentSlideNumberProxy.number < document.getElementsByClassName('tweet-twitter_picture_zoom-element').length - 1) {
            currentSlideNumberProxy.number += 1
        }
    }

    function jumpToSlide(jumpToSlideNumber, duration = 200) {
        if (duration < 100) {
            changeContentLeft(
                document.getElementsByClassName('tweet-twitter_picture_zoom-container')[0],
                (jumpToSlideNumber) * document.getElementsByClassName('tweet-twitter_picture_zoom-element')[0].offsetWidth - document.getElementsByClassName('tweet-twitter_picture_zoom-container')[0].scrollLeft,
            )
        } else {
            scrollContentLeft(
                document.getElementsByClassName('tweet-twitter_picture_zoom-container')[0],
                (jumpToSlideNumber) * document.getElementsByClassName('tweet-twitter_picture_zoom-element')[0].offsetWidth - document.getElementsByClassName('tweet-twitter_picture_zoom-container')[0].scrollLeft,
                duration
            )
        }
        currentSlideNumberProxy.number = jumpToSlideNumber
    }

    function scrollContentLeft(n, t, i) {
        var r = new Date,
            u = n.scrollLeft,
            f = setInterval(() => {
                var e = new Date - r;
                e > i && (clearInterval(f), e = i);
                n.scrollLeft = u + t * (e / i)
            }, 10)
    }

    function changeContentLeft(n, t) {
        var u = n.scrollLeft
        n.scrollLeft = u + t
    }

    function tweetTwitterPictureZoomOpen(currentImgNumber) {
        startFadeInUP($('.tweet-twitter_picture_zoom-element').eq(currentImgNumber))
    }

    function tweetTwitterPictureZoomClose() {
        startFadeOutUP($('.tweet-twitter_picture_zoom-element'))
        setTimeout(() => {
            var tweet_twitter_picture_zoom = $('.tweet-twitter_picture_zoom')
            if (tweet_twitter_picture_zoom.css('display') === 'flex') {
                tweet_twitter_picture_zoom.css('display', 'none')
            }
        }, 200);
    }

    $(document).on('click', '.tweet-twitter_picture_zoom-close', tweetTwitterPictureZoomClose)
    $(document).on('click', '.tweet-twitter_picture_zoom-element_img', tweetTwitterPictureZoomClose)

    function tweetTwitterPictureCloseDisplayController() {
        var tweetTwitterPictureZoomElementLength = document.getElementsByClassName('tweet-twitter_picture_zoom-element').length

        if (currentSlideNumberProxy.number === 0) {
            $('.tweet-twitter_picture_zoom-prev').css('display', 'none')
        } else {
            $('.tweet-twitter_picture_zoom-prev').css('display', '')
        }

        if (currentSlideNumberProxy.number === tweetTwitterPictureZoomElementLength - 1) {
            $('.tweet-twitter_picture_zoom-next').css('display', 'none')
        } else {
            $('.tweet-twitter_picture_zoom-next').css('display', '')
        }
    }

    $(document).on('keydown', function(event) {
        if ($('.tweet-twitter_picture_zoom').css('display') != 'none') {
            var keycode = event.keyCode
            if (keycode === 37) {
                prevSlideBtn()
            } else if (keycode === 39) {
                nextSlideBtn()
            }
        }
    })

    function startFadeInUP(component) {
        component.removeClass('fadeInUp')
        component.addClass('animated fadeInUp')
    }

    function startFadeOutUP(component) {
        component.removeClass('fadeOutUp')
        component.addClass('animated fadeOutUp')
    }

    $(document).on('click', '.tweet-twitter_view_picture', tweetTwitterViewPicture)

    function tweetTwitterViewPicture(event) {
        event.stopPropagation()
        var data_img_src = $(this).parent().find('.tweet-twitter_picture').data('img-src')
        var img_element = `<img class="tweet-twitter_picture_img" src="${data_img_src}" style="object-fit: cover; height: ${localStorage.getItem('twitter-image_size')}px; border-radius: 12px; cursor: pointer;" loading="lazy">`
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
        if (window.getSelection().toString() !== '') return false;
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
            // Copy ..tweet-load_more_new_tweet
            var tweetLoadMoreNewTweet = $('.tweet-load_more_new_tweet')[0].outerHTML
            // The following will be changed:
            // .twitter_user-background_image -> Expand image.
            // .twitter_user-profile_image -> Add .tweet-twitter_icon, twitter_anchor, image property.
            // .twitter_user-name_screen_name -> Add twitter_anchor
            // .twitter_user-location -> css:display
            // .twitter_user-main -> css:padding
            // .tweet-load_more_new_tweet -> Paste
            // .format_timeline-home-block -> css: display:none
            // .tweet-twitter_user-profile_timelines_navigation-block -> css: display:''
            $('.twitter_user').each(function(index, element) {
                if ($(element).data('twitter_user-screen_name') === screen_name) {
                    $('.timeline').html($(element).prop('outerHTML'))

                    var TwitterUserBackgroundImage = $('.timeline').find('.twitter_user-background_image').data('img-src')
                    var TwitterUserBackgroundImageIMG = `<img src="${TwitterUserBackgroundImage}" loading="lazy">`
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

                    $('.timeline:last').append(tweetLoadMoreNewTweet)
                    $('.format_timeline-home-block').css('display', 'none')
                    $('.tweet-twitter_user-profile_timelines_navigation-block').css('display', '')
                    tweetTwitterUserProfileTimelineNavigationSelected(document.querySelector('.tweet-twitter_user-profile_timeline_navigation-tweets'))

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
                            var img_element = `<img class="tweet-twitter_picture_img" src="${data_img_src}" style="object-fit: cover; height: ${localStorage.getItem('twitter-image_size')}px; border-radius: 12px; cursor: pointer;" loading="lazy">`
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

    function changeTwitterPictureSize() {
        var picture_height = localStorage.getItem('twitter-image_size')

        $('.tweet-twitter_picture_length').each((index, element) => {
            var picture_width = $(element).width()
            var picture_length = parseInt($(element).data('picture_length'))
            var tweet_twitter_picture_img =
                $(element)
                .parents('.tweet-twitter_pictures')
                .find('.tweet-twitter_picture_img')

            if (picture_length === 3) {
                tweet_twitter_picture_img.each((index, element_img) => {
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
                            'height': `${picture_height}px`,
                            'width': `${picture_width / 2}px`
                        })
                    } else if (index > 0) {
                        $(element_img).css({
                            'height': `${picture_height / 2}px`,
                            'width': `${picture_width / 2}px`,
                        })
                    }
                })
            }
            if (picture_length === 4) {
                tweet_twitter_picture_img.each((index, element_img) => {
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
                        'height': `${picture_height / 2}px`,
                        'width': `${picture_width / 2}px`,
                    })
                })
            }
            if (picture_length === 2) {
                tweet_twitter_picture_img.each((index, element_img) => {
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
                    $(element_img).css({
                        'height': `${picture_height}px`,
                        'width': `${picture_width / 2}px`,
                    })
                })
            }
            if (picture_length === 1) {
                tweet_twitter_picture_img.css({
                    'height': `${picture_height}px`,
                    'width': `${picture_width}px`,
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
            var current_scrollHeight = 0
            if (load_type === 'new') {
                current_scrollHeight = document.body.scrollHeight
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
            changeTwitterPictureSize()
            setClearIcon()

            if (load_type === 'new') {
                var diff = document.body.scrollHeight - current_scrollHeight
                window.scrollTo(window.scrollX, window.scrollY + diff)
            }

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

    function twitterProfile() {
        var href = '/twitter/profile'
        if (AquaProjectCache[href]) {
            $('.twitter-profile').html($(AquaProjectCache[href]).find('.twitter-profile').html());
            changeFontSize()
        } else {
            refreshtwitterProfile()
        }

        function refreshtwitterProfile() {
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
                $('.twitter-profile').html($(data).find('.twitter-profile').html());
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

    $(document).on('click', '.twitter_user-lists_button', function() {
        var lists_status = $(this).data('twitter_user-lists_status')
        var screen_name = $(this).data('twitter_user-screen_name')
        $('.twitter_user-lists_button').each((index, element) => {
            if ($(element).data('twitter_user-screen_name') === screen_name) {
                $(element).prop('disabled', true)
            }
        })
        if (lists_status === 'unknown') {
            listsMembers(screen_name)
        } else if (lists_status === 'tracked') {
            listsMembersDestroy(screen_name)
        } else if (lists_status === 'untracked') {
            listsMembersCreate(screen_name)
        }
    })

    function listsMembers(screen_name) {
        fetch(
            '/twitter/lists/members', {
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
        }).then(data => {
            $('.twitter_user-lists_button').each((index, element) => {
                if ($(element).data('twitter_user-screen_name') === screen_name) {
                    $(element).prop('disabled', false)
                    if (data === 'untracked') {
                        var userplus = '<i class="fas fa-user-plus"></i>'
                        $(element).empty()
                        $(element).append(userplus)
                        $(element).data('twitter_user-lists_status', 'untracked')
                    } else if (data === 'tracked') {
                        var usercheck = '<i class="fas fa-user-check"></i>'
                        $(element).empty()
                        $(element).append(usercheck)
                        $(element).data('twitter_user-lists_status', 'tracked')
                    } else {
                        console.error(err)
                    }
                }
            })
        }).catch(err => {
            console.error(err)
        })
    }

    function listsMembersCreate(screen_name) {
        fetch(
            '/twitter/lists/members/create', {
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
            $('.twitter_user-lists_button').each((index, element) => {
                if ($(element).data('twitter_user-screen_name') === screen_name) {
                    $(element).prop('disabled', false)
                    var usercheck = '<i class="fas fa-user-check"></i>'
                    $(element).empty()
                    $(element).append(usercheck)
                    $(element).data('twitter_user-lists_status', 'tracked')
                }
            })
        }).catch(err => {
            console.error(err)
        })
    }

    function listsMembersDestroy(screen_name) {
        fetch(
            '/twitter/lists/members/destroy', {
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
            $('.twitter_user-lists_button').each((index, element) => {
                if ($(element).data('twitter_user-screen_name') === screen_name) {
                    $(element).prop('disabled', false)
                    var userplus = '<i class="fas fa-user-plus"></i>'
                    $(element).empty()
                    $(element).append(userplus)
                    $(element).data('twitter_user-lists_status', 'untracked')
                }
            })
        }).catch(err => {
            console.error(err)
        })
    }

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

    $(document).on('click', '.tweet-twitter_favorite', function(event) {
        event.stopPropagation()

        var tweet_favorited = $(this).data('tweet_favorited')
        var tweet_id = $(this).data('tweet_id')
        $('.tweet-twitter_favorite').each((index, element) => {
            if (parseInt($(element).data('tweet_id')) === tweet_id) {
                $(element).prop('disabled', true)
            }
        })
        if (tweet_favorited === 'true' || tweet_favorited === 'True') {
            favoritesDestroy(tweet_id)
        } else {
            favoritesCreate(tweet_id)
        }
    })

    function favoritesCreate(tweet_id) {
        fetch(
            '/twitter/favorites/create', {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify({
                    "tweet_id": tweet_id,
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
        }).then(data => {
            if ($(data).find('.format_timeline').children('.tweet').length !== 1) {
                console.error('Aquring data has more than 1 tweet.')
            }
            $('.tweet-twitter_favorite').each((index, element) => {
                if ($(element).data('tweet_id') === tweet_id) {
                    $(data).find('.tweet-twitter_social').each((index, dataElement) => {
                        if ($(dataElement).find('.tweet-twitter_favorite').data('tweet_id') === tweet_id) {
                            $(element).parents('.tweet-twitter_social').html($(dataElement).html())
                        }
                    })
                }
            })
        }).catch(err => {
            console.error(err)
        })
    }

    function favoritesDestroy(tweet_id) {
        fetch(
            '/twitter/favorites/destroy', {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify({
                    "tweet_id": tweet_id,
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
        }).then(data => {
            if ($(data).find('.format_timeline').children('.tweet').length !== 1) {
                console.error('Aquring data has more than 1 tweet.')
            }
            $('.tweet-twitter_favorite').each((index, element) => {
                if ($(element).data('tweet_id') === tweet_id) {
                    $(data).find('.tweet-twitter_social').each((index, dataElement) => {
                        if ($(dataElement).find('.tweet-twitter_favorite').data('tweet_id') === tweet_id) {
                            $(element).parents('.tweet-twitter_social').html($(dataElement).html())
                        }
                    })
                }
            })
        }).catch(err => {
            console.error(err)
        })
    }

    $(document).on('click', '.tweet-twitter_user-profile_timelines_navigation-item', function(event) {
        event.stopPropagation()
        var href = this.querySelector('a').href
        tweetTwitterUserProfileTimelineNavigationSelected(this)
        tweetTwitterUserProfileTimelineNavigationPushState(href)
        tweetTwitterUserProfileTimelineNavigationLoader()
        tweetTwitterUserProfileTimelineNavigationFetch(href.replace(location.origin, ''), true)
        return false
    })

    function tweetTwitterUserProfileTimelineNavigationSelected(element) {
        var tweetTwitterUserProfileTimelinesNavigationItem =
            document.querySelectorAll('.tweet-twitter_user-profile_timelines_navigation-item')

        for (let index = 0; index < tweetTwitterUserProfileTimelinesNavigationItem.length; index++) {
            tweetTwitterUserProfileTimelinesNavigationItem[index].classList.remove(
                'tweet-twitter_user-profile_timeline_navigation-selected'
            )
        }

        element.classList.add('tweet-twitter_user-profile_timeline_navigation-selected')
    }

    function tweetTwitterUserProfileTimelineNavigationPushState(href) {
        var targetPage = href
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
    }

    function tweetTwitterUserProfileTimelineNavigationLoader() {
        var tweets = document.querySelectorAll('.tweet')
        for (let index = 0; index < tweets.length; index++) {
            tweets[index].remove()
        }
        document.querySelector('.tweet-load_more_old_tweet').remove()
        document.querySelector('.tweet-load_more_new_tweet').insertAdjacentHTML(
            'afterend', '<div class="loader" style="font-size: 2px; margin: 8px auto auto;"></div>'
        )
    }

    function tweetTwitterUserProfileTimelineNavigationFetch(href, useCache = true) {
        $('#ajax-progress-bar').removeClass('bg-danger');
        $('#ajax-progress-bar').css('visibility', 'visible');

        // Cache exsists.
        if (AquaProjectCache[href]) {
            if (history.state['drawLocationChanged'] == true) {
                $('#main').html($(AquaProjectCache[href]).find('#main').html());
            } else {
                $(history.state['changeLocation']).html($(AquaProjectCache[href]).find(history.state['changeLocation']).html());
            }
            $('#ajax-progress-bar').css('width', '100%');

            window.dispatchEvent(new Event('aquaproject_popstate'));

            if (useCache === true) {
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

                return false
            }
        }

        $('#ajax-progress-bar').css('width', '80%');

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
    }

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