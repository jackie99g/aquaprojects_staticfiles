(() => {
    window.addEventListener('aquaprojects_popstate', () => {
        if (`/${location.pathname.replace(location.origin, '').split('/')[1]}` === '/twitter') {
            console.log('twitter!')
            initTweetIntersectionObserver()
            initTweetPictureInsersectionObserver()
            initTweetTwitterUserIconInsersectionObserver()
            makeTwitterUserTwitterIconClear()
            changeFontSize()
            setTweetCreated_at()
            twitterProfile()
            twitterTrends()
            changeTwitterTimelineBackgroundSize()
            console.log('twitter! popstate event finished.')
        }
    })
    if (`/${location.pathname.replace(location.origin, '').split('/')[1]}` === '/twitter') {
        window.dispatchEvent(new Event('aquaprojects_popstate'));
    }

    // setInterval(() => {
    //     if (location.href.replace(location.origin, '') === '/twitter') {
    //         var currentTime = new Date()
    //         console.log(currentTime)
    //         var tweet_id = $('.format_timeline > div:first').data('tweet_id');
    //         if (document.hidden === false) {
    //             loadMoreTweet(tweet_id, 'new');
    //         }
    //     }
    // }, 60 * 1000);

    // var alreadyBottom = false;
    // $(window).scroll(function() {
    //     if ($(document).height() - $('.tweet-load_more_old_tweet').innerHeight() - $('.tweet').innerHeight() * 3 <= $(window).scrollTop() + $(window).innerHeight() && alreadyBottom === false) {
    //         console.log('Reach bottom.')
    //         var tweet_id = $('.format_timeline > div:last').prev().data('tweet_id');
    //         loadMoreTweet(tweet_id, 'old');
    //     }
    // })

    var tweetPictureInsersectionObserver = null

    function initTweetPictureInsersectionObserver() {
        if (tweetPictureInsersectionObserver) {
            try {
                tweetPictureInsersectionObserver.disconnect()
                tweetPictureInsersectionObserver = null
            } catch (e) {
                console.error(e)
            }
        }
        tweetPictureInsersectionObserver = new IntersectionObserver(processTweetPictureInsersectionObserver)
        var ttps = document.querySelectorAll('.tweet-twitter_picture')
        for (let index = 0; index < ttps.length; index++) {
            const element = ttps[index];
            tweetPictureInsersectionObserver.observe(element)
        }

        function processTweetPictureInsersectionObserver(entries, observer) {
            entries.forEach(element => {
                if (!element.isIntersecting) {
                    return false
                }
                if (!localStorage.getItem('twitter-view_pictures')) {
                    return false
                }
                var ttp = element.target
                ttp.src = ttp.dataset['src']
            })
        }
    }

    var tweetTwitterUserIconInsersectionObserver = null

    function initTweetTwitterUserIconInsersectionObserver() {
        if (tweetTwitterUserIconInsersectionObserver) {
            try {
                tweetTwitterUserIconInsersectionObserver.disconnect()
                tweetTwitterUserIconInsersectionObserver = null
            } catch (e) {
                console.error(e)
            }
        }
        tweetTwitterUserIconInsersectionObserver = new IntersectionObserver(
            processTweetTwitterUserIconInsersectionObserver
        )
        var ttui = document.querySelectorAll('.tweet-twitter_icon img')
        for (let index = 0; index < ttui.length; index++) {
            const element = ttui[index];
            tweetTwitterUserIconInsersectionObserver.observe(element)

        }

        function processTweetTwitterUserIconInsersectionObserver(entries, observer) {
            entries.forEach(element => {
                if (!element.isIntersecting) {
                    return false
                }
                if (!localStorage.getItem('twitter-view_clear_icon')) {
                    return false
                }
                var ttui = element.target
                var ttuiSrc = ttui.src
                ttui.src = ttuiSrc.replace('_normal', '_400x400')
            })
        }
    }

    function makeTwitterUserTwitterIconClear() {
        var twitterUserTwitterIcon = document.querySelector('.twitter_user-twitter_icon img')
        if (!twitterUserTwitterIcon) {
            return false
        }
        var twitterUserTwitterIconSrc = twitterUserTwitterIcon.src
        twitterUserTwitterIcon.src = twitterUserTwitterIconSrc.replace('_normal', '_400x400')
    }

    var tweetsIntersectionObserver = null

    function initTweetIntersectionObserver() {
        if (tweetsIntersectionObserver) {
            tweetsIntersectionObserver.disconnect()
            tweetsIntersectionObserver = null
        }
        tweetsIntersectionObserver = new IntersectionObserver(
            processTweetsIntersectionObserve, {
                threshold: [1.0]
            }
        )
        const tweets = document.querySelectorAll('.tweet')
        for (let index = 0; index < tweets.length; index++) {
            const element = tweets[index];
            tweetsIntersectionObserver.observe(element)
        }

        const formatTimeline = document.querySelector('.format_timeline')
        const ftftid = formatTimeline.firstElementChild.dataset['tweet_id']
        const currentPage = location.href.replace(location.origin, '')

        function processTweetsIntersectionObserve(entries, observer) {
            entries.forEach(element => {
                if (!element.isIntersecting) {
                    return false
                }

                var currentTweet = element.target

                if (!currentTweet.dataset['tweet_id']) {
                    return false
                }

                var ctp = currentTweet.parentNode
                if (ctp.classList.length === 0 || !ctp.classList.contains('format_timeline')) {
                    return false
                }

                // Whether load tweets object?
                if (history.state && history.state['twitter_target_tweet_id']) {
                    if (document.querySelector('.twitter_new_tweets_of_no_content')) {
                        loadTheOthersTweet()
                        window.dispatchEvent(new Event('aquaprojects_popstate'))
                    }
                }

                const teth = history.state['twitter_each_tweets_height']
                if (teth === undefined || teth.length === 0) scanTweetHeight()
                var replaceState = Object.assign({}, history.state)
                replaceState['scrollTop'] = window.scrollY
                replaceState['twitter_target_tweet_id'] = currentTweet.dataset['tweet_id']
                if (ftftid !== replaceState['twitter_each_tweets_height'][0]['tweet_id']) {
                    replaceState['twitter_each_tweets_height'] = scanTweetHeight()
                    replaceState['format_timeline_height'] = formatTimeline.scrollHeight
                }
                history.replaceState(replaceState, null, currentPage)
            });
        }
    }

    function loadTheOthersTweet() {
        var currentLocation = location.pathname
        var dataNode = AquaProjectsCache[currentLocation].cloneNode(true)
        var tweets = dataNode.querySelectorAll('.tweet')
        var correctTweets = []
        var newTweets = []
        var oldTweets = []
        var displayedNewTweet = null
        var displayedOldTweet = null

        var displayedTweets = document.querySelectorAll('.tweet')
        var correctDisplayedTweets = []

        for (let index = 0; index < displayedTweets.length; index++) {
            const element = displayedTweets[index];
            if (element.parentNode.classList.contains('quoted_status')) {
                continue
            }
            correctDisplayedTweets.push(element)
        }

        for (let index = 0; index < tweets.length; index++) {
            const element = tweets[index];
            if (element.parentNode.classList.contains('quoted_status')) {
                continue
            }
            correctTweets.push(element.cloneNode(true))
        }

        for (let index = 0; index < correctDisplayedTweets.length; index++) {
            const element = correctDisplayedTweets[index];
            if (!element.dataset['tweet_id']) {
                continue
            }
            if (!displayedNewTweet) {
                displayedNewTweet = correctDisplayedTweets[index]
            }
            displayedOldTweet = correctDisplayedTweets[correctDisplayedTweets.length - 1]
        }

        // Load new tweets from data into the memory.
        for (let index = 0; index < correctTweets.length; index++) {
            const element = correctTweets[index];
            if (!element.dataset['tweet_id']) {
                continue
            }
            if (element.dataset['tweet_id'] === displayedNewTweet.dataset['tweet_id']) {
                break
            }
            newTweets.push(element)
        }

        // Load old tweets from data into the memory.
        (() => {
            var isPassedTweet = false
            for (let index = 0; index < correctTweets.length; index++) {
                const element = correctTweets[index];
                if (!element.dataset['tweet_id']) {
                    continue
                }
                if (isPassedTweet) {
                    oldTweets.push(element)
                }
                if (element.dataset['tweet_id'] === displayedOldTweet.dataset['tweet_id']) {
                    isPassedTweet = true
                }
            }
        })()

        var formatTimeline = document.querySelector('.format_timeline')

        // Create new tweets document fragement
        var formatTimelineNewTweets = document.createDocumentFragment()
        for (let index = 0; index < newTweets.length; index++) {
            const element = newTweets[index];
            formatTimelineNewTweets.appendChild(element)
        }

        // Create old tweets document fragement
        var formatTimelineOldTweets = document.createDocumentFragment()
        for (let index = 0; index < oldTweets.length; index++) {
            const element = oldTweets[index];
            formatTimelineOldTweets.appendChild(element)
        }

        var tweetLoadMoreOldTweet = `
        <div class="tweet-load_more_old_tweet" style="border-bottom: solid 1px #e6ecf0; cursor: pointer; height: 49px; display: flex; flex-direction: column; justify-content: center;">
                <div class="tweet-load_more_old_tweet_loader" style="text-align: center; display: none;">
                    <div class="loader" style="font-size: 2px; margin: 0 auto"></div>
                </div>
                <div class="tweet-load_more_old_tweet_message" style="text-align: center;"><i class="fab fa-twitter"></i></div>
                <div class="tweet-load_more_old_tweet_message" style="text-align: center;">Load more old tweet</div>
            </div>
        `

        formatTimeline.style.height = ''
        formatTimeline.querySelector('.twitter_new_tweets_of_no_content').remove()
        formatTimeline.querySelector('.twitter_old_tweets_of_no_content').remove()
        formatTimeline.insertBefore(formatTimelineNewTweets, formatTimeline.firstChild)
        formatTimeline.appendChild(formatTimelineOldTweets)
        formatTimeline.insertAdjacentHTML('beforeend', tweetLoadMoreOldTweet)
    }

    function scanTweetHeight() {
        const tweets = document.querySelectorAll('.tweet')
        const formatTimeline = document.querySelector('.format_timeline')
        const currentPage = location.href.replace(location.origin, '')
        var twitter_each_tweets_height = []
        for (let index = 0; index < tweets.length; index++) {
            const element = tweets[index];
            if (!element.parentNode.classList.contains('format_timeline')) continue
            twitter_each_tweets_height.push({
                'tweet_id': element.dataset['tweet_id'],
                'tweet_height': element.offsetHeight,
            })
        }
        (() => {
            var replaceState = Object.assign({}, history.state)
            replaceState['twitter_each_tweets_height'] = twitter_each_tweets_height
            replaceState['format_timeline_height'] = formatTimeline.scrollHeight
            history.replaceState(replaceState, null, currentPage)
        })()
        console.log(twitter_each_tweets_height)
        return twitter_each_tweets_height
    }

    var tweetTwitterPictureClick = null

    // tweet-twitter_in_reply_to_status
    document.addEventListener('click', e => {
        if (findParents(e.target, 'tweet-twitter_in_reply_to_status')) {
            const ajaxProgressBar = document.querySelector('#ajax-progress-bar')
            if (findParents(e.target, 'tweet-twitter_in_reply_to_status')) tweetTwitterPictureClick = true
            const inReplyToStatus = findParents(e.target, 'tweet-twitter_in_reply_to_status')
            const inReplyToStatusId = inReplyToStatus.dataset['in_reply_to_status_id']
            const inReplyToScreenName = inReplyToStatus.dataset['in_reply_to_screen_name']
            const href = `/twitter/${inReplyToScreenName}/status/${inReplyToStatusId}`

            if (AquaProjectsCache[href]) {
                const cacheCloneNode = AquaProjectsCache[href].cloneNode(true)
                const insertInReplyToStatus = cacheCloneNode.querySelector('.format_timeline').firstElementChild
                insertInReplyToStatus.style.padding = '0 0 12px'
                insertInReplyToStatus.style.border = '0'
                insertInReplyToStatus.style.flexBasis = '100%'
                inReplyToStatus.insertAdjacentElement('afterend', insertInReplyToStatus)
                inReplyToStatus.remove()

                window.dispatchEvent(new Event('aquaprojects_popstate'));

                ajaxProgressBar.style.width = '100%'
                ajaxProgressBar.style.transition = 'width 0.1s ease 0s'

                setTimeout(() => {
                    ajaxProgressBar.style.visibility = 'hidden'
                    ajaxProgressBar.style.width = '0%'
                    ajaxProgressBar.style.transition = ''
                }, 200)
                return false
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
                AquaProjectsCache[href] = document.createRange().createContextualFragment(data)
                const cacheCloneNode = AquaProjectsCache[href].cloneNode(true)
                const insertInReplyToStatus = cacheCloneNode.querySelector('.format_timeline').firstElementChild
                insertInReplyToStatus.style.padding = '0 0 12px'
                insertInReplyToStatus.style.border = '0'
                insertInReplyToStatus.style.flexBasis = '100%'
                inReplyToStatus.insertAdjacentElement('afterend', insertInReplyToStatus)
                inReplyToStatus.remove()

                window.dispatchEvent(new Event('aquaprojects_popstate'));

                ajaxProgressBar.style.width = '100%'
                ajaxProgressBar.style.transition = 'width 0.1s ease 0s'

                setTimeout(() => {
                    ajaxProgressBar.style.visibility = 'hidden'
                    ajaxProgressBar.style.width = '0%'
                    ajaxProgressBar.style.transition = ''
                }, 200)
                return false
            }).catch(err => {
                console.error(err)
                showError()
            })
        }
    })

    // tweet-twitter_user_tooltip
    document.addEventListener('click', e => {
        if (findParents(e.target, 'tweet-twitter_user_tooltip')) {
            tweetTwitterPictureClick = true
            if (findParents(e.target, 'twitter_anchor')) {
                tweetTwitterPictureClick = false
            }
        }
    })

    // tweet-twitter_favorite, tweet-twitter_retweet
    document.addEventListener('click', e => {
        if (findParents(e.target, 'tweet-twitter_social')) {
            tweetTwitterPictureClick = true
        }
    })

    // tweet-twitter_full_text_hashtags
    document.addEventListener('click', e => {
        if (findParents(e.target, 'tweet-twitter_full_text_hashtags')) {
            tweetTwitterPictureClick = true
        }
    })

    // tweet-twitter_picture
    document.addEventListener('click', e => {
        function searchNearNode(target, className) {
            var searchParentNode = target.parentNode
            if (searchParentNode === null) {
                return false
            }
            var nearNodeList = searchParentNode.children
            for (let index = 0; index < Array.from(nearNodeList).length; index++) {
                const element = Array.from(nearNodeList)[index];
                for (let index = 0; index < className.length; index++) {
                    const cn = className[index];
                    if (element.classList.length !== 0 && element.classList.contains(cn)) {
                        return element
                    }
                }
            }
        }

        var ecl = [
            'tweet-twitter_video-play_icon',
            'tweet-twitter_video-duration',
        ]

        if (findParents(e.target, 'tweet-twitter_picture') || searchNearNode(e.target, ecl)) {
            tweetTwitterPictureClick = true

            if (e.target.classList.contains('tweet-twitter_video')) {
                return false
            }

            var tweetTwitterPictureImg = findParents(e.target, 'tweet-twitter_picture')
            if (!tweetTwitterPictureImg) {
                tweetTwitterPictureImg = searchNearNode(e.target, ['tweet-twitter_picture'])
            }

            if (tweetTwitterPictureImg.src !== tweetTwitterPictureImg.dataset['src']) {
                tweetTwitterPictureImg.src = tweetTwitterPictureImg.dataset.src
                return false
            }

            var tweetTwitterPictures = findParents(e.target, 'tweet-twitter_pictures')
            if (tweetTwitterPictures.querySelector('video')) {
                var tweetTwitterPicturesVideo = tweetTwitterPictures.querySelector('video')
                Array.from(tweetTwitterPicturesVideo.parentNode.children).forEach(element => {
                    element.style.display = 'none'
                })

                var tweetTwitterPicturesVideoClone = tweetTwitterPicturesVideo.cloneNode(true)
                tweetTwitterPicturesVideoClone.style.display = ''
                videoCloneSource = tweetTwitterPicturesVideoClone.querySelector('source')
                videoCloneSource.src = videoCloneSource.dataset.src
                tweetTwitterPicturesVideo.insertAdjacentElement('afterend', tweetTwitterPicturesVideoClone)

                tweetTwitterPicturesVideo.remove()

                return false
            }

            var tweetTwitterPictureElements = tweetTwitterPictures.querySelectorAll('.tweet-twitter_picture')
            var currentImgSrc = findParents(e.target, 'tweet-twitter_picture').dataset['src']
            var currentImgNumber = 0
            var ImgTable = []

            for (let index = 0; index < tweetTwitterPictureElements.length; index++) {
                ImgTable.push(tweetTwitterPictureElements[index].dataset['src'])
                if (currentImgSrc === tweetTwitterPictureElements[index].dataset['src']) {
                    currentImgNumber = index
                }
            }

            var ttpzc = document.querySelector('.tweet-twitter_picture_zoom-container')
            while (ttpzc.lastChild) {
                ttpzc.removeChild(ttpzc.lastChild)
            }

            for (let index = 0; index < ImgTable.length; index++) {
                var insertImg = `
                <div class="tweet-twitter_picture_zoom-element">
                <img class="tweet-twitter_picture_zoom-element_img" src="${ImgTable[index]}">
                </div>
                `
                ttpzc.insertAdjacentHTML('beforeend', insertImg)
            }

            var ttpz = document.querySelector('.tweet-twitter_picture_zoom')

            if (ttpz.style.display === 'none') {
                ttpz.style.display = 'flex'
            }

            var ttpzn = document.querySelectorAll('.tweet-twitter_picture_zoom-navigator')
            ttpz.style.background = ''
            for (let index = 0; index < ttpzn.length; index++) {
                const element = ttpzn[index];
                element.style.background = ''
            }

            jumpToSlide(currentImgNumber, 0)
            tweetTwitterPictureZoomOpen(currentImgNumber)
        }
    })

    // tweet-twitter_picture_zoom-container
    document.addEventListener('touchstart', e => {
        if (findParents(e.target, 'tweet-twitter_picture_zoom-container')) {
            const target = findParents(e.target, 'tweet-twitter_picture_zoom-container')
            boxContainerTouchStart(e, target)
        }
    })

    // tweet-twitter_picture_zoom-container
    document.addEventListener('touchmove', e => {
        if (findParents(e.target, 'tweet-twitter_picture_zoom-container')) {
            const target = findParents(e.target, 'tweet-twitter_picture_zoom-container')
            boxContainerTouchMove(e, target)
        }
    })

    // tweet-twitter_picture_zoom-container
    document.addEventListener('touchend', e => {
        if (findParents(e.target, 'tweet-twitter_picture_zoom-container')) {
            const target = findParents(e.target, 'tweet-twitter_picture_zoom-container')
            boxContainerTouchEnd(e, target)
        }
    })

    // tweet-twitter_picture_zoom-container
    // document.addEventListener('mousedown', e => {
    //     if (findParents(e.target, 'tweet-twitter_picture_zoom-container')) {
    //         boxContainerMouseDown(e)
    //     }
    // })

    // tweet-twitter_picture_zoom-container
    // document.addEventListener('mousemove', e => {
    //     if (findParents(e.target, 'tweet-twitter_picture_zoom-container')) {
    //         const target = findParents(e.target, 'tweet-twitter_picture_zoom-container')
    //         boxContainerMouseMove(e, target)
    //     }
    // })

    // tweet-twitter_picture_zoom-container
    // document.addEventListener('mouseup', e => {
    //     if (findParents(e.target, 'tweet-twitter_picture_zoom-container')) {
    //         const target = findParents(e.target, 'tweet-twitter_picture_zoom-container')
    //         boxContainerMouseUp(e, target)
    //     }
    // })

    // tweet-twitter_picture_zoom-container
    // document.addEventListener('mouseleave', e => {
    //     if (findParents(e.target, 'tweet-twitter_picture_zoom-container')) {
    //         const target = findParents(e.target, 'tweet-twitter_picture_zoom-container')
    //         boxContainerMouseLeave(e, target)
    //     }
    // })

    // tweet-twitter_picture_zoom-prev
    document.addEventListener('click', e => {
        if (findParents(e.target, 'tweet-twitter_picture_zoom-prev')) {
            prevSlideBtn()
        }
    })

    // tweet-twitter_picture_zoom-next
    document.addEventListener('click', e => {
        if (findParents(e.target, 'tweet-twitter_picture_zoom-next')) {
            nextSlideBtn()
        }
    })

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

    function boxContainerTouchStart(e, target) {
        touchingPositionPageX = e.changedTouches[0].pageX
        touchStartScrollLeft = target.scrollLeft
    }

    function boxContainerTouchMove(e, target) {
        target.scrollLeft = touchStartScrollLeft + touchingPositionPageX - e.changedTouches[0].pageX
    }

    function boxContainerTouchEnd(e, target) {
        const allTargetNode = document.querySelectorAll(`.${e.target.className}`)
        const targetIndex = Array.from(allTargetNode).findIndex(item => item === e.target)

        if (touchingPositionPageX - e.changedTouches[0].pageX > target.offsetWidth / 4) {
            scrollContentLeft(
                target,
                (targetIndex + 1) * e.target.offsetWidth - target.scrollLeft,
                200
            )
            currentSlideNumberProxy.number += 1
        } else if (touchingPositionPageX - e.changedTouches[0].pageX < -(target.offsetWidth / 4)) {
            scrollContentLeft(
                target,
                (targetIndex - 1) * e.target.offsetWidth - target.scrollLeft,
                200
            )
            currentSlideNumberProxy.number -= 1
        } else {
            scrollContentLeft(
                target,
                targetIndex * e.target.offsetWidth - target.scrollLeft,
                200
            )
        }
        touchingPositionPageX = 0
        touchStartScrollLeft = 0
        AverageColorByImageOnTweetTwitterPictureZoom()
    }

    var clickingNow = false
    var clickingPositionOffsetX = 0
    var clickingPositionPageX = 0

    function boxContainerMouseDown(e) {
        clickingNow = true
        clickingPositionOffsetX = e.offsetX
        clickingPositionPageX = e.pageX
    }

    function boxContainerMouseMove(e, target) {
        if (clickingNow) {
            target.scrollLeft = target.scrollLeft + clickingPositionOffsetX - e.offsetX
        }
    }

    function boxContainerMouseUp(e, target) {
        const allTargetNode = document.querySelectorAll(`.${e.target.className}`)
        const targetIndex = Array.from(allTargetNode).findIndex(item => item === e.target)

        if (clickingPositionPageX - e.pageX > target.offsetWidth / 4) {
            scrollContentLeft(
                target,
                (targetIndex + 1) * e.target.offsetWidth - target.scrollLeft,
                200
            )
            currentSlideNumberProxy.number += 1
        } else if (clickingPositionPageX - e.pageX < -(target.offsetWidth / 4)) {
            scrollContentLeft(
                target,
                (targetIndex - 1) * e.target.offsetWidth - target.scrollLeft,
                200
            )
            currentSlideNumberProxy.number -= 1
        } else {
            scrollContentLeft(
                target,
                targetIndex * e.target.offsetWidth - target.scrollLeft,
                200
            )
        }
        clickingNow = false
    }

    function boxContainerMouseLeave(e, target) {
        if (!clickingNow) return false

        const allTargetNode = document.querySelectorAll(`.${e.target.className}`)
        const targetIndex = Array.from(allTargetNode).findIndex(item => item === e.target)

        if (clickingPositionPageX - e.pageX > target.offsetWidth / 4) {
            scrollContentLeft(
                target,
                (targetIndex + 1) * e.target.offsetWidth - target.scrollLeft,
                200
            )
            currentSlideNumberProxy.number += 1
        } else if (clickingPositionPageX - e.pageX < -(target.offsetWidth / 4)) {
            scrollContentLeft(
                target,
                (targetIndex - 1) * e.target.offsetWidth - target.scrollLeft,
                200
            )
            currentSlideNumberProxy.number -= 1
        } else {
            scrollContentLeft(
                target,
                targetIndex * e.target.offsetWidth - target.scrollLeft,
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
        AverageColorByImageOnTweetTwitterPictureZoom()
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
        AverageColorByImageOnTweetTwitterPictureZoom()
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
        AverageColorByImageOnTweetTwitterPictureZoom()
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
        startFadeInUP(document.querySelectorAll('.tweet-twitter_picture_zoom-element')[currentImgNumber])
    }

    function tweetTwitterPictureZoomClose() {
        const ttpze = document.querySelectorAll('.tweet-twitter_picture_zoom-element')
        for (let index = 0; index < ttpze.length; index++) {
            const element = ttpze[index];
            startFadeOutUP(element)
        }
    }

    document.addEventListener('animationend', e => {
        if (findParents(e.target, 'tweet-twitter_picture_zoom-element')) {
            if (e.animationName === 'fadeOutUp') {
                var tweet_twitter_picture_zoom = document.querySelector('.tweet-twitter_picture_zoom')
                if (tweet_twitter_picture_zoom.style.display === 'flex') {
                    tweet_twitter_picture_zoom.style.display = 'none'
                }
            }
        }
    })

    document.addEventListener('click', e => {
        if (findParents(e.target, 'tweet-twitter_picture_zoom-close')) {
            tweetTwitterPictureZoomClose()
        }
        if (findParents(e.target, 'tweet-twitter_picture_zoom-element_img')) {
            tweetTwitterPictureZoomClose()
        }
    })

    function tweetTwitterPictureCloseDisplayController() {
        var tweetTwitterPictureZoomElementLength = document.getElementsByClassName('tweet-twitter_picture_zoom-element').length

        if (currentSlideNumberProxy.number === 0) {
            const tweetTwitterPictureZoomPrev = document.querySelector('.tweet-twitter_picture_zoom-prev')
            tweetTwitterPictureZoomPrev.style.display = 'none'
        } else {
            const tweetTwitterPictureZoomPrev = document.querySelector('.tweet-twitter_picture_zoom-prev')
            tweetTwitterPictureZoomPrev.style.display = ''
        }

        if (currentSlideNumberProxy.number === tweetTwitterPictureZoomElementLength - 1) {
            const tweetTwitterPictureZoomPrev = document.querySelector('.tweet-twitter_picture_zoom-next')
            tweetTwitterPictureZoomPrev.style.display = 'none'

        } else {
            const tweetTwitterPictureZoomPrev = document.querySelector('.tweet-twitter_picture_zoom-next')
            tweetTwitterPictureZoomPrev.style.display = ''
        }
    }

    document.addEventListener('keydown', e => {
        if (`/${location.pathname.replace(location.origin, '').split('/')[1]}` === '/twitter') {
            if (document.querySelector('.tweet-twitter_picture_zoom').style.display !== 'none') {
                var keycode = e.keyCode
                if (keycode === 37) {
                    prevSlideBtn()
                } else if (keycode === 39) {
                    nextSlideBtn()
                }
            }
        }
    })

    function startFadeInUP(component) {
        if (component.classList && component.classList.contains('fadeInUp')) {
            component.classList.remove('fadeOutUp')
        }
        component.classList.add('animated', 'fadeInUp')
    }

    function startFadeOutUP(component) {
        if (component.classList && component.classList.contains('fadeOutUp')) {
            component.classList.remove('fadeOutUp')
        }
        component.classList.add('animated', 'fadeOutUp')
    }

    function AverageColorByImageOnTweetTwitterPictureZoom() {
        var ttpz = document.querySelector('.tweet-twitter_picture_zoom')
        var ttpzn = document.querySelectorAll('.tweet-twitter_picture_zoom-navigator')

        var ttpzc = ttpz.querySelector('.tweet-twitter_picture_zoom-container')
        var ttpzce = ttpzc.querySelectorAll('.tweet-twitter_picture_zoom-element img')

        var ImgTable = []
        for (let index = 0; index < ttpzce.length; index++) {
            const element = ttpzce[index];
            ImgTable.push(element.src)
        }

        averageColorByImage(ImgTable[currentSlideNumberProxy.number]).then(res => {
            var rgb_color = `rgb(${res[0]}, ${res[1]}, ${res[2]}`
            ttpz.style.background = `${rgb_color}, 0.9)`
            for (let index = 0; index < ttpzn.length; index++) {
                const element = ttpzn[index];
                element.style.background = `${rgb_color})`
            }
        })

        setTimeout(() => {
            if (ttpz.style.display !== 'none' && ttpz.style.background === '') {
                ttpz.style.background = 'white'
                for (let index = 0; index < ttpzn.length; index++) {
                    const element = ttpzn[index];
                    element.style.background = 'black'
                }
            }
        }, 1000);
    }

    var twittterCreateListName = ''
    var twitterCreateListDescription = ''
    var twitterCreateListMode = ''
    var selectExistOwnListResutId = ''
    var is_send_ok = false

    document.addEventListener('click', e => {
        if (findParents(e.target, '.select_exist_own_list-list')) {
            const target = findParents(e.target, '.select_exist_own_list-list')
            const checkStatus = target.dataset['check_status']
            if (checkStatus === 'none') {
                target.dataset['check_status'] = 'checked'
                selectExistOwnListResutId =
                    target.querySelector('.select_exist_own_list-list_name_id_mode')
                    .querySelector('.select_exist_own_list-list_name_id_mode-id').innerHTML

                if (target.classList && target.classList.contains('checked_css_opacity')) {
                    target.classList.remove('checked_css_opacity')
                }
                target.classList.add('check_css_opacity')
            }
            if (checkStatus === 'checked') {
                target.dataset['check_status'] = 'none'
                selectExistOwnListResutId = ''
                if (target.classList && target.classList.contains('checked_css_opacity')) {
                    target.classList.remove('checked_css_opacity')
                }
                target.classList.add('check_css_opacity')
            }
        }
    })

    document.addEventListener('click', e => {
        if (findParents(e.target, '.startTwitter')) {
            CheckTwitterWelcomeResult()
        }
    })

    function CheckTwitterWelcomeResult() {
        twittterCreateListName = document.querySelector('.twitter_create_list-name').value
        twitterCreateListDescription = document.querySelector('.twitter_create_list-description').value
        twitterCreateListMode = document.querySelector('.twitter_create_list-mode').querySelector('input').checked
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
        document.querySelector('.startingTwitter').style.display = ''
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
            const fontSize = document.querySelectorAll('.font-size')
            for (let index = 0; index < fontSize.length; index++) {
                const element = fontSize[index];
                element.style.fontSize = fontSize
            }
            const smallFontSize = document.querySelectorAll('.small-font-size')
            for (let index = 0; index < smallFontSize.length; index++) {
                const element = smallFontSize[index];
                element.style.fontSize = small_font_size
            }
            const largeFontSize = document.querySelectorAll('.large-font-size')
            for (let index = 0; index < largeFontSize.length; index++) {
                const element = largeFontSize[index];
                element.style.fontSize = large_font_size
            }

            localStorage.setItem('twitter-image_size', twitter_image_size)
            localStorage.setItem('twitter-icon_image_size', twitter_icon_image_size)
        } else {
            localStorage.setItem('font-size', '50')
            localStorage.setItem('twitter-image_size', '285')
            localStorage.setItem('twitter-icon_image_size', '40')
        }
    }

    // twitter_anchor
    document.addEventListener('click', e => {
        if (findParents(e.target, 'twitter_anchor')) {
            if (tweetTwitterPictureClick) {
                tweetTwitterPictureClick = false
                return false;
            }
            var twitterAnchorContent = findParents(e.target, 'twitter_anchor')

            if (window.getSelection().toString() !== '') return false;
            scrollPageTop()
            var targetPage = twitterAnchorContent.getAttribute('href')
            targetPage = targetPage.replace(location.origin, '')
            var currentPage = location.href;
            currentPage = currentPage.replace(location.origin, '')
            var state = {
                'targetPage': targetPage,
                'currentPage': currentPage,
                'changeLocation': '#main'
            };
            var replaceState = Object.assign({}, history.state)
            replaceState['scrollTop'] = window.scrollY
            var targetTweetId = 0
            if (twitterAnchorContent.parentNode.classList.contains('quoted_status')) {
                var targetTweet = findParents(twitterAnchorContent.parentNode, 'twitter_anchor')
                targetTweetId = targetTweet.dataset['tweet_id']
            } else targetTweetId = twitterAnchorContent.dataset['tweet_id']
            replaceState['twitter_target_tweet_id'] = targetTweetId
            replaceState['twitter_each_tweets_height'] = scanTweetHeight()
            replaceState['format_timeline_height'] = document.querySelector('.format_timeline').scrollHeight
            history.replaceState(replaceState, null, currentPage)
            history.pushState(state, null, targetPage);

            var twitterUserScreenName = twitterAnchorContent.dataset['twitter_userScreen_name']
            var tweetId = twitterAnchorContent.dataset['tweet_id']
            if (twitterUserScreenName !== undefined) changeContent(targetPage, 'twitter_user', twitterUserScreenName);
            else if (tweetId !== undefined) changeContent(targetPage, 'tweet', tweetId)
            else changeContent(targetPage);
            e.preventDefault()
        }
    })

    function changeContent(href, anchorMode, anchorContext) {
        document.title = 'Aqua Projects - ' + location.pathname.substring(1)
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')
        if (anchorMode === 'twitter_user') changeContentTwitterUser(anchorContext)
        else if (anchorMode === 'tweet') changeContentTweet(anchorContext)
        else {
            const changeContentArea = document.querySelector('#main')
            changeContentArea.innerHTML = '<div class="loader" style="font-size: 2px; margin: 8px auto auto;"></div>'
            const removeClass = 'bg-danger'
            if (ajaxProgressBar.classList && ajaxProgressBar.classList.contains(removeClass)) {
                ajaxProgressBar.classList.remove(removeClass)
            }
            ajaxProgressBar.style.visibility = 'visible'
            ajaxProgressBar.style.width = '80%'
        }
        // Cache exsists.
        if (AquaProjectsCache[href]) {
            var mainArea = document.querySelector('#main')
            while (mainArea.firstChild) mainArea.removeChild(mainArea.firstChild)
            while (AquaProjectsCache[href].querySelector('#main').firstChild) {
                mainArea.appendChild(
                    AquaProjectsCache[href].querySelector('#main').firstChild
                )
            }

            ajaxProgressBar.style.width = '100%'

            window.dispatchEvent(new Event('aquaprojects_popstate'));
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
            AquaProjectsCache[href] = document.createRange().createContextualFragment(data)
            if (href != location.href.replace(location.origin, '')) {
                console.log('It seems that you moved to a different page first.')
                return false
            }
            var changeLocation = document.querySelector('#main')
            while (changeLocation.firstChild) changeLocation.removeChild(changeLocation.firstChild)
            var changeLocationCloneNode = AquaProjectsCache[href].cloneNode(true).querySelector('#main')
            Array.from(changeLocationCloneNode.children).forEach(element => {
                changeLocation.appendChild(element)
            });

            window.dispatchEvent(new Event('aquaprojects_popstate'));

            ajaxProgressBar.style.width = '100%'
            ajaxProgressBar.style.transition = 'width 0.1s ease 0s'

            setTimeout(() => {
                ajaxProgressBar.style.visibility = 'hidden'
                ajaxProgressBar.style.width = '0%'
                ajaxProgressBar.style.transition = ''
            }, 200)
        }).catch(err => {
            console.error(err)
            showError()
        })

        function changeContentTwitterUser(screen_name) {
            var twitterTitle = document.querySelector('.twitter_title-block').outerHTML
            // The following will be changed:
            // twitter_user -> Add id as twitter_user
            // .twitter_user-background_image -> Expand image.
            // .twitter_user-profile_image -> Add .tweet-twitter_icon, twitter_anchor, image property.
            // .twitter_user-name_screen_name -> Add twitter_anchor
            // .twitter_user-location -> css:display
            // .twitter_user-main -> css:padding
            // .twitter_user-profile_timelines_navigation-block -> css: display: ''
            // .twitter_user-profile_timelines_navigation-tweets -> Add .twitter_user-profile_timelines_navigation-selected
            // .timeline -> Add loading html
            // .twitter_user -> call setTweetCreated_at
            const twitterUser = document.querySelectorAll('.twitter_user')
            for (let index = 0; index < twitterUser.length; index++) {
                const element = twitterUser[index];
                if (element.dataset['twitter_userScreen_name'] === screen_name) {
                    const timeline = document.querySelector('.timeline')
                    timeline.innerHTML = element.outerHTML

                    var twitterUserContent = document.querySelector('.timeline .twitter_user')
                    twitterUserContent.id = 'twitter_user'

                    document.querySelector('.timeline').insertAdjacentHTML('afterbegin', twitterTitle)
                    var twitterUserName = document.querySelector('.timeline .twitter_user-name > span').innerHTML
                    document.querySelector('.twitter_title-home-text').innerHTML = twitterUserName

                    const tubgimg = timeline.querySelector('.twitter_user-background_image')
                    const tubgimgcode = `<img src="${tubgimg.dataset['imgSrc']}" loading="lazy">`
                    tubgimg.insertAdjacentHTML('beforeend', tubgimgcode)

                    tupimg = timeline.querySelector('.twitter_user-profile_image')
                    tupimg.style.height = '50px'
                    tupimg.classList.add('twitter_user-twitter_icon')
                    tupimg.insertBefore(tupimg.querySelector('img'), tupimg.firstChild)
                    tupimg.querySelector('a').remove()
                    tupimg.querySelector('img').style.width = '100px'
                    tupimg.querySelector('img').style.height = '100px'
                    tupimg.querySelector('img').style.top = '-50px'
                    tupimg.querySelector('img').style.marginLeft = '10px'

                    const tunsn = timeline.querySelector('.twitter_user-name_screen_name')
                    const tunsna = tunsn.querySelector('a')
                    tunsn.insertBefore(tunsn.querySelector('.twitter_user-name'), tunsna)
                    tunsn.insertBefore(tunsn.querySelector('.twitter_user-screen_name'), tunsna)
                    tunsna.remove()

                    const tul = timeline.querySelector('.twitter_user-local')
                    tul.style.display = 'flex'
                    tul.style.flexWrap = 'wrap'

                    timeline.querySelector('.twitter_user-main').style.padding = '0 10px'

                    var timelineArea = document.querySelector('.timeline')
                    timelineArea.querySelector('.twitter_user-profile_timelines_navigation-block').style.display = ''

                    twitterUserProfileTimelineNavigationSelected(
                        document.querySelector('.twitter_user-profile_timeline_navigation-tweets')
                    )

                    timelineArea.insertAdjacentHTML(
                        'beforeend', '<div class="loader" style="font-size: 2px; margin: 8px auto auto;"></div>'
                    )

                    setTweetCreated_at()
                    makeTwitterUserTwitterIconClear()
                    return false
                }
            }
        }

        function changeContentTweet(tweet_id) {

            var twitterTitle = document.querySelector('.twitter_title-block').outerHTML

            const tweet = document.querySelectorAll('.tweet')
            for (let index = 0; index < tweet.length; index++) {
                const element = tweet[index];
                if (parseInt(element.dataset['tweet_id']) === parseInt(tweet_id)) {
                    const timeline = document.querySelector('.timeline')
                    timeline.innerHTML = element.outerHTML
                    document.querySelector('.timeline').insertAdjacentHTML('afterbegin', twitterTitle)
                    document.querySelector('.twitter_title-home-text').innerHTML = 'Tweets'

                    var timelineArea = document.querySelector('.timeline')
                    timelineArea.insertAdjacentHTML(
                        'beforeend', '<div class="loader" style="font-size: 2px; margin: 8px auto auto;"></div>'
                    )
                    return false
                }
            }
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

    // $(document).on('click', '.tweet-load_more_new_tweet', function () {
    //     var tweet_id = $('.format_timeline > div:first').data('tweet_id');
    //     loadMoreTweet(tweet_id, 'new');
    // })
    // $(document).on('click', '.tweet-load_more_old_tweet', function () {
    //     var tweet_id = $('.format_timeline > div:last').prev().data('tweet_id');
    //     loadMoreTweet(tweet_id, 'old');
    // })

    // load_type = new, old
    // function loadMoreTweet(tweet_id, load_type) {
    //     const ajaxProgressBar = document.querySelector('#ajax-progress-bar')
    //     var href = '';
    //     if (load_type === 'new') {
    //         href = '/twitter?since_id=' + tweet_id;
    //     } else if (load_type === 'old') {
    //         href = '/twitter?max_id=' + tweet_id;
    //     } else {
    //         console.error('load_type is not specific.');
    //         return false;
    //     }
    //     loadMoreTweetLoader(load_type, true)
    //     if ($('#twitter_user').length > 0) {
    //         var screen_name = $('#twitter_user').find('.twitter_user-screen_name').text().replace('@', '')
    //         href = href.replace('/twitter', '/twitter/' + screen_name)
    //     }
    //     $('#ajax-progress-bar').removeClass('bg-danger');
    //     $('#ajax-progress-bar').css({
    //         'visibility': 'visible'
    //     });
    //     $('#ajax-progress-bar').css({
    //         'width': '80%'
    //     });
    //     alreadyBottom = true;

    //     fetch(
    //         href, {
    //             method: 'GET',
    //             mode: 'cors',
    //             credentials: 'include',
    //         }
    //     ).then(response => {
    //         if (response.ok) {
    //             return response.text()
    //         } else {
    //             console.error(data)
    //             showError()
    //         }
    //     }).then(data => {
    //         var current_scrollHeight = 0
    //         if (load_type === 'new') {
    //             current_scrollHeight = document.body.scrollHeight
    //             $('.format_timeline > div:first').before($(data).find('.format_timeline').html())
    //         } else if (load_type === 'old') {
    //             $('.format_timeline > div:last').prev().after($(data).find('.format_timeline').html())
    //         }
    //         loadMoreTweetLoader(load_type, false)

    //         setTweetCreated_at()

    //         alreadyBottom = false;

    //         changeFontSize()

    //         if (load_type === 'new') {
    //             var diff = document.body.scrollHeight - current_scrollHeight
    //             window.scrollTo(window.scrollX, window.scrollY + diff)
    //         }

    //         AquaProjectsCache[location.href.replace(location.origin, '')] = document

    //         ajaxProgressBar.style.width = '100%'
    //         ajaxProgressBar.style.transition = 'width 0.1s ease 0s'

    //         setTimeout(() => {
    //             ajaxProgressBar.style.visibility = 'hidden'
    //             ajaxProgressBar.style.width = '0%'
    //             ajaxProgressBar.style.transition = ''
    //         }, 200)

    //     }).catch(err => {
    //         console.error(err)
    //         showError()
    //     })

    //     function loadMoreTweetLoader(load_type, showFlag) {
    //         if (load_type === 'new' || load_type === 'old') {
    //             if (showFlag == true) {
    //                 $('.tweet-load_more_' + load_type + '_tweet').find('.tweet-load_more_' + load_type + '_tweet_message').each(function (index, element) {
    //                     $(element).css({
    //                         'display': 'none'
    //                     })
    //                 })
    //                 $('.tweet-load_more_' + load_type + '_tweet_loader').css({
    //                     'display': 'block'
    //                 })
    //             } else if (showFlag == false) {
    //                 $('.tweet-load_more_' + load_type + '_tweet').find('.tweet-load_more_' + load_type + '_tweet_message').each(function (index, element) {
    //                     $(element).css({
    //                         'display': 'block'
    //                     })
    //                 })
    //                 $('.tweet-load_more_' + load_type + '_tweet_loader').css({
    //                     'display': 'none'
    //                 })
    //             }
    //         }
    //     }
    // }

    function changeTwitterTimelineBackgroundSize() {
        var windowWidth = window.innerWidth
        var timelineBackground = document.querySelectorAll('.timeline_background')
        var mainClassList = document.querySelector('#main').classList
        mainClassList = Object.entries(mainClassList).flat()
        if (windowWidth >= 992) {
            var lg = mainClassList.filter(i => i.indexOf('lg') >= 0)
            var lgNumber = lg[0].split('-')[lg[0].split('-').length - 1]
            timelineBackground[0].style.width = `${windowWidth * lgNumber / 12}px`
        } else if (windowWidth >= 768) {
            var md = mainClassList.filter(i => i.indexOf('md') >= 0)
            var mdNumber = md[0].split('-')[md[0].split('-').length - 1]
            timelineBackground[1].style.width = `${windowWidth * mdNumber / 12}px`
        } else {
            var sm = mainClassList.filter(i => i.indexOf('sm') >= 0)
            var smNumber = sm[0].split('-')[sm[0].split('-').length - 1]
            timelineBackground[2].style.width = `${windowWidth * smNumber / 12}px`
        }
    }

    window.addEventListener('resize', () => {
        if ('/' + location.pathname.replace(location.origin, '').split('/')[1] === '/twitter') {
            changeTwitterTimelineBackgroundSize()
            twitterProfile()
            twitterTrends()
        }
    })

    function twitterProfile() {
        var windowWidth = window.innerWidth
        if (windowWidth < 768) return false
        var href = '/twitter/profile'
        if (AquaProjectsCache[href]) {
            var twitterProfileArea = document.querySelector('.twitter-profile')
            while (twitterProfileArea.firstChild) twitterProfileArea.removeChild(twitterProfileArea.firstChild)
            twitterProfileArea.insertAdjacentElement(
                'afterbegin', AquaProjectsCache[href].querySelector('.twitter-profile').cloneNode(true)
            )
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
                AquaProjectsCache[href] = document.createRange().createContextualFragment(data)
                var twitterProfileArea = document.querySelector('.twitter-profile')
                while (twitterProfileArea.firstChild) twitterProfileArea.removeChild(twitterProfileArea.firstChild)
                twitterProfileArea.insertAdjacentElement(
                    'afterbegin', AquaProjectsCache[href].querySelector('.twitter-profile').cloneNode(true)
                )
                changeFontSize()
            }).catch(err => {
                alert(err)
            })
        }
    }

    function twitterTrends() {
        var windowWidth = window.innerWidth
        if (windowWidth < 768) return false
        var href = '/twitter/trends'
        if (AquaProjectsCache[href]) {
            var twitterTrendsArea = document.querySelector('.twitter-trends')
            while (twitterTrendsArea.firstChild) twitterTrendsArea.removeChild(twitterTrendsArea.firstChild)
            twitterTrendsArea.insertAdjacentElement(
                'afterbegin', AquaProjectsCache[href].querySelector('.twitter-trends').cloneNode(true)
            )
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
                AquaProjectsCache[href] = document.createRange().createContextualFragment(data)
                var twitterTrendsArea = document.querySelector('.twitter-trends')
                while (twitterTrendsArea.firstChild) twitterTrendsArea.removeChild(twitterTrendsArea.firstChild)
                twitterTrendsArea.insertAdjacentElement(
                    'afterbegin', AquaProjectsCache[href].querySelector('.twitter-trends').cloneNode(true)
                )
                changeFontSize()
            }).catch(data => {
                alert(data)
            })
        }
    }

    function setTweetCreated_at() {
        const ttc = document.querySelectorAll('.tweet-twitter_createdat')
        for (let index = 0; index < ttc.length; index++) {
            const element = ttc[index];
            const createdat_title = element.getAttribute('title')
            const created_at_time = new Date(createdat_title).getTime()
            const currentTime = new Date().getTime()
            const diffTime = currentTime - created_at_time
            var displayTime = calculateTime(diffTime, createdat_title)
            displayTime = ' · ' + displayTime
            element.innerHTML = displayTime
        }

        var twitterUserPageCreatedAt = document.querySelector('.timeline #twitter_user .twitter_user-created_at')
        if (!twitterUserPageCreatedAt) {
            return false
        }

        (() => {
            var createdat_title = twitterUserPageCreatedAt.title
            var calendarIcon = '<i class="far fa-calendar-alt" style="padding-top: 4px;"></i>'
            var created_at_time = new Date(createdat_title).getTime()
            var currentTime = new Date().getTime()
            var diffTime = currentTime - created_at_time
            var displayTime = calculateJoinTime(diffTime, createdat_title)
            displayTime = `<span style="padding-left: 4px;">${displayTime}</span>`
            twitterUserPageCreatedAt.innerHTML = `${calendarIcon}${displayTime}`
        })()

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

    document.addEventListener('mouseenter', e => {
        if (findParents(e.target, 'tweet-twitter_user_name')) {
            const target = findParents(e.target, 'tweet-twitter_user_name')
            const y = target.offsetTop + target.clientHeight
            target.querySelector('.tweet-twitter_user_tooltip').style.display = ''
            target.querySelector('.tweet-twitter_user_tooltip').style.top = y
        }
    }, true)

    document.addEventListener('mouseleave', e => {
        if (findParents(e.target, 'tweet-twitter_user_name')) {
            const target = findParents(e.target, 'tweet-twitter_user_name')
            target.querySelector('.tweet-twitter_user_tooltip').style.display = 'none'
        }
    }, true)

    document.addEventListener('click', e => {
        if (findParents(e.target, 'twitter_user-lists_button')) {
            const target = findParents(e.target, 'twitter_user-lists_button')
            const lists_status = target.dataset['twitter_userLists_status']
            const screen_name = target.dataset['twitter_userScreen_name']
            const twitterUserListButton = document.querySelectorAll('.twitter_user-lists_button')
            for (let index = 0; index < twitterUserListButton.length; index++) {
                const element = twitterUserListButton[index];
                if (element.dataset['twitter_userScreen_name'] === screen_name) {
                    element.disabled = true
                }
            }
            if (lists_status === 'unknown') {
                listsMembers(screen_name)
            } else if (lists_status === 'tracked') {
                listsMembersDestroy(screen_name)
            } else if (lists_status === 'untracked') {
                listsMembersCreate(screen_name)
            }
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
            const twitterUserListButton = document.querySelectorAll('.twitter_user-lists_button')
            for (let index = 0; index < twitterUserListButton.length; index++) {
                const element = twitterUserListButton[index];
                if (element.dataset['twitter_userScreen_name'] === screen_name) {
                    element.disabled = false
                    if (data === 'untracked') {
                        var userplus = '<i class="fas fa-user-plus"></i>'
                        while (element.firstChild) element.removeChild(element.firstChild)
                        element.insertAdjacentHTML('beforeend', userplus)
                        element.dataset['twitter_userLists_status'] = 'untracked'
                    } else if (data === 'tracked') {
                        var usercheck = '<i class="fas fa-user-check"></i>'
                        while (element.firstChild) element.removeChild(element.firstChild)
                        element.insertAdjacentHTML('beforeend', usercheck)
                        element.dataset['twitter_userLists_status'] = 'tracked'
                    } else {
                        console.error(err)
                    }
                }
            }
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
            const twitterUserListButton = document.querySelectorAll('.twitter_user-lists_button')
            for (let index = 0; index < twitterUserListButton.length; index++) {
                const element = twitterUserListButton[index];
                if (element.dataset['twitter_userScreen_name'] === screen_name) {
                    element.disabled = false
                    var usercheck = '<i class="fas fa-user-check"></i>'
                    while (element.firstChild) element.removeChild(element.firstChild)
                    element.insertAdjacentHTML('beforeend', usercheck)
                    element.dataset['twitter_userLists_status'] = 'tracked'
                }
            }
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
            const twitterUserListButton = document.querySelectorAll('.twitter_user-lists_button')
            for (let index = 0; index < twitterUserListButton.length; index++) {
                const element = twitterUserListButton[index];
                if (element.dataset['twitter_userScreen_name'] === screen_name) {
                    element.disabled = false
                    var userplus = '<i class="fas fa-user-plus"></i>'
                    while (element.firstChild) element.removeChild(element.firstChild)
                    element.insertAdjacentHTML('beforeend', userplus)
                    element.dataset['twitter_userLists_status'] = 'untracked'
                }
            }
        }).catch(err => {
            console.error(err)
        })
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'twitter_user-follow_button')) {
            const target = findParents(e.target, 'twitter_user-follow_button')
            const follow_status = target.dataset['twitter_userFollow_status']
            const screen_name = target.dataset['twitter_userScreen_name']
            var friendships = ''
            if (follow_status === true) friendships = 'destroy'
            else if (follow_status === false) friendships = 'create'

            const twitterUserFollowButton = document.querySelectorAll('.twitter_user-follow_button')
            for (let index = 0; index < twitterUserFollowButton.length; index++) {
                const element = twitterUserFollowButton[index];
                if (element.dataset['twitter_userScreen_name'] === screen_name) {
                    element.disabled = true
                }
            }

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
                    const tufb = document.querySelectorAll('.twitter_user-follow_button')
                    for (let index = 0; index < tufb.length; index++) {
                        const element = tufb[index];
                        if (element.dataset['twitter_userScreen_name'] === screen_name) {
                            if (element.classList && element.classList.contains('btn-primary')) {
                                element.classList.remove('btn-primary')
                            }
                            element.classList.add('btn-outline-primary')
                            element.innerHTML = 'Follow'
                            element.dataset['twitter_userFollow_status'] = false
                            element.disabled = false
                        }
                    }
                } else if (follow_status === false) {
                    const tufb = document.querySelectorAll('.twitter_user-follow_button')
                    for (let index = 0; index < tufb.length; index++) {
                        const element = tufb[index];
                        if (element.dataset['twitter_userScreen_name'] === screen_name) {
                            if (element.classList && element.classList.contains('btn-outline-primary')) {
                                element.classList.remove('btn-outline-primary')
                            }
                            element.classList.add('btn-primary')
                            element.innerHTML = 'Following'
                            element.dataset['twitter_userFollow_status'] = true
                            element.disabled = false
                        }
                    }
                }
            }).catch(err => {
                console.error(err)
            })
        }
    })

    document.addEventListener('click', e => {
        if (findParents(e.target, 'tweet-twitter_favorite')) {
            const target = findParents(e.target, 'tweet-twitter_favorite')
            const tweet_favorited = target.dataset['tweet_favorited']
            const tweet_id = target.dataset['tweet_id']
            const tweetTwitterFavorite = document.querySelectorAll('.tweet-twitter_favorite')
            for (let index = 0; index < tweetTwitterFavorite.length; index++) {
                const element = tweetTwitterFavorite[index];
                if (parseInt(element.dataset['tweet_id']) === tweet_id) {
                    element.disabled = true
                }
            }
            if (tweet_favorited === 'true' || tweet_favorited === 'True') {
                favoritesDestroy(tweet_id)
            } else {
                favoritesCreate(tweet_id)
            }
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
            const responseNode = document.createRange().createContextualFragment(data)
            const tweetTwitterFavorite = document.querySelectorAll('.tweet-twitter_favorite')
            for (let index = 0; index < tweetTwitterFavorite.length; index++) {
                const element = tweetTwitterFavorite[index];
                if (element.dataset['tweet_id'] === tweet_id) {
                    const tweetTwitterSocial = responseNode.querySelectorAll('.tweet-twitter_social')
                    for (let index = 0; index < tweetTwitterSocial.length; index++) {
                        const dataElement = tweetTwitterSocial[index];
                        if (dataElement.querySelector('.tweet-twitter_favorite').dataset['tweet_id'] === tweet_id) {
                            findParents(element, 'tweet-twitter_social').appendChild(dataElement)
                        }
                    }
                }
            }
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
            const responseNode = document.createRange().createContextualFragment(data)
            const tweetTwitterFavorite = document.querySelectorAll('.tweet-twitter_favorite')
            for (let index = 0; index < tweetTwitterFavorite.length; index++) {
                const element = tweetTwitterFavorite[index];
                if (element.dataset['tweet_id'] === tweet_id) {
                    const tweetTwitterSocial = responseNode.querySelectorAll('.tweet-twitter_social')
                    for (let index = 0; index < tweetTwitterSocial.length; index++) {
                        const dataElement = tweetTwitterSocial[index];
                        if (dataElement.querySelector('.tweet-twitter_favorite').dataset['tweet_id'] === tweet_id) {
                            findParents(element, 'tweet-twitter_social').appendChild(dataElement)
                        }
                    }
                }
            }
        }).catch(err => {
            console.error(err)
        })
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'tweet-twitter_retweet')) {
            const target = findParents(e.target, 'tweet-twitter_retweet')
            const tweet_retweet = target.dataset['tweet_retweeted']
            const tweet_id = target.dataset['tweet_id']
            const tweetTwitterRetweet = document.querySelectorAll('.tweet-twitter_retweet')
            for (let index = 0; index < tweetTwitterRetweet.length; index++) {
                const element = tweetTwitterRetweet[index];
                if (parseInt(element.dataset['tweet_id']) === tweet_id) {
                    element.disabled = true
                }
            }
            if (tweet_retweet === 'true' || tweet_retweet === 'True') {
                statusesUnretweet(tweet_id)
            } else {
                statusesRetweet(tweet_id)
            }
        }
    })

    function statusesRetweet(tweet_id) {
        fetch(
            '/twitter/statuses/retweet', {
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
            const responseNode = document.createRange().createContextualFragment(data)
            const tweetTwitterRetweet = document.querySelectorAll('.tweet-twitter_retweet')
            for (let index = 0; index < tweetTwitterRetweet.length; index++) {
                const element = tweetTwitterRetweet[index];
                if (element.dataset['tweet_id'] === tweet_id) {
                    const tweetTwitterSocial = responseNode.querySelectorAll('.tweet-twitter_social')
                    for (let index = 0; index < tweetTwitterSocial.length; index++) {
                        const dataElement = tweetTwitterSocial[index];
                        if (dataElement.querySelector('.tweet-twitter_retweet').dataset['tweet_id'] === tweet_id) {
                            findParents(element, 'tweet-twitter_social').appendChild(dataElement)
                        }
                    }
                }
            }
        }).catch(err => {
            console.error(err)
        })
    }

    function statusesUnretweet(tweet_id) {
        fetch(
            '/twitter/statuses/unretweet', {
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
            const responseNode = document.createRange().createContextualFragment(data)
            const tweetTwitterRetweet = document.querySelectorAll('.tweet-twitter_retweet')
            for (let index = 0; index < tweetTwitterRetweet.length; index++) {
                const element = tweetTwitterRetweet[index];
                if (element.dataset['tweet_id'] === tweet_id) {
                    const tweetTwitterSocial = responseNode.querySelectorAll('.tweet-twitter_social')
                    for (let index = 0; index < tweetTwitterSocial.length; index++) {
                        const dataElement = tweetTwitterSocial[index];
                        if (dataElement.querySelector('.tweet-twitter_retweet').dataset['tweet_id'] === tweet_id) {
                            findParents(element, 'tweet-twitter_social').appendChild(dataElement)
                        }
                    }
                }
            }
        }).catch(err => {
            console.error(err)
        })
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'twitter_user-profile_timelines_navigation-item')) {
            const target = findParents(e.target, 'twitter_user-profile_timelines_navigation-item')
            var href = target.querySelector('a').href
            twitterUserProfileTimelineNavigationSelected(target)
            twitterUserProfileTimelineNavigationPushState(href)
            twitterUserProfileTimelineNavigationLoader()
            twitterUserProfileTimelineNavigationFetch(href.replace(location.origin, ''), true)
            e.preventDefault()
        }
    })

    function twitterUserProfileTimelineNavigationSelected(element) {
        var twitterUserProfileTimelinesNavigationItem =
            document.querySelectorAll('.twitter_user-profile_timelines_navigation-item')

        for (let index = 0; index < twitterUserProfileTimelinesNavigationItem.length; index++) {
            twitterUserProfileTimelinesNavigationItem[index].classList.remove(
                'twitter_user-profile_timeline_navigation-selected'
            )
        }

        element.classList.add('twitter_user-profile_timeline_navigation-selected')
    }

    function twitterUserProfileTimelineNavigationPushState(href) {
        var targetPage = href
        targetPage = targetPage.replace(location.origin, '')
        var currentPage = location.href;
        currentPage = currentPage.replace(location.origin, '')
        var state = {
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#main'
        };
        var replaceState = Object.assign({}, history.state)
        replaceState['scrollTop'] = window.scrollY
        history.replaceState(replaceState, null, currentPage)
        history.pushState(state, null, targetPage);
        document.title = 'Aqua Projects - ' + location.pathname.substring(1)
    }

    function twitterUserProfileTimelineNavigationLoader() {
        var tweets = document.querySelectorAll('.tweet')
        for (let index = 0; index < tweets.length; index++) {
            tweets[index].remove()
        }
        document.querySelector('.tweet-load_more_old_tweet').remove()
        document.querySelector('.format_timeline').insertAdjacentHTML(
            'afterbegin', '<div class="loader" style="font-size: 2px; margin: 8px auto auto;"></div>'
        )
    }

    function twitterUserProfileTimelineNavigationFetch(href, useCache = true) {
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')
        if (ajaxProgressBar.classList && ajaxProgressBar.classList.contains('bg-danger')) {
            ajaxProgressBar.classList.remove('bg-danger')
        }
        ajaxProgressBar.style.visibility = 'visible'

        // Cache exsists.
        if (AquaProjectsCache[href]) {
            var changeLocation = document.querySelector('#main')
            var changeLocationCloneNode = AquaProjectsCache[href].cloneNode(true).querySelector('#main')
            while (changeLocation.firstChild) changeLocation.removeChild(changeLocation.firstChild)
            Array.from(changeLocationCloneNode.children).forEach(element => {
                changeLocation.appendChild(element)
            });
            ajaxProgressBar.style.width = '100%'

            window.dispatchEvent(new Event('aquaprojects_popstate'));

            if (useCache === true) {
                ajaxProgressBar.style.width = '100%'
                ajaxProgressBar.style.transition = 'width 0.1s ease 0s'

                setTimeout(() => {
                    ajaxProgressBar.style.visibility = 'hidden'
                    ajaxProgressBar.style.width = '0%'
                    ajaxProgressBar.style.transition = ''
                }, 200)
                return false
            }
        }

        ajaxProgressBar.style.width = '80%'

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
            AquaProjectsCache[href] = document.createRange().createContextualFragment(data)
            if (href != location.href.replace(location.origin, '')) {
                console.log('It seems that you moved to a different page first.')
                return false
            }
            var changeLocation = document.querySelector('#main')
            while (changeLocation.firstChild) changeLocation.removeChild(changeLocation.firstChild)
            var changeLocationCloneNode = AquaProjectsCache[href].cloneNode(true).querySelector('#main')
            Array.from(changeLocationCloneNode.children).forEach(element => {
                changeLocation.appendChild(element)
            })

            window.dispatchEvent(new Event('aquaprojects_popstate'));

            ajaxProgressBar.style.width = '100%'
            ajaxProgressBar.style.transition = 'width 0.1s ease 0s'

            setTimeout(() => {
                ajaxProgressBar.style.visibility = 'hidden'
                ajaxProgressBar.style.width = '0%'
                ajaxProgressBar.style.transition = ''
            }, 200)
        }).catch(err => {
            console.error(err)
            showError()
        })
    }

    document.addEventListener('focus', e => {
        if (e.target.classList.contains('twitter-search_box-input')) {
            document.querySelector('.twitter-search_box-border').style.border = '2px solid #1da1f2'
            document.querySelector('.twitter-search_box-icon').style.color = '#1da1f2'
            if (document.querySelector('.twitter-search_box-input').value !== '') {
                document.querySelector('.twitter-search_box-close').style.display = 'flex'
            }
        }
    }, true)

    document.addEventListener('blur', e => {
        if (e.target.classList.contains('twitter-search_box-input')) {
            document.querySelector('.twitter-search_box-border').style.border = '2px solid #e6ecf0'
            document.querySelector('.twitter-search_box-icon').style.color = '#657786'
            document.querySelector('.twitter-search_box-close').style.display = 'none'
            if (document.querySelector('.twitter-search_box-input').dataset['cleared'] === 'true') {
                document.querySelector('.twitter-search_box-input').focus()
                document.querySelector('.twitter-search_box-input').dataset['cleared'] = false
            }
        }
    }, true)

    document.addEventListener('mousedown', e => {
        if (findParents(e.target, 'twitter-search_box-close')) {
            document.querySelector('.twitter-search_box-input').value = ''
            document.querySelector('.twitter-search_box-close').style.display = 'none'
            document.querySelector('.twitter-search_box-input').dataset['cleared'] = true
        }
    })

    document.addEventListener('input', e => {
        if (e.target.classList.contains('twitter-search_box-input')) {
            if (document.querySelector('.twitter-search_box-input').value !== '') {
                document.querySelector('.twitter-search_box-close').style.display = 'flex'
            } else {
                document.querySelector('.twitter-search_box-close').style.display = 'none'
            }
        }
    })

    document.addEventListener('keydown', e => {
        if (e.target.classList.contains('twitter-search_box-input') && e.keyCode == 13 && e.target.value !== '') {
            var query = document.querySelector('.twitter-search_box-input').value
            var href = `/twitter/search?q=${query}`
            twitterUserProfileTimelineNavigationPushState(href)
            twitterSearchLoader()
            scrollPageTop()
            twitterUserProfileTimelineNavigationFetch(href, true)
            document.querySelector('.twitter-search_box-input').blur()
            document.querySelector('.twitter_title-home-text').innerHTML = query
        }
    })

    function twitterSearchLoader() {

        function removeElement(selector) {
            if (document.querySelector(selector) !== null) {
                document.querySelector(selector).remove()
            }
        }

        removeElement('#twitter_user')

        var tweets = document.querySelectorAll('.tweet')
        for (let index = 0; index < tweets.length; index++) {
            tweets[index].remove()
        }

        removeElement('.tweet-load_more_old_tweet')

        document.querySelector('.format_timeline').insertAdjacentHTML(
            'afterbegin', '<div class="loader" style="font-size: 2px; margin: 8px auto auto;"></div>'
        )
    }

    function averageColorByImage(src) {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext('2d');
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous"
            img.onload = () => {
                canvas.height = img.height;
                canvas.width = img.width;
                const scale = '0.05'
                const dWidth = img.width * scale
                const dHeight = img.height * scale
                ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, dWidth, dHeight);
                const imageData = ctx.getImageData(0, 0, dWidth, dHeight)

                var worker = new Worker('/webworker.js')
                worker.addEventListener('message', e => {
                    switch (e.data['name']) {
                        case 'averageColor':
                            const rgb = e.data['msg']
                            resolve(rgb)
                            break;
                        default:
                            console.error(e)
                    }
                    worker.terminate()
                })
                worker.postMessage({
                    'cmd': 'averageColor',
                    'msg': [imageData, dWidth, dHeight]
                })
            };
            img.onerror = (e) => reject(e)
            img.src = src;
        });
    }

    function findParents(target, className) {
        if (target === document) return false
        if (target.className.length !== 0 && target.classList.contains(className)) {
            return target
        }
        var currentNode = target.parentNode
        if (currentNode === document || currentNode === null) {
            return false
        } else if (currentNode.className.length !== 0 && currentNode.classList.contains(className)) {
            return currentNode
        } else {
            return findParents(currentNode, className)
        }
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

    function showError() {
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')
        console.error('fail. something happen.')
        ajaxProgressBar.classList.add('bg-danger')
        ajaxProgressBar.style.width = '100%'
        document.querySelector('#main').innerHTML = '<div style="word-break: break-all; margin: 8px auto auto;"><div style="margin: 0px auto; width: fit-content;"><div style="width: fit-content; margin: 0px auto;"><i class="fas fa-exclamation-circle"></i></div>Looks like you lost your connection. Please check it and try again.</div></div>'
    }
})()