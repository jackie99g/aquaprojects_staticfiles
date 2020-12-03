(() => {
    window.addEventListener('aquaprojects_popstate', () => {
        if (`/${location.pathname.replace(location.origin, '').split('/')[1]}` === '/twitter') {
            console.log('twitter!')
            initTweetIntersectionObserver()
            initTweetPictureInsersectionObserver()
            initTweetTwitterUserIconInsersectionObserver()
            initLastTweetInsersectionObserver()
            makeTwitterUserTwitterIconClear()
            setTweetCreated_at()
            twitterProfile()
            twitterTrends()
            changeTwitterTimelineBackgroundSize()
            changeTheme()
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
        tweetPictureInsersectionObserver = new IntersectionObserver(
            processTweetPictureInsersectionObserver
        )
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
                observer.unobserve(ttp)
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
                observer.unobserve(ttui)
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

    function initTweetIntersectionObserver() {
        setTimeout(() => {
            // Whether load tweets object?
            if (document.querySelector('.twitter_new_tweets_of_no_content')) {
                calculateTweetsToDisplayFirst()
                window.dispatchEvent(new Event('aquaprojects_popstate'))

                setTimeout(() => {
                    const tntonc =
                        document.querySelector('.twitter_new_tweets_of_no_content')
                    const tweet = document.querySelector('.tweet')
                    if (!tntonc || !tweet) return false
                    const is_tweetId =
                        document.querySelector('.format_timeline .tweet').dataset['tweet_id']
                    is_tweetId ? loadTheOthersTweet() : loadCacheOfMainArea()
                    window.dispatchEvent(new Event('aquaprojects_popstate'))

                    setTimeout(() => {
                        scanTweetHeight()
                        const currentPage = location.href.replace(location.origin, '')
                        let replaceState = Object.assign({}, history.state)
                        replaceState['scrollTop'] = window.scrollY
                        history.replaceState(replaceState, null, currentPage)
                    }, 0);

                    function loadCacheOfMainArea() {
                        const href = location.href.replace(location.origin, '')
                        var changeLocation = document.querySelector('#main')
                        while (changeLocation.firstChild) {
                            changeLocation.removeChild(changeLocation.firstChild)
                        }
                        var changeLocationCloneNode =
                            AquaProjectsCache[href].cloneNode(true).querySelector('#main')
                        Array.from(changeLocationCloneNode.children).forEach(element => {
                            changeLocation.appendChild(element)
                        });
                    }
                }, 0);
            } else {
                scanTweetHeight()
            }
        }, 0);
    }

    function calculateTweetsToDisplayFirst() {
        let twitter_target_tweet_id = 0
        const twitter_each_tweets_height = history.state['twitter_each_tweets_height']
        const format_timeline_height = history.state['format_timeline_height']

        const href = location.href.replace(location.origin, '')
        const cacheNodeNoCopy = AquaProjectsCache[href]
        const cacheNode = cacheNodeNoCopy.querySelector('.format_timeline')
        const cacheTweets = cacheNode.querySelectorAll('.tweet')
        let correctCacheTweets = []
        let newTweetOfNoContentHeight = 0
        let slicedTweets = []

        // Collect tweet object not contain quoted tweet
        for (let index = 0; index < cacheTweets.length; index++) {
            const element = cacheTweets[index];
            if (!element.parentNode.classList.length === 0) {
                continue
            }
            if (!element.parentNode.classList.contains('format_timeline')) {
                continue
            }
            correctCacheTweets.push(element)
        }

        // Search twitter_target_tweet_id
        const searchTwitterTargetTweetId = (() => {
            const targetScrollY = window.scrollY

            if (!twitter_each_tweets_height) {
                twitter_target_tweet_id = correctCacheTweets[0].dataset['tweet_id']
                return
            }

            let totalEachHeight = []
            for (let index = 0; index < twitter_each_tweets_height.length; index++) {
                const element = twitter_each_tweets_height[index];
                let elementTopY = index === 0 ?
                    element['tweet_height'] :
                    totalEachHeight[index - 1]['tweet_height'] + element['tweet_height']
                totalEachHeight[index] = {
                    'tweet_id': element['tweet_id'],
                    'tweet_height': elementTopY
                }
            }

            let diffEachHeight = []
            for (let index = 0; index < totalEachHeight.length; index++) {
                const element = totalEachHeight[index];
                let diff = targetScrollY - element['tweet_height']
                diffEachHeight[index] = {
                    'tweet_id': element['tweet_id'],
                    'diff': diff
                }
            }

            let minDiff = 0
            let targetTweetData = {}
            for (let index = 0; index < diffEachHeight.length; index++) {
                const element = diffEachHeight[index];
                if (index === 0) {
                    minDiff = Math.abs(element['diff'])
                    targetTweetData = element
                } else {
                    minDiff = Math.abs(Math.min(element['diff'], minDiff))
                    targetTweetData = minDiff === element['diff'] ?
                        element : targetTweetData
                }
            }

            twitter_target_tweet_id = targetTweetData['tweet_id']
        })
        searchTwitterTargetTweetId()

        // Collect tweets to display
        const tweetIndex = correctCacheTweets
            .map(item => item.dataset['tweet_id'])
            .findIndex(item => item === twitter_target_tweet_id)
        let slicedTweetsBeginIntex = tweetIndex - 10
        let slicedTweetsEndIndex = tweetIndex + 10 + 1
        if (slicedTweetsBeginIntex < 0) {
            slicedTweetsBeginIntex = 0
        }
        if (slicedTweetsEndIndex > correctCacheTweets.length) {
            slicedTweetsEndIndex = correctCacheTweets.length
        }
        slicedTweets = correctCacheTweets.slice(slicedTweetsBeginIntex, slicedTweetsEndIndex)
        // Array.from(slicedTweets).forEach(element => element.cloneNode(true))

        // Calculate twitter_new_tweets_of_no_content height
        const calculateTwitterNewTweetsOfNoContentHeight = (() => {

            if (!twitter_each_tweets_height) {
                newTweetOfNoContentHeight = 0
                return
            }

            const newTweetOfNoContentIndedx = twitter_each_tweets_height
                .map(item => item['tweet_id'])
                .findIndex(item => item === slicedTweets[0].dataset['tweet_id'])
            const newTweetOfNoContentHeightList =
                twitter_each_tweets_height.slice(0, newTweetOfNoContentIndedx)
            for (let index = 0; index < newTweetOfNoContentHeightList.length; index++) {
                const element = newTweetOfNoContentHeightList[index];
                newTweetOfNoContentHeight += element['tweet_height']
            }
        })
        calculateTwitterNewTweetsOfNoContentHeight()

        // Set cacheNode that removed format_timeline
        const ft = document.querySelector('.format_timeline')
        while (ft.firstChild) ft.removeChild(ft.firstChild)

        // Add twitter_new_tweets_of_no_content
        const newTweetOfNoContent = document.createElement('div')
        newTweetOfNoContent.className = 'twitter_new_tweets_of_no_content'
        newTweetOfNoContent.style.height = `${newTweetOfNoContentHeight}px`

        // Add displaying tweets
        const displayingTweets = document.createDocumentFragment()
        for (let index = 0; index < slicedTweets.length; index++) {
            const element = slicedTweets[index].cloneNode(true);
            displayingTweets.appendChild(element)
        }

        // Add twitter_old_tweets_of_no_content
        const oldTweetOfNocontent = document.createElement('div')
        oldTweetOfNocontent.className = 'twitter_old_tweets_of_no_content'

        ft.style.height = format_timeline_height ? `${format_timeline_height}px` : ''
        ft.appendChild(newTweetOfNoContent)
        ft.appendChild(displayingTweets)
        ft.appendChild(oldTweetOfNocontent)

        // Show tweet-twitter_picture when they were downloaded.
        if (localStorage.getItem('twitter-view_pictures')) {
            const ttp = document.querySelectorAll('.tweet-twitter_picture')
            for (let index = 0; index < ttp.length; index++) {
                const element = ttp[index];
                if (element.complete) {
                    element.src = element.dataset['src']
                }
            }
        }
    }

    function loadTheOthersTweet() {
        const href = location.href.replace(location.origin, '')
        var dataNode = AquaProjectsCache[href]
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
            correctTweets.push(element)
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
            const element = newTweets[index].cloneNode(true);
            formatTimelineNewTweets.appendChild(element)
        }

        // Create old tweets document fragement
        var formatTimelineOldTweets = document.createDocumentFragment()
        for (let index = 0; index < oldTweets.length; index++) {
            const element = oldTweets[index].cloneNode(true);
            formatTimelineOldTweets.appendChild(element)
        }

        formatTimeline.style.height = ''
        formatTimeline.querySelector('.twitter_new_tweets_of_no_content').remove()
        formatTimeline.querySelector('.twitter_old_tweets_of_no_content').remove()
        formatTimeline.insertBefore(formatTimelineNewTweets, formatTimeline.firstChild)
        formatTimeline.appendChild(formatTimelineOldTweets)
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

    var lastTweetInsersectionObserver = null

    function initLastTweetInsersectionObserver() {
        if (lastTweetInsersectionObserver) {
            try {
                lastTweetInsersectionObserver.disconnect()
                lastTweetInsersectionObserver = null
            } catch (e) {
                console.error(e)
            }
        }
        lastTweetInsersectionObserver = new IntersectionObserver(
            processLastTweetInsersectionObserver
        )
        const lastTweet = document.querySelector(
            `.format_timeline .tweet:nth-child(${
                document.querySelectorAll('.format_timeline > .tweet').length
            })`
        )
        if (document.querySelector('.format_timeline').dataset['since_id'] && lastTweet) {
            lastTweetInsersectionObserver.observe(lastTweet)
        }

        function processLastTweetInsersectionObserver(entries, observer) {
            entries.forEach(element => {
                if (!element.isIntersecting) {
                    return false
                }
                const maxId = document.querySelector('.format_timeline').dataset['max_id']
                downloadMoreTweet('', maxId)
                observer.unobserve(element.target)
            })
        }
    }

    function downloadMoreTweet(sinceId, maxId) {
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')
        const href = location.href.replace(location.origin, '')
        const parameters = buildParameter({
            since_id: sinceId,
            max_id: maxId
        })
        const saveCacheAdress = `${href}?${parameters}`

        class recalculateDownloadTweetId extends Error {
            constructor(message, sinceId, maxId) {
                super(message)
                this.description = message
                this.name = 'recalculateDownloadTweetId'
                this.status = 500
                this.sinceId = sinceId
                this.maxId = maxId
            }
        }

        ajaxProgressBar.parentNode.style.visibility = ''
        ajaxProgressBar.style.width = '80%'

        fetch(
            saveCacheAdress, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include'
            }
        ).then(response => {
            if (response.ok) {
                return response.text()
            } else {
                console.error(response)
                throw new recalculateDownloadTweetId('Not found timeline', sinceId, maxId)
            }
        }).then(data => {
            // Save Cache.
            AquaProjectsCache[saveCacheAdress] =
                document.createRange().createContextualFragment(data)
            if (href !== location.href.replace(location.origin, '')) {
                console.log('It seems that you moved to a different page first.')
                return false
            }

            // Insert tweets to main.
            const cache = AquaProjectsCache[saveCacheAdress].querySelector('.format_timeline')
            const cacheTweets = Array.from(cache.children)
            const index = cacheTweets.findIndex(
                element => maxId === element.dataset['tweet_id']
            )
            const formatTimelineMain = AquaProjectsCache[href].querySelector('.format_timeline')
            if (sinceId) {
                cacheTweets.slice(0, index + 1).reverse().forEach(
                    element => formatTimelineMain.insertBefore(element.cloneNode(true),
                        formatTimelineMain.querySelector('.tweet'))
                )
            } else if (maxId) {
                cacheTweets.slice(index, cacheTweets.length).forEach(
                    element => formatTimelineMain.appendChild(element.cloneNode(true))
                )
            }

            // Create tweets document fragement.
            const tweets = document.createDocumentFragment()
            if (sinceId) {
                cacheTweets.slice(0, index + 1).forEach(
                    element => tweets.appendChild(element.cloneNode(true))
                )
            } else if (maxId) {
                cacheTweets.slice(index, cacheTweets.length).forEach(
                    element => tweets.appendChild(element.cloneNode(true))
                )
            }

            // Insert tweets.
            const formatTimeline = document.querySelector('.format_timeline')
            if (sinceId) {
                const refChild = document.querySelector('.format_timeline > .tweet')
                formatTimeline.insertBefore(tweets, refChild)
            } else if (maxId) {
                formatTimeline.appendChild(tweets)
            }

            // Rewrite since_id and max_id.
            const cacheSinceId = cache.dataset['since_id']
            const cacheMaxId = cache.dataset['max_id']
            if (formatTimelineMain.dataset['since_id'] < cacheSinceId) {
                formatTimelineMain.dataset['since_id'] = cacheSinceId
                formatTimeline.dataset['since_id'] = cacheSinceId
            }
            if (formatTimelineMain.dataset['max_id'] > cacheMaxId) {
                formatTimelineMain.dataset['max_id'] = cacheMaxId
                formatTimeline.dataset['max_id'] = cacheMaxId
            }

            window.dispatchEvent(new Event('aquaprojects_popstate'))

            ajaxProgressBar.style.width = '100%'
            ajaxProgressBar.style.transition = 'width 0.1s ease 0s'

            setTimeout(() => {
                ajaxProgressBar.parentNode.style.visibility = 'hidden'
                ajaxProgressBar.style.width = '0%'
                ajaxProgressBar.style.transition = ''
            }, 200)

        }).catch(err => {
            if (err instanceof recalculateDownloadTweetId) {
                const tweets = document.querySelectorAll('.format_timeline > .tweet')

                // Search orignal tweet
                let foundOriginalTweet = null
                const tweetsArray = err.maxId ? Array.from(tweets) : Array.from(tweets).reverse()
                for (let index = 0; index < tweetsArray.length; index++) {
                    const tweet = tweetsArray[index];
                    for (let index = 0; index < Array.from(tweet.children).length; index++) {
                        const children = Array.from(tweet.children)[index].children;
                        for (let index = 0; index < Array.from(children).length; index++) {
                            const classes = Array.from(children)[index].className;
                            if (!classes.includes('tweet-twitter_retweet_header')) {
                                foundOriginalTweet = tweet
                            }
                        }

                    }
                }

                if (err.sinceId) {
                    downloadMoreTweet(foundOriginalTweet.dataset['tweet_id'])
                } else if (err.maxId) {
                    downloadMoreTweet('', foundOriginalTweet.dataset['tweet_id'])
                }
            }
        })

        function buildParameter(params) {
            let parameters = ''
            Object.keys(params).forEach((key, index, array) => {
                if (params[key]) parameters += `${key}=${params[key]}&`
                if (index === array.length - 1) parameters = parameters.slice(0, -1)
            })
            return parameters
        }
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

            ajaxProgressBar.parentNode.style.visibility = ''
            ajaxProgressBar.style.width = '80%'

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
                    ajaxProgressBar.parentNode.style.visibility = ''
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
                    ajaxProgressBar.parentNode.style.visibility = 'hidden'
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

            const ttpzc = document.querySelector('.tweet-twitter_picture_zoom-container')
            while (ttpzc.lastChild) ttpzc.removeChild(ttpzc.lastChild)

            for (let index = 0; index < ImgTable.length; index++) {
                const ttpze = document.createElement('div')
                ttpze.className = 'tweet-twitter_picture_zoom-element'

                const ttpzei = document.createElement('img')
                ttpzei.className = 'tweet-twitter_picture_zoom-element_img'
                ttpzei.src = ImgTable[index]

                ttpze.appendChild(ttpzei)
                ttpzc.appendChild(ttpze)
            }

            const ttpz = document.querySelector('.tweet-twitter_picture_zoom')
            const ttpzn = document.querySelectorAll('.tweet-twitter_picture_zoom-navigator')

            ttpz.style.display = 'flex'

            const apTheme = localStorage.getItem('ap-theme') === 'dark' && 'dark'
            const prefersColorSchemeDark =
                window.matchMedia('(prefers-color-scheme: dark)').matches

            ttpz.style.background =
                apTheme === 'dark' || prefersColorSchemeDark ?
                'rgba(21, 32, 43, 0.8)' : 'rgba(255, 255, 255, 0.8)'

            for (let index = 0; index < ttpzn.length; index++) {
                const element = ttpzn[index];
                element.style.background =
                    apTheme === 'dark' || prefersColorSchemeDark ?
                    'rgba(21, 32, 43)' : 'rgba(255, 255, 255)'
            }

            jumpToSlide(currentImgNumber)
            tweetTwitterPictureZoomOpen(currentImgNumber)
        }
    })

    // tweet-twitter_picture_zoom-container
    document.addEventListener('touchstart', e => {
        if (findParents(e.target, 'tweet-twitter_picture_zoom-container')) {
            const container = findParents(e.target, 'tweet-twitter_picture_zoom-container')
            boxContainerTouchStart(e, container)
        }
    })

    // tweet-twitter_picture_zoom-container
    document.addEventListener('touchmove', e => {
        if (findParents(e.target, 'tweet-twitter_picture_zoom-container')) {
            const container = findParents(e.target, 'tweet-twitter_picture_zoom-container')
            boxContainerTouchMove(e, container)
        }
    })

    // tweet-twitter_picture_zoom-container
    document.addEventListener('touchend', e => {
        if (findParents(e.target, 'tweet-twitter_picture_zoom-container')) {
            const container = findParents(e.target, 'tweet-twitter_picture_zoom-container')
            boxContainerTouchEnd(e, container)
        }
    })

    // // tweet-twitter_picture_zoom-container
    // document.addEventListener('mousedown', e => {
    //     if (findParents(e.target, 'tweet-twitter_picture_zoom-container')) {
    //         const container = findParents(e.target, 'tweet-twitter_picture_zoom-container')
    //         boxContainerMouseDown(e, container)
    //     }
    // })

    // // tweet-twitter_picture_zoom-container
    // document.addEventListener('mousemove', e => {
    //     if (findParents(e.target, 'tweet-twitter_picture_zoom-container')) {
    //         const container = findParents(e.target, 'tweet-twitter_picture_zoom-container')
    //         boxContainerMouseMove(e, container)
    //     }
    // })

    // // tweet-twitter_picture_zoom-container
    // document.addEventListener('mouseup', e => {
    //     if (findParents(e.target, 'tweet-twitter_picture_zoom-container')) {
    //         const container = findParents(e.target, 'tweet-twitter_picture_zoom-container')
    //         boxContainerMouseUp(e, container)
    //     }
    // })

    // // tweet-twitter_picture_zoom-container
    // document.addEventListener('mouseleave', e => {
    //     if (findParents(e.target, 'tweet-twitter_picture_zoom-container')) {
    //         const container = findParents(e.target, 'tweet-twitter_picture_zoom-container')
    //         boxContainerMouseLeave(e, container)
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

    function analyzeTransform(transform) {
        return transform
            .replace('translate3d', '')
            .replace('(', '')
            .replace(')', '')
            .replace(' ', '')
            .replaceAll('px', '')
            .split(',')
    }

    function boxContainerTouchStart(e, container) {
        touchingPositionPageX = e.changedTouches[0].pageX
        touchStartScrollLeft = container.style.transform ?
            analyzeTransform(container.style.transform) : [0, 0, 0]
    }

    function boxContainerTouchMove(e, container) {
        const amountOfMovement = touchingPositionPageX - e.changedTouches[0].pageX
        const translate3dX = (touchStartScrollLeft[0] * -1 + amountOfMovement) * -1
        container.style.transform = `translate3d(${translate3dX}px, 0px, 0px)`

    }

    function boxContainerTouchEnd(e, container) {
        const elements = document.querySelectorAll(`.${e.target.className}`)
        const elementIndex = Array.from(elements).findIndex(item => item === e.target)
        const elementWidth = elements[0].offsetWidth
        const amountOfMovement = touchingPositionPageX - e.changedTouches[0].pageX

        container.addEventListener('transitionend', () =>
            container.style.transition = 'all 0ms ease 0s')
        container.style.transition = 'all 300ms ease 0s'

        container.style.transform =
            `translate3d(${elementIndex * elementWidth * -1}px, 0px, 0px)`
        touchingPositionPageX = 0
        touchStartScrollLeft = 0

        if (amountOfMovement > container.offsetWidth / 6) {
            if (elements.length - 1 < currentSlideNumberProxy.number + 1) return false
            container.style.transform =
                `translate3d(${(elementIndex + 1) * elementWidth * -1}px, 0px, 0px)`
            currentSlideNumberProxy.number += 1
        } else if (amountOfMovement < -(container.offsetWidth / 6)) {
            if (currentSlideNumberProxy.number - 1 < 0) return false
            container.style.transform =
                `translate3d(${(elementIndex - 1) * elementWidth * -1}px, 0px, 0px)`
            currentSlideNumberProxy.number -= 1
        }

        setTimeout(() => {
            AverageColorByImageOnTweetTwitterPictureZoom()
        }, 0);
    }

    var clickingNow = false
    var clickingPositionOffsetX = 0
    var clickingPositionPageX = 0

    function boxContainerMouseDown(e, container) {
        clickingNow = true
        clickingPositionOffsetX = e.offsetX
        clickingPositionPageX = e.pageX
        touchStartScrollLeft = container.style.transform ?
            analyzeTransform(container.style.transform) : [0, 0, 0]
    }

    function boxContainerMouseMove(e, container) {
        if (clickingNow) {
            const amountOfMovement = clickingPositionOffsetX - e.offsetX
            const translate3dX = (touchStartScrollLeft[0] * -1 + amountOfMovement) * -1
            container.style.transform = `translate3d(${translate3dX}px, 0px, 0px)`
        }
    }

    function boxContainerMouseUp(e, container) {
        const elements = document.querySelectorAll(`.${e.target.className}`)
        const elementIndex = Array.from(elements).findIndex(item => item === e.target)
        const elementWidth = elements[0].offsetWidth
        const amountOfMovement = clickingPositionPageX - e.pageX

        container.addEventListener('transitionend', () =>
            container.style.transition = 'all 0ms ease 0s')
        container.style.transition = 'all 300ms ease 0s'

        container.style.transform =
            `translate3d(${elementIndex * elementWidth * -1}px, 0px, 0px)`
        touchingPositionPageX = 0
        touchStartScrollLeft = 0

        if (amountOfMovement > container.offsetWidth / 6) {
            if (elements.length - 1 < currentSlideNumberProxy.number + 1) return false
            container.style.transform =
                `translate3d(${(elementIndex + 1) * elementWidth * -1}px, 0px, 0px)`
            currentSlideNumberProxy.number += 1
        } else if (amountOfMovement < -(container.offsetWidth / 6)) {
            if (currentSlideNumberProxy.number - 1 < 0) return false
            container.style.transform =
                `translate3d(${(elementIndex - 1) * elementWidth * -1}px, 0px, 0px)`
            currentSlideNumberProxy.number -= 1
        }

        clickingNow = false
    }

    function boxContainerMouseLeave(e, container) {
        if (!clickingNow) return false

        const elements = document.querySelectorAll(`.${e.target.className}`)
        const elementIndex = Array.from(elements).findIndex(item => item === e.target)
        const elementWidth = elements[0].offsetWidth
        const amountOfMovement = clickingPositionPageX - e.pageX

        container.addEventListener('transitionend', () =>
            container.style.transition = 'all 0ms ease 0s')
        container.style.transition = 'all 300ms ease 0s'

        container.style.transform =
            `translate3d(${elementIndex * elementWidth * -1}px, 0px, 0px)`
        touchingPositionPageX = 0
        touchStartScrollLeft = 0

        if (amountOfMovement > container.offsetWidth / 6) {
            if (elements.length - 1 < currentSlideNumberProxy.number + 1) return false
            container.style.transform =
                `translate3d(${(elementIndex + 1) * elementWidth * -1}px, 0px, 0px)`
            currentSlideNumberProxy.number += 1
        } else if (amountOfMovement < -(container.offsetWidth / 6)) {
            if (currentSlideNumberProxy.number - 1 < 0) return false
            container.style.transform =
                `translate3d(${(elementIndex - 1) * elementWidth * -1}px, 0px, 0px)`
            currentSlideNumberProxy.number -= 1
        }

        clickingNow = false
    }

    function prevSlideBtn() {
        const container = document.querySelector('.tweet-twitter_picture_zoom-container')
        const elements = document.querySelectorAll(`.tweet-twitter_picture_zoom-element_img`)
        const elementWidth = elements[0].offsetWidth
        const elementIndex = currentSlideNumberProxy.number

        container.addEventListener('transitionend', () =>
            container.style.transition = 'all 0ms ease 0s')
        container.style.transition = 'all 300ms ease 0s'

        container.style.transform =
            `translate3d(${elementIndex * elementWidth * -1}px, 0px, 0px)`
        if (currentSlideNumberProxy.number - 1 < 0) return false
        container.style.transform =
            `translate3d(${(elementIndex - 1) * elementWidth * -1}px, 0px, 0px)`
        currentSlideNumberProxy.number -= 1

        setTimeout(() => {
            AverageColorByImageOnTweetTwitterPictureZoom()
        }, 0);
    }

    function nextSlideBtn() {
        const container = document.querySelector('.tweet-twitter_picture_zoom-container')
        const elements = document.querySelectorAll(`.tweet-twitter_picture_zoom-element_img`)
        const elementWidth = elements[0].offsetWidth
        const elementIndex = currentSlideNumberProxy.number

        container.addEventListener('transitionend', () =>
            container.style.transition = 'all 0ms ease 0s')
        container.style.transition = 'all 300ms ease 0s'

        container.style.transform =
            `translate3d(${elementIndex * elementWidth * -1}px, 0px, 0px)`
        if (elements.length - 1 < currentSlideNumberProxy.number + 1) return false
        container.style.transform =
            `translate3d(${(elementIndex + 1) * elementWidth * -1}px, 0px, 0px)`
        currentSlideNumberProxy.number += 1

        setTimeout(() => {
            AverageColorByImageOnTweetTwitterPictureZoom()
        }, 0);
    }

    function jumpToSlide(jumpToSlideNumber) {
        const container = document.querySelector('.tweet-twitter_picture_zoom-container')
        const elements = document.querySelectorAll(`.tweet-twitter_picture_zoom-element_img`)
        const elementWidth = elements[0].offsetWidth
        const elementIndex = jumpToSlideNumber

        container.style.transition = 'all 0ms ease 0s'

        container.style.transform =
            `translate3d(${elementIndex * elementWidth * -1}px, 0px, 0px)`

        currentSlideNumberProxy.number = jumpToSlideNumber

        setTimeout(() => {
            AverageColorByImageOnTweetTwitterPictureZoom()
        }, 0);
    }

    function tweetTwitterPictureZoomOpen(currentImgNumber) {
        if (localStorage.getItem('twitter-reduce_animation') === null) {
            const ttpze = document.querySelectorAll('.tweet-twitter_picture_zoom-element')
            const targetTtpze = ttpze[currentImgNumber]
            if (targetTtpze.classList && targetTtpze.classList.contains('fadeInUp')) {
                targetTtpze.classList.remove('fadeOutUp')
            }
            targetTtpze.classList.add('animated', 'fadeInUp')
        }
        const body = document.querySelector('body')
        body.style.marginRight = `${window.innerWidth - body.offsetWidth}px`
        body.style.overflowY = 'hidden'
    }

    function tweetTwitterPictureZoomClose() {
        if (localStorage.getItem('twitter-reduce_animation') === null) {
            const ttpze = document.querySelectorAll('.tweet-twitter_picture_zoom-element')
            for (let index = 0; index < ttpze.length; index++) {
                const element = ttpze[index];
                if (element.classList && element.classList.contains('fadeOutUp')) {
                    element.classList.remove('fadeOutUp')
                }
                element.classList.add('animated', 'fadeOutUp')
                element.addEventListener('animationend', e => {
                    if (e.animationName === 'fadeOutUp') {
                        const tweet_twitter_picture_zoom =
                            document.querySelector('.tweet-twitter_picture_zoom')
                        if (tweet_twitter_picture_zoom.style.display === 'flex') {
                            tweet_twitter_picture_zoom.style.display = 'none'
                        }
                    }
                })
            }
        }
        const body = document.querySelector('body')
        body.style.marginRight = ''
        body.style.overflowY = ''
        if (localStorage.getItem('twitter-reduce_animation') === null) return false
        const tweet_twitter_picture_zoom =
            document.querySelector('.tweet-twitter_picture_zoom')
        if (tweet_twitter_picture_zoom.style.display === 'flex') {
            tweet_twitter_picture_zoom.style.display = 'none'
        }
    }

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
        const keycode = e.keyCode
        if (keycode === 37 || keycode === 39) {
            if (`/${location.pathname.replace(location.origin, '').split('/')[1]}` === '/twitter') {
                if (document.querySelector('.tweet-twitter_picture_zoom').style.display !== 'none') {
                    if (keycode === 37) {
                        prevSlideBtn()
                    } else if (keycode === 39) {
                        nextSlideBtn()
                    }
                }
            }
        }
    })

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
    }

    let selectExistOwnListResutId = ''

    document.addEventListener('click', e => {
        if (findParents(e.target, 'select_exist_own_list-list')) {
            const target = findParents(e.target, 'select_exist_own_list-list')
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
        if (findParents(e.target, 'startTwitter')) {
            CheckTwitterWelcomeResult()
        }
    })

    function CheckTwitterWelcomeResult() {
        const twittterCreateListName = document.querySelector('.twitter_create_list-name').value
        const twitterCreateListDescription = document.querySelector('.twitter_create_list-description').value
        const twitterCreateListMode = document.querySelector('.twitter_create_list-mode').querySelector('input').checked
        let is_send_ok = false

        if (twittterCreateListName === '' && selectExistOwnListResutId === '') {
            alert('Create Something.')
        } else if (twittterCreateListName !== '' && selectExistOwnListResutId !== '') {
            alert('only select one.')
        } else {
            is_send_ok = true
        }
        console.table(twittterCreateListName, twitterCreateListDescription, twitterCreateListMode)
        if (is_send_ok === true) {
            if (twittterCreateListName !== '') {
                SendTwitterWelcomeResult('CreateNewList', {
                    'twittterCreateListName': twittterCreateListName,
                    'twitterCreateListDescription': twitterCreateListDescription,
                    'twitterCreateListMode': twitterCreateListMode,
                })
            } else if (selectExistOwnListResutId !== '') {
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

    // twitter_anchor
    document.addEventListener('click', e => {
        if (findParents(e.target, 'twitter_anchor')) {
            if (tweetTwitterPictureClick) {
                tweetTwitterPictureClick = false
                return false;
            }
            var twitterAnchorContent = findParents(e.target, 'twitter_anchor')

            if (window.getSelection().toString() !== '') return false;
            var targetPage = twitterAnchorContent.getAttribute('href')
            targetPage = targetPage.replace(location.origin, '')
            var currentPage = location.href;
            currentPage = currentPage.replace(location.origin, '')
            var state = {
                'targetPage': targetPage,
                'currentPage': currentPage,
                'changeLocation': '#main'
            };
            let replaceState = Object.assign({}, history.state)
            replaceState['scrollTop'] = window.scrollY
            history.replaceState(replaceState, null, currentPage)
            scanTweetHeight()
            history.pushState(state, null, targetPage);

            var twitterUserScreenName = twitterAnchorContent.dataset['twitter_userScreen_name']
            var tweetId = twitterAnchorContent.dataset['tweet_id']
            if (twitterUserScreenName !== undefined) changeContent(targetPage, 'twitter_user', twitterUserScreenName);
            else if (tweetId !== undefined) changeContent(targetPage, 'tweet', tweetId)
            else changeContent(targetPage);
            window.scrollTo(0, 0)
            e.preventDefault()
        }
    })

    function changeContent(href, anchorMode, anchorContext) {
        document.title = 'Aqua Projects - ' + location.pathname.substring(1)
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')
        if (anchorMode === 'twitter_user') changeContentTwitterUser(anchorContext)
        else if (anchorMode === 'tweet') changeContentTweet(anchorContext)
        else {
            const changeLocation = document.querySelector('#main')
            while (changeLocation.firstChild) changeLocation.removeChild(changeLocation.firstChild)
            const loader = document.createElement('div')
            loader.className = 'loader'
            changeLocation.append(loader)
        }
        (() => {
            const removeClass = 'bg-danger'
            if (ajaxProgressBar.classList && ajaxProgressBar.classList.contains(removeClass)) {
                ajaxProgressBar.classList.remove(removeClass)
            }
            ajaxProgressBar.parentNode.style.visibility = ''
            ajaxProgressBar.style.width = '80%'
        })()
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
                ajaxProgressBar.parentNode.style.visibility = 'hidden'
                ajaxProgressBar.style.width = '0%'
                ajaxProgressBar.style.transition = ''
            }, 200)
        }).catch(err => {
            console.error(err)
            showError()
        })

        function changeContentTwitterUser(screen_name) {
            // The following will be changed:
            // twitter_user -> Add id as twitter_user.
            // .twitter_title-home-text -> Add twitter user name.
            // .twitter_user-background_image -> Expand image.
            // .twitter_user-profile_image -> css: position, margin.
            // .twitter_user-profile_image -> Add .tweet-twitter_icon.
            // .twitter_user-profile_image .img -> Add .ap-theme, ap-theme-{color}-background.
            // .twitter_user-profile_image .img -> css: width, marginTop, padding.
            // .twitter_user-profile_image .img -> css: height: '', top: ''.
            // .twitter_user-name_screen_name -> Expand .twitter_user-name, .twitter_user-screen_name.
            // .twitter_user-lists_follow_button -> css: padding: ''.
            // .twitter_user-location -> css: display, flexWrap.
            // .twitter_user-main -> css: padding.
            // .twitter_user-profile_timelines_navigation-block -> css: display: ''.
            // .twitter_user-profile_timelines_navigation-tweets -> Add .twitter_user-profile_timelines_navigation-selected.
            // .timeline -> Add loading html.
            // .twitter_user -> call setTweetCreated_at.
            const twitterUser = document.querySelectorAll('.twitter_user')
            const twitterTitle = document.querySelector('.twitter_title-block').outerHTML
            for (let index = 0; index < twitterUser.length; index++) {
                const element = twitterUser[index];
                if (element.dataset['twitter_userScreen_name'] === screen_name) {
                    const timeline = document.querySelector('.timeline')
                    timeline.innerHTML = element.outerHTML

                    var twitterUserContent = document.querySelector('.timeline .twitter_user')
                    twitterUserContent.id = 'twitter_user'

                    timeline.insertAdjacentHTML('afterbegin', twitterTitle)
                    var twitterUserName = document.querySelector('.timeline .twitter_user-name > span').innerHTML
                    document.querySelector('.twitter_title-home-text').innerHTML = twitterUserName

                    const tubgimg = timeline.querySelector('.twitter_user-background_image')
                    const tubgimgcode = `<img src="${tubgimg.dataset['imgSrc']}" loading="lazy">`
                    tubgimg.insertAdjacentHTML('beforeend', tubgimgcode)

                    tupimg = timeline.querySelector('.twitter_user-profile_image')
                    tupimg.style.margin = '10px 1rem'
                    tupimg.style.position = 'relative'
                    tupimg.classList.add('twitter_user-twitter_icon')
                    const tupimgimg = tupimg.querySelector('img')
                    const apTheme =
                        localStorage.getItem('ap-theme') === 'dark' ? 'dark' :
                        localStorage.getItem('ap-theme') === 'light' ? 'light' :
                        'default'
                    tupimgimg.classList.add('ap-theme')
                    tupimgimg.classList.add(`ap_theme-${apTheme}-background`)
                    tupimgimg.style.width = '25%'
                    tupimgimg.style.height = ''
                    tupimgimg.style.top = ''
                    tupimgimg.style.marginTop = '-15.5%'
                    tupimgimg.style.padding = '4px'
                    tupimg.insertBefore(tupimgimg, tupimg.firstChild)
                    tupimg.querySelector('a').remove()
                    tupimg.querySelector('.twitter_user-lists_follow_button').style.padding = ''

                    const tunsn = timeline.querySelector('.twitter_user-name_screen_name')
                    const tunsna = tunsn.querySelector('a')
                    tunsn.querySelector('.twitter_user-name').style.fontSize = '1.2rem'
                    tunsn.insertBefore(tunsn.querySelector('.twitter_user-name'), tunsna)
                    tunsn.insertBefore(tunsn.querySelector('.twitter_user-screen_name'), tunsna)
                    tunsna.remove()

                    const tul = timeline.querySelector('.twitter_user-local')
                    tul.style.display = 'flex'
                    tul.style.flexWrap = 'wrap'

                    timeline.querySelector('.twitter_user-main').style.padding = '0 1rem'

                    timeline.querySelector('.twitter_user-profile_timelines_navigation-block').style.display = ''

                    twitterUserProfileTimelineNavigationSelected(
                        timeline.querySelector('.twitter_user-profile_timeline_navigation-tweets')
                    )

                    const loader = document.createElement('div')
                    loader.className = 'loader'
                    const formatTimeline = document.createElement('div')
                    formatTimeline.className = 'format_timeline'
                    formatTimeline.appendChild(loader)
                    timeline.appendChild(formatTimeline)

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
                    timelineArea.insertAdjacentHTML('beforeend', '<div class="loader"></div>')
                    return false
                }
            }
        }
    }

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
        } else {
            refreshtwitterProfile(href)
        }
    }

    function refreshtwitterProfile(href) {
        return new Promise((resolve, reject) => {
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
                resolve(data)
            }).catch(err => {
                alert(err)
                reject(err)
            })
        })
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

    document.addEventListener('mouseover', e => {
        if (findParents(e.target, 'tweet-twitter_user_name')) {
            const target = findParents(e.target, 'tweet-twitter_user_name')
            const y = target.offsetTop + target.clientHeight
            target.querySelector('.tweet-twitter_user_tooltip').style.display = 'block'
            target.querySelector('.tweet-twitter_user_tooltip').style.top = y
        }
    }, true)

    document.addEventListener('mouseleave', e => {
        if (findParents(e.target, 'tweet-twitter_user_name')) {
            const target = findParents(e.target, 'tweet-twitter_user_name')
            target.querySelector('.tweet-twitter_user_tooltip').style.display = ''
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
            let follow_status = false
            if (target.dataset['twitter_userFollow_status'] === 'true') follow_status = true
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
            const resTweetTwitterSocial = responseNode.querySelectorAll('.tweet-twitter_social')
            const docTweetTwitterFavorite = document.querySelectorAll('.tweet-twitter_favorite')
            for (let index = 0; index < docTweetTwitterFavorite.length; index++) {
                const element = docTweetTwitterFavorite[index];
                const docTweetTwitterSocial = findParents(element, 'tweet-twitter_social')
                if (element.dataset['tweet_id'] === tweet_id) {
                    for (let index = 0; index < resTweetTwitterSocial.length; index++) {
                        const resElement = resTweetTwitterSocial[index];
                        const resTweetId = resElement.querySelector('.tweet-twitter_favorite')
                            .dataset['tweet_id']
                        if (resTweetId === tweet_id) {
                            docTweetTwitterSocial.insertAdjacentElement('afterend', resElement)
                            docTweetTwitterSocial.remove()
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
            const resTweetTwitterSocial = responseNode.querySelectorAll('.tweet-twitter_social')
            const docTweetTwitterFavorite = document.querySelectorAll('.tweet-twitter_favorite')
            for (let index = 0; index < docTweetTwitterFavorite.length; index++) {
                const element = docTweetTwitterFavorite[index];
                const docTweetTwitterSocial = findParents(element, 'tweet-twitter_social')
                if (element.dataset['tweet_id'] === tweet_id) {
                    for (let index = 0; index < resTweetTwitterSocial.length; index++) {
                        const resElement = resTweetTwitterSocial[index];
                        const resTweetId = resElement.querySelector('.tweet-twitter_favorite')
                            .dataset['tweet_id']
                        if (resTweetId === tweet_id) {
                            docTweetTwitterSocial.insertAdjacentElement('afterend', resElement)
                            docTweetTwitterSocial.remove()
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
            const resTweetTwitterSocial = responseNode.querySelectorAll('.tweet-twitter_social')
            const docTweetTwitterRetweet = document.querySelectorAll('.tweet-twitter_retweet')
            for (let index = 0; index < docTweetTwitterRetweet.length; index++) {
                const element = docTweetTwitterRetweet[index];
                const docTweetTwitterSocial = findParents(element, 'tweet-twitter_social')
                if (element.dataset['tweet_id'] === tweet_id) {
                    for (let index = 0; index < resTweetTwitterSocial.length; index++) {
                        const resElement = resTweetTwitterSocial[index];
                        const resTweetId = resElement.querySelector('.tweet-twitter_retweet')
                            .dataset['tweet_id']
                        if (resTweetId === tweet_id) {
                            docTweetTwitterSocial.insertAdjacentElement('afterend', resElement)
                            docTweetTwitterSocial.remove()
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
            const resTweetTwitterSocial = responseNode.querySelectorAll('.tweet-twitter_social')
            const docTweetTwitterRetweet = document.querySelectorAll('.tweet-twitter_retweet')
            for (let index = 0; index < docTweetTwitterRetweet.length; index++) {
                const element = docTweetTwitterRetweet[index];
                const docTweetTwitterSocial = findParents(element, 'tweet-twitter_social')
                if (element.dataset['tweet_id'] === tweet_id) {
                    for (let index = 0; index < resTweetTwitterSocial.length; index++) {
                        const resElement = resTweetTwitterSocial[index];
                        const resTweetId = resElement.querySelector('.tweet-twitter_retweet')
                            .dataset['tweet_id']
                        if (resTweetId === tweet_id) {
                            docTweetTwitterSocial.insertAdjacentElement('afterend', resElement)
                            docTweetTwitterSocial.remove()
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
            window.scrollTo(0, 0)
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
        const formatTimeline = document.querySelector('.format_timeline')
        if (formatTimeline) {
            Array.from(formatTimeline.children).forEach(element => {
                element.remove()
            })
        }
        const loader = document.createElement('div')
        loader.className = 'loader'
        document.querySelector('.format_timeline').appendChild(loader)
    }

    function twitterUserProfileTimelineNavigationFetch(href, useCache = true) {
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')
        if (ajaxProgressBar.classList && ajaxProgressBar.classList.contains('bg-danger')) {
            ajaxProgressBar.classList.remove('bg-danger')
        }
        ajaxProgressBar.parentNode.style.visibility = ''

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
                    ajaxProgressBar.parentNode.style.visibility = 'hidden'
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
                ajaxProgressBar.parentNode.style.visibility = 'hidden'
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
            const tsb = findParents(e.target, 'twitter-search_box')
            const twitterSearchBoxBorder = tsb.querySelector('.twitter-search_box-border')
            const twitterSearchBoxIcon = tsb.querySelector('.twitter-search_box-icon')
            const twitterSearchBoxInput = tsb.querySelector('.twitter-search_box-input')
            const twitterSearchBoxClose = tsb.querySelector('.twitter-search_box-close')

            twitterSearchBoxBorder.style.borderColor = '#1da1f2'
            twitterSearchBoxIcon.style.color = '#1da1f2'
            if (twitterSearchBoxInput.value !== '') {
                twitterSearchBoxClose.style.display = 'flex'
            }
        }
    }, true)

    document.addEventListener('blur', e => {
        if (e.target.classList.contains('twitter-search_box-input')) {
            const tsb = findParents(e.target, 'twitter-search_box')
            const twitterSearchBoxBorder = tsb.querySelector('.twitter-search_box-border')
            const twitterSearchBoxIcon = tsb.querySelector('.twitter-search_box-icon')
            const twitterSearchBoxInput = tsb.querySelector('.twitter-search_box-input')
            const twitterSearchBoxClose = tsb.querySelector('.twitter-search_box-close')

            twitterSearchBoxBorder.style.borderColor = ''
            twitterSearchBoxIcon.style.color = '#657786'
            twitterSearchBoxClose.style.display = 'none'

            if (twitterSearchBoxInput.dataset['cleared'] === 'true') {
                twitterSearchBoxInput.focus()
                twitterSearchBoxInput.dataset['cleared'] = false
            }
        }
    }, true)

    document.addEventListener('mousedown', e => {
        if (findParents(e.target, 'twitter-search_box-close')) {
            const tsb = findParents(e.target, 'twitter-search_box')
            const twitterSearchBoxInput = tsb.querySelector('.twitter-search_box-input')
            const twitterSearchBoxClose = tsb.querySelector('.twitter-search_box-close')

            twitterSearchBoxInput.value = ''
            twitterSearchBoxInput.dataset['cleared'] = true
            twitterSearchBoxClose.style.display = 'none'
        }
    })

    document.addEventListener('input', e => {
        if (e.target.classList.contains('twitter-search_box-input')) {
            const tsb = findParents(e.target, 'twitter-search_box')
            const twitterSearchBoxInput = tsb.querySelector('.twitter-search_box-input')
            const twitterSearchBoxClose = tsb.querySelector('.twitter-search_box-close')

            if (twitterSearchBoxInput.value !== '') {
                twitterSearchBoxClose.style.display = 'flex'
            } else {
                twitterSearchBoxClose.style.display = 'none'
            }
        }
    })

    document.addEventListener('keydown', e => {
        const keyCode = e.keyCode
        if (keyCode !== 13) return false
        if (`/${location.pathname.replace(location.origin, '').split('/')[1]}` === '/twitter') {
            if (e.target.classList.contains('twitter-search_box-input') && e.target.value !== '') {
                var query = e.target.value
                var href = `/twitter/search?q=${query}`
                twitterUserProfileTimelineNavigationPushState(href)
                twitterSearchLoader()
                window.scrollTo(0, 0)
                twitterUserProfileTimelineNavigationFetch(href, true)
                document.querySelector('.twitter-search_box-input').blur()
                document.querySelector('.twitter_title-home-text').innerHTML = query
            }
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

        document.querySelector('.format_timeline').insertAdjacentHTML(
            'afterbegin', '<div class="loader"></div>'
        )
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'twitter_title-home-search')) {
            const tthb = findParents(e.target, 'twitter_title-home-block')
            const titleText = tthb.querySelector('.twitter_title-home-text')
            const titleSearch = tthb.querySelector('.twitter_title-home-search')
            const titleTwitterProfile = tthb.querySelector('.twitter_title-home-twitter-profile')
            const titleSearchBox = tthb.querySelector('.twitter-search_box')
            const titleSearchBoxInput = tthb.querySelector('.twitter-search_box-input')

            titleText.style.display = 'none'
            titleSearch.style.display = 'none'
            titleTwitterProfile.style.display = 'none'
            titleSearchBox.style.display = ''
            titleSearchBoxInput.value = ''
            titleSearchBoxInput.focus()
        }
    })

    document.addEventListener('click', e => {
        if (findParents(e.target, 'twitter-search_box-back')) {
            const tthb = findParents(e.target, 'twitter_title-home-block')
            const titleText = tthb.querySelector('.twitter_title-home-text')
            const titleSearch = tthb.querySelector('.twitter_title-home-search')
            const titleTwitterProfile = tthb.querySelector('.twitter_title-home-twitter-profile')
            const titleSearchBox = tthb.querySelector('.twitter-search_box')

            titleText.style.display = ''
            titleSearch.style.display = ''
            titleTwitterProfile.style.display = ''
            titleSearchBox.style.display = 'none'
            titleSearchBox.blur()
        }
    })

    document.addEventListener('blur', e => {
        if (e.target.classList.contains('twitter-search_box-input')) {
            if (findParents(e.target, 'twitter_title-home-block')) {
                const twitterTitleHome = findParents(e.target, 'twitter_title-home-block')
                twitterTitleHome.querySelector('.twitter-search_box-back').click()
            }
        }
    }, true)

    document.addEventListener('click', e => {
        if (findParents(e.target, 'twitter_title-home-twitter-profile')) {
            const href = '/twitter/profile'
            const twitterProfileArea = document.querySelector('.twitter-profile')
            if (AquaProjectsCache[href]) {
                if (!twitterProfileArea.firstElementChild) {
                    while (twitterProfileArea.firstChild) {
                        twitterProfileArea.removeChild(twitterProfileArea.firstChild)
                    }
                    twitterProfileArea.insertAdjacentElement(
                        'afterbegin',
                        AquaProjectsCache[href].querySelector('.twitter-profile').cloneNode(true)
                    )
                }
                twitterProfileArea.querySelector('a').click()
            } else {
                refreshtwitterProfile(href).then(() => {
                    twitterProfileArea.querySelector('a').click()
                })
            }
            const ajaxProgressBar = document.querySelector('#ajax-progress-bar')
            ajaxProgressBar.style.width = '80%'
        }
    })

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

    function changeTheme() {
        const body = document.querySelector('body')
        const changeStyles = [
            'border', 'background', 'background-skelton',
            'color-sub', 'ripple', 'logo'
        ]

        if (localStorage.getItem('ap-theme') === 'dark') {
            document.head.children["theme-color"].content = '#15202b'
            body.style.backgroundColor = 'rgb(21, 32, 43)'
            body.style.color = 'rgb(255, 255, 255)'
            changeThemeNode(detectPreviousTheme('dark'), 'dark')
        } else if (localStorage.getItem('ap-theme') === 'light') {
            document.head.children["theme-color"].content = '#ffffff'
            body.style.backgroundColor = 'rgb(255, 255, 255)'
            body.style.color = ''
            changeThemeNode(detectPreviousTheme('light'), 'light')
        } else {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.head.children["theme-color"].content = '#15202b'
                body.style.backgroundColor = 'rgb(21, 32, 43)'
                body.style.color = 'rgb(255, 255, 255)'
                changeThemeNode(detectPreviousTheme('default'), 'default')
            } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                document.head.children["theme-color"].content = '#ffffff'
                body.style.backgroundColor = 'rgb(255, 255, 255)'
                body.style.color = ''
                changeThemeNode(detectPreviousTheme('default'), 'default')
            }
        }

        function detectPreviousTheme(currentTheme) {
            const themes = ['light', 'dark', 'default']
            themes.splice(
                themes.findIndex(item => item === currentTheme), 1
            )
            for (let index = 0; index < changeStyles.length; index++) {
                const element = changeStyles[index]
                for (let index = 0; index < themes.length; index++) {
                    const theme = themes[index];
                    if (document.querySelectorAll(`.ap_theme-${theme}-${element}`).length) {
                        return theme
                    }
                }
            }
        }

        function changeThemeNode(beforeTheme, afterTheme) {
            for (let index = 0; index < changeStyles.length; index++) {
                const element = changeStyles[index];
                changeThemeClass(
                    document.querySelectorAll(`.ap_theme-${beforeTheme}-${element}`),
                    beforeTheme, afterTheme
                )
            }
        }

        function changeThemeClass(nodeList, beforeTheme, afterTheme) {
            for (let index = 0; index < nodeList.length; index++) {
                const element = nodeList[index];
                const changedClassName = element.className.replaceAll(
                    `ap_theme-${beforeTheme}`, `ap_theme-${afterTheme}`
                )
                element.className = changedClassName
            }
        }
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