import { changeTheme, findParents, getCookie, log, error } from './utils.js'
import * as utils from './utils.js'
!(() => {
    window.addEventListener('aquaprojects_popstate', () => {
        if (utils.locationMatch('/twitter')) {
            log('twitter!')
            initTweetIntersectionObserver()
            initTweetPictureIntersectionObserver()
            initTweetTwitterUserIconIntersectionObserver()
            initLastTweetIntersectionObserver()
            makeTwitterUserTwitterIconClear()
            setTweetCreated_at()
            twitterProfile()
            twitterTrends()
            changeTwitterTimelineBackgroundSize()
            changeTheme()
            log('twitter! popstate event finished.')
        }
    })
    if (utils.locationMatch('/twitter')) {
        window.dispatchEvent(new Event('aquaprojects_popstate'))
    }

    // setInterval(() => {
    //     if (location.href.replace(location.origin, '') === '/twitter') {
    //         var currentTime = new Date()
    //         log(currentTime)
    //         var tweet_id = $('.format_timeline > div:first').data('tweet_id');
    //         if (document.hidden === false) {
    //             loadMoreTweet(tweet_id, 'new');
    //         }
    //     }
    // }, 60 * 1000);

    var tweetPictureIntersectionObserver = null

    function initTweetPictureIntersectionObserver() {
        if (tweetPictureIntersectionObserver) {
            try {
                tweetPictureIntersectionObserver.disconnect()
                tweetPictureIntersectionObserver = null
            } catch (e) {
                error(e)
            }
        }
        tweetPictureIntersectionObserver = new IntersectionObserver(
            handleIntersect
        )
        const ttps = document.querySelectorAll('.tweet-twitter_picture')
        for (let index = 0; index < ttps.length; index++) {
            const element = ttps[index]
            tweetPictureIntersectionObserver.observe(element)
        }

        function handleIntersect(entries, observer) {
            entries.forEach(element => {
                if (!element.isIntersecting) {
                    return
                }
                if (!localStorage.getItem('twitter-view_pictures')) {
                    return
                }
                const ttp = element.target
                const ttpSrc = ttp.dataset.src
                ttp.src = ttpSrc
                ttp.crossOrigin = 'anonymous'
                observer.unobserve(ttp)
            })
        }
    }

    var tweetTwitterUserIconIntersectionObserver = null

    function initTweetTwitterUserIconIntersectionObserver() {
        if (tweetTwitterUserIconIntersectionObserver) {
            try {
                tweetTwitterUserIconIntersectionObserver.disconnect()
                tweetTwitterUserIconIntersectionObserver = null
            } catch (e) {
                error(e)
            }
        }
        tweetTwitterUserIconIntersectionObserver = new IntersectionObserver(
            handleIntersect
        )
        var ttui = document.querySelectorAll('.tweet-twitter_icon img')
        for (let index = 0; index < ttui.length; index++) {
            const element = ttui[index]
            tweetTwitterUserIconIntersectionObserver.observe(element)
        }

        function handleIntersect(entries, observer) {
            entries.forEach(element => {
                if (!element.isIntersecting) {
                    return
                }
                if (!localStorage.getItem('twitter-view_clear_icon')) {
                    return
                }
                const ttui = element.target
                const ttuiSrc = ttui.src
                ttui.src = ttuiSrc.replace('_normal', '_400x400')
                ttui.crossOrigin = 'anonymous'
                observer.unobserve(ttui)
            })
        }
    }

    function makeTwitterUserTwitterIconClear() {
        const tuti = document.querySelector('.twitter_user-twitter_icon img')
        const tpi = document.querySelectorAll('.twitter-profile img')
        const twitterUserTwitterIcon = tuti
        const twitterProfileIcon = Array.from(tpi)
        if (twitterUserTwitterIcon) {
            const tutiSrc = twitterUserTwitterIcon.src
            twitterUserTwitterIcon.src = tutiSrc.replace('_normal', '_400x400')
        }
        if (twitterProfileIcon) {
            twitterProfileIcon.forEach(element => {
                const elementSrc = element.src
                element.src = elementSrc.replace('_normal', '_400x400')
            })
        }
    }

    function initTweetIntersectionObserver() {
        setTimeout(() => {
            // Whether load tweets object?
            if (document.querySelector('.twitter_new_tweets_of_no_content')) {
                calculateTweetsToDisplayFirst()
                optimizedDispatchEvent()

                setTimeout(() => {
                    const tntonc = document.querySelector(
                        '.twitter_new_tweets_of_no_content'
                    )
                    const tweet = document.querySelector('.tweet')
                    if (!tntonc || !tweet) return
                    const is_tweetId = document.querySelector(
                        '.format_timeline .tweet'
                    ).dataset['tweet_id']
                    is_tweetId ? loadTheOthersTweet() : loadCacheOfMainArea()
                    window.dispatchEvent(new Event('aquaprojects_popstate'))

                    setTimeout(() => {
                        scanTweetHeight()
                        const currentPage = utils.getCurrentPage()
                        const replaceState = Object.assign({}, history.state)
                        replaceState['scrollTop'] = window.scrollY
                        history.replaceState(replaceState, null, currentPage)
                    }, 0)

                    function loadCacheOfMainArea() {
                        const href = location.href.replace(location.origin, '')
                        utils.repaintNode(href, '#main')
                    }
                }, 0)
            } else {
                scanTweetHeight()
            }

            function optimizedDispatchEvent() {
                initTweetIntersectionObserver()
                initTweetPictureIntersectionObserver()
                initTweetTwitterUserIconIntersectionObserver()
                initLastTweetIntersectionObserver()
                makeTwitterUserTwitterIconClear()
                setTweetCreated_at()
                changeTheme()
            }
        }, 0)
    }

    function calculateTweetsToDisplayFirst() {
        let twitter_target_tweet_id = 0
        const twitter_each_tweets_height =
            history.state['twitter_each_tweets_height']
        const format_timeline_height = history.state['format_timeline_height']

        const href = location.href.replace(location.origin, '')
        const cacheNodeNoCopy = window.AquaProjectsCache[href]
        const cacheNode = cacheNodeNoCopy.querySelector('.format_timeline')
        const cacheTweets = cacheNode.querySelectorAll('.tweet')
        const correctCacheTweets = []
        let newTweetOfNoContentHeight = 0

        // Collect tweet object not contain quoted tweet
        for (let index = 0; index < cacheTweets.length; index++) {
            const element = cacheTweets[index]
            if (!element.parentNode.classList.length === 0) {
                continue
            }
            if (!element.parentNode.classList.contains('format_timeline')) {
                continue
            }
            correctCacheTweets.push(element)
        }

        // Search twitter_target_tweet_id
        const searchTwitterTargetTweetId = () => {
            const targetScrollY = window.scrollY
            const teth = twitter_each_tweets_height

            if (!teth) {
                twitter_target_tweet_id =
                    correctCacheTweets[0].dataset['tweet_id']
                return
            }

            const totalEachHeight = []
            for (let index = 0; index < teth.length; index++) {
                const element = teth[index]
                let elementTopY =
                    index === 0
                        ? element['tweet_height']
                        : totalEachHeight[index - 1]['tweet_height'] +
                          element['tweet_height']
                totalEachHeight.push({
                    tweet_id: element['tweet_id'],
                    tweet_height: elementTopY,
                })
            }

            const diffEachHeight = []
            for (let index = 0; index < totalEachHeight.length; index++) {
                const element = totalEachHeight[index]
                let diff = targetScrollY - element['tweet_height']
                diffEachHeight.push({
                    tweet_id: element['tweet_id'],
                    diff: diff,
                })
            }

            let minDiff = 0
            let targetTweetData = {}
            for (let index = 0; index < diffEachHeight.length; index++) {
                const element = diffEachHeight[index]
                if (index === 0) {
                    minDiff = Math.abs(element['diff'])
                    targetTweetData = element
                } else {
                    minDiff = Math.abs(Math.min(element['diff'], minDiff))
                    targetTweetData =
                        minDiff === element['diff'] ? element : targetTweetData
                }
            }

            twitter_target_tweet_id = targetTweetData['tweet_id']
        }
        searchTwitterTargetTweetId()

        // Collect tweets to display
        const tweetIndex = correctCacheTweets
            .map(item => item.dataset['tweet_id'])
            .findIndex(item => item === twitter_target_tweet_id)
        const cctl = correctCacheTweets.length
        const calculatedStartIndex = tweetIndex - 10
        const calculatedEndIndex = tweetIndex + 10 + 1
        const start = calculatedStartIndex < 0 ? 0 : calculatedStartIndex
        const end = calculatedEndIndex > cctl ? cctl : calculatedEndIndex
        const slicedTweets = correctCacheTweets.slice(start, end)

        // Calculate twitter_new_tweets_of_no_content height
        const calculateTwitterNewTweetsOfNoContentHeight = () => {
            if (!twitter_each_tweets_height) {
                newTweetOfNoContentHeight = 0
                return
            }

            const newTweetOfNoContentIndedx = twitter_each_tweets_height
                .map(item => item['tweet_id'])
                .findIndex(item => item === slicedTweets[0].dataset['tweet_id'])
            const newTweetOfNoContentHeightList = twitter_each_tweets_height.slice(
                0,
                newTweetOfNoContentIndedx
            )
            const ntonchl = newTweetOfNoContentHeightList
            for (let index = 0; index < ntonchl.length; index++) {
                const element = ntonchl[index]
                newTweetOfNoContentHeight += element['tweet_height']
            }
        }
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
            const element = slicedTweets[index].cloneNode(true)
            displayingTweets.appendChild(element)
        }

        // Add twitter_old_tweets_of_no_content
        const oldTweetOfNocontent = document.createElement('div')
        oldTweetOfNocontent.className = 'twitter_old_tweets_of_no_content'

        ft.style.height = format_timeline_height
            ? `${format_timeline_height}px`
            : ''
        ft.appendChild(newTweetOfNoContent)
        ft.appendChild(displayingTweets)
        ft.appendChild(oldTweetOfNocontent)

        // Show tweet-twitter_picture when they were downloaded.
        if (localStorage.getItem('twitter-view_pictures')) {
            const ttp = document.querySelectorAll('.tweet-twitter_picture')
            for (let index = 0; index < ttp.length; index++) {
                const element = ttp[index]
                if (element.complete) {
                    element.src = element.dataset['src']
                }
            }
        }
    }

    function loadTheOthersTweet() {
        const href = location.href.replace(location.origin, '')
        const dataNode = window.AquaProjectsCache[href]
        const tweets = dataNode.querySelectorAll('.tweet')
        const correctTweets = []
        const newTweets = []
        const oldTweets = []
        var displayedNewTweet = null
        var displayedOldTweet = null

        const displayedTweets = document.querySelectorAll('.tweet')
        const correctDisplayedTweets = []

        for (let index = 0; index < displayedTweets.length; index++) {
            const element = displayedTweets[index]
            if (element.parentNode.classList.contains('quoted_status')) {
                continue
            }
            correctDisplayedTweets.push(element)
        }

        for (let index = 0; index < tweets.length; index++) {
            const element = tweets[index]
            if (element.parentNode.classList.contains('quoted_status')) {
                continue
            }
            correctTweets.push(element)
        }

        for (let index = 0; index < correctDisplayedTweets.length; index++) {
            const element = correctDisplayedTweets[index]
            if (!element.dataset['tweet_id']) {
                continue
            }
            if (!displayedNewTweet) {
                displayedNewTweet = correctDisplayedTweets[index]
            }
            displayedOldTweet =
                correctDisplayedTweets[correctDisplayedTweets.length - 1]
        }

        // Load new tweets from data into the memory.
        for (let index = 0; index < correctTweets.length; index++) {
            const element = correctTweets[index]
            if (!element.dataset['tweet_id']) {
                continue
            }
            if (
                element.dataset['tweet_id'] ===
                displayedNewTweet.dataset['tweet_id']
            ) {
                break
            }
            newTweets.push(element)
        }

        // Load old tweets from data into the memory.
        !(() => {
            var isPassedTweet = false
            for (let index = 0; index < correctTweets.length; index++) {
                const element = correctTweets[index]
                if (!element.dataset['tweet_id']) {
                    continue
                }
                if (isPassedTweet) {
                    oldTweets.push(element)
                }
                if (
                    element.dataset['tweet_id'] ===
                    displayedOldTweet.dataset['tweet_id']
                ) {
                    isPassedTweet = true
                }
            }
        })()

        const formatTimeline = document.querySelector('.format_timeline')

        // Create new tweets document fragement
        const formatTimelineNewTweets = document.createDocumentFragment()
        for (let index = 0; index < newTweets.length; index++) {
            const element = newTweets[index].cloneNode(true)
            formatTimelineNewTweets.appendChild(element)
        }

        // Create old tweets document fragement
        const formatTimelineOldTweets = document.createDocumentFragment()
        for (let index = 0; index < oldTweets.length; index++) {
            const element = oldTweets[index].cloneNode(true)
            formatTimelineOldTweets.appendChild(element)
        }

        formatTimeline.style.height = ''
        formatTimeline
            .querySelector('.twitter_new_tweets_of_no_content')
            .remove()
        formatTimeline
            .querySelector('.twitter_old_tweets_of_no_content')
            .remove()
        formatTimeline.insertBefore(
            formatTimelineNewTweets,
            formatTimeline.firstChild
        )
        formatTimeline.appendChild(formatTimelineOldTweets)
    }

    function scanTweetHeight() {
        const tweets = document.querySelectorAll('.tweet')
        const formatTimeline = document.querySelector('.format_timeline')
        const currentPage = utils.getCurrentPage()
        const twitter_each_tweets_height = []
        for (let index = 0; index < tweets.length; index++) {
            const element = tweets[index]
            if (!element.parentNode.classList.contains('format_timeline')) {
                continue
            }
            twitter_each_tweets_height.push({
                tweet_id: element.dataset['tweet_id'],
                tweet_height: element.offsetHeight,
            })
        }
        !(() => {
            const replaceState = Object.assign({}, history.state)
            replaceState[
                'twitter_each_tweets_height'
            ] = twitter_each_tweets_height
            replaceState['format_timeline_height'] = formatTimeline.scrollHeight
            history.replaceState(replaceState, null, currentPage)
        })()
        log(twitter_each_tweets_height)
        return twitter_each_tweets_height
    }

    var lastTweetIntersectionObserver = null

    function initLastTweetIntersectionObserver() {
        if (lastTweetIntersectionObserver) {
            try {
                lastTweetIntersectionObserver.disconnect()
                lastTweetIntersectionObserver = null
            } catch (e) {
                error(e)
            }
        }
        lastTweetIntersectionObserver = new IntersectionObserver(
            handleIntersect
        )
        const formatTimeline = document.querySelector('.format_timeline')
        const ftt = document.querySelectorAll('.format_timeline > .tweet')
        const fttl = ftt.length
        const lastTweetSelector = `.tweet:nth-child(${fttl})`
        const lastTweet = formatTimeline.querySelector(lastTweetSelector)
        if (formatTimeline.dataset['since_id'] && lastTweet) {
            lastTweetIntersectionObserver.observe(lastTweet)
        }

        function handleIntersect(entries, observer) {
            entries.forEach(element => {
                if (!element.isIntersecting) {
                    return
                }
                const maxId = formatTimeline.dataset['max_id']
                downloadMoreTweet('', maxId)
                observer.unobserve(element.target)
            })
        }
    }

    async function downloadMoreTweet(sinceId, maxId) {
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')
        const href = location.href.replace(location.origin, '')
        const parameters = buildParameter({
            since_id: sinceId,
            max_id: maxId,
        })
        const saveCacheAdress = `${href}?${parameters}`

        class recalculateDownloadTweetId extends error {
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

        try {
            const fetching = fetch(saveCacheAdress, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
            })

            const response = await fetching
            if (response.ok === false) {
                error(response)
                throw new recalculateDownloadTweetId(
                    'Not found timeline',
                    sinceId,
                    maxId
                )
            }
            const data = await response.text()

            // Save Cache.
            utils.saveApCache(saveCacheAdress, data)
            if (href !== location.href.replace(location.origin, '')) {
                log('It seems that you moved to a different page first.')
                return
            }

            // Insert tweets to main.
            const ftSelectors = '.format_timeline'
            const cache = utils.getApCacheNode(saveCacheAdress, ftSelectors)
            const cacheTweets = Array.from(cache.children)
            const index = cacheTweets.findIndex(
                element => maxId === element.dataset['tweet_id']
            )
            const formatTimelineMain = utils.getApCacheNode(href, ftSelectors)
            if (sinceId) {
                cacheTweets
                    .slice(0, index + 1)
                    .reverse()
                    .forEach(element =>
                        formatTimelineMain.insertBefore(
                            element.cloneNode(true),
                            formatTimelineMain.querySelector('.tweet')
                        )
                    )
            } else if (maxId) {
                cacheTweets
                    .slice(index, cacheTweets.length)
                    .forEach(element =>
                        formatTimelineMain.appendChild(element.cloneNode(true))
                    )
            }

            // Create tweets document fragement.
            const tweets = document.createDocumentFragment()
            if (sinceId) {
                cacheTweets
                    .slice(0, index + 1)
                    .forEach(element =>
                        tweets.appendChild(element.cloneNode(true))
                    )
            } else if (maxId) {
                cacheTweets
                    .slice(index, cacheTweets.length)
                    .forEach(element =>
                        tweets.appendChild(element.cloneNode(true))
                    )
            }

            // Insert tweets.
            const formatTimeline = document.querySelector('.format_timeline')
            if (sinceId) {
                const selectors = '.format_timeline > .tweet'
                const refChild = document.querySelector(selectors)
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
        } catch (err) {
            if (err instanceof recalculateDownloadTweetId) {
                hundleRecalculateDownloadTweetId(err)
            }
        }

        function buildParameter(params) {
            let parameters = ''
            Object.keys(params).forEach((key, index, array) => {
                if (params[key]) parameters += `${key}=${params[key]}&`
                if (index === array.length - 1)
                    parameters = parameters.slice(0, -1)
            })
            return parameters
        }

        function hundleRecalculateDownloadTweetId(err) {
            const selectors = '.format_timeline > .tweet'
            const tweets = document.querySelectorAll(selectors)

            // Search orignal tweet
            let foundOriginalTweet = null
            const ta = err.maxId
                ? Array.from(tweets)
                : Array.from(tweets).reverse()

            ta.forEach(t => {
                const tca = Array.from(t.children)
                tca.forEach(tc => {
                    const tcca = Array.from(tc)
                    tcca.forEach(tcc => {
                        const tccClassName = tcc.className
                        const ttrhStr = 'tweet-twitter_retweet_header'
                        if (tccClassName.indexOf(ttrhStr) === -1) {
                            foundOriginalTweet = t
                        }
                    })
                })
            })

            if (err.sinceId) {
                downloadMoreTweet(foundOriginalTweet.dataset['tweet_id'])
            } else if (err.maxId) {
                downloadMoreTweet('', foundOriginalTweet.dataset['tweet_id'])
            }
        }
    }

    let isTweetTwitterPictureClick = false

    // tweet-twitter_in_reply_to_status
    document.addEventListener('click', e => {
        if (findParents(e.target, 'tweet-twitter_in_reply_to_status')) {
            tweetTwitterInReplyToStatusClick(e)
        }
    })

    async function tweetTwitterInReplyToStatusClick(e) {
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')
        if (findParents(e.target, 'tweet-twitter_in_reply_to_status')) {
            isTweetTwitterPictureClick = true
        }
        const status = findParents(e.target, 'tweet-twitter_in_reply_to_status')
        const statusId = status.dataset['in_reply_to_status_id']
        const screenName = status.dataset['in_reply_to_screen_name']
        const href = `/twitter/${screenName}/status/${statusId}`

        try {
            const fetching = fetch(href, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
            })

            ajaxProgressBar.parentNode.style.visibility = ''
            ajaxProgressBar.style.width = '80%'

            if (window.AquaProjectsCache[href]) {
                const ftSelectors = '.format_timeline'
                const ftCache = utils.getApCacheNode(href, ftSelectors)
                const insertStatus = ftCache.firstElementChild.cloneNode(true)
                insertStatus.style.padding = '0 0 12px'
                insertStatus.style.border = '0'
                insertStatus.style.gridColumn = '1/3'
                status.insertAdjacentElement('afterend', insertStatus)
                status.remove()

                window.dispatchEvent(new Event('aquaprojects_popstate'))

                ajaxProgressBar.style.width = '100%'
                ajaxProgressBar.style.transition = 'width 0.1s ease 0s'

                setTimeout(() => {
                    ajaxProgressBar.parentNode.style.visibility = ''
                    ajaxProgressBar.style.width = '0%'
                    ajaxProgressBar.style.transition = ''
                }, 200)
                return
            }

            const response = await fetching
            if (!response.ok) {
                error(response)
                showError()
                return
            }
            const data = await response.text()

            // Save Cache.
            utils.saveApCache(href, data)
            const ftSelectors = '.format_timeline'
            const ftCache = utils.getApCacheNode(href, ftSelectors)
            const insertStatus = ftCache.firstElementChild.cloneNode(true)
            insertStatus.style.padding = '0 0 12px'
            insertStatus.style.border = '0'
            insertStatus.style.gridColumn = '1/3'
            status.insertAdjacentElement('afterend', insertStatus)
            status.remove()

            window.dispatchEvent(new Event('aquaprojects_popstate'))

            ajaxProgressBar.style.width = '100%'
            ajaxProgressBar.style.transition = 'width 0.1s ease 0s'

            setTimeout(() => {
                ajaxProgressBar.parentNode.style.visibility = 'hidden'
                ajaxProgressBar.style.width = '0%'
                ajaxProgressBar.style.transition = ''
            }, 200)
            return
        } catch (err) {
            error(err)
        }
    }

    // tweet-twitter_user_tooltip
    document.addEventListener('click', e => {
        if (findParents(e.target, 'tweet-twitter_user_tooltip')) {
            isTweetTwitterPictureClick = true
            if (findParents(e.target, 'twitter_anchor')) {
                isTweetTwitterPictureClick = false
            }
        }
    })

    // tweet-twitter_favorite, tweet-twitter_retweet
    document.addEventListener('click', e => {
        if (findParents(e.target, 'tweet-twitter_social')) {
            isTweetTwitterPictureClick = true
        }
    })

    // tweet-twitter_full_text_hashtags
    document.addEventListener('click', e => {
        if (findParents(e.target, 'tweet-twitter_full_text_hashtags')) {
            isTweetTwitterPictureClick = true
        }
    })

    // tweet-twitter_picture
    document.addEventListener('click', e => {
        const ecl = [
            'tweet-twitter_picture',
            'tweet-twitter_video-play_icon',
            'tweet-twitter_video-duration',
            'tweet-twitter_video',
        ]
        if (ecl.some(element => findParents(e.target, element))) {
            tweetTwitterPictureClick(e)
        }
    })

    async function tweetTwitterPictureClick(e) {
        isTweetTwitterPictureClick = true

        const selectors = '.tweet-twitter_picture'

        if (e.target.classList.contains('tweet-twitter_video')) {
            return
        }

        const ttpClassName = 'tweet-twitter_picture'
        let tweetTwitterPictureImg = findParents(e.target, ttpClassName)
        if (!tweetTwitterPictureImg) {
            const targetParentNode = e.target.parentNode
            tweetTwitterPictureImg = targetParentNode.querySelector(selectors)
        }

        if (tweetTwitterPictureImg.src !== tweetTwitterPictureImg.dataset.src) {
            tweetTwitterPictureImg.src = tweetTwitterPictureImg.dataset.src
            tweetTwitterPictureImg.crossOrigin = 'anonymous'
            return
        }

        const ttpsClassName = 'tweet-twitter_pictures'
        const tweetTwitterPictures = findParents(e.target, ttpsClassName)

        if (tweetTwitterPictures.querySelector('video')) {
            const ttpsv = tweetTwitterPictures.querySelector('video')
            Array.from(ttpsv.parentNode.children).forEach(element => {
                if (element.style.paddingTop === '') {
                    element.style.display = 'none'
                }
            })

            const ttpsvClone = ttpsv.cloneNode(true)
            ttpsvClone.style.display = ''
            const videoCloneSource = ttpsvClone.querySelector('source')
            videoCloneSource.src = videoCloneSource.dataset.src
            videoCloneSource.crossOrigin = 'anonymous'
            ttpsv.insertAdjacentElement('afterend', ttpsvClone)

            ttpsv.remove()

            const ttpsd = tweetTwitterPictures.querySelector(
                '.tweet-twitter_video-duration'
            )
            ttpsd.style.display = 'none'

            return
        }

        const ttpe = tweetTwitterPictures.querySelectorAll(selectors)
        const currentImg = findParents(e.target, 'tweet-twitter_picture')
        const currentImgSrc = currentImg.dataset.src
        let currentImgNumber = 0
        const ImgTable = []

        for (let index = 0; index < ttpe.length; index++) {
            ImgTable.push(ttpe[index].dataset.src)
            if (currentImgSrc === ttpe[index].dataset.src) {
                currentImgNumber = index
            }
        }

        const ttpzcSelectors = '.tweet-twitter_picture_zoom-container'
        const ttpzc = document.querySelector(ttpzcSelectors)
        while (ttpzc.lastChild) ttpzc.removeChild(ttpzc.lastChild)

        for (let index = 0; index < ImgTable.length; index++) {
            const ttpze = document.createElement('div')
            ttpze.className = 'tweet-twitter_picture_zoom-element'

            const div = document.createElement('div')
            const ttpzei = document.createElement('img')
            ttpzei.className = 'tweet-twitter_picture_zoom-element_img'
            ttpzei.src = ImgTable[index]
            ttpzei.crossOrigin = 'anonymous'

            div.appendChild(ttpzei)
            ttpze.appendChild(div)
            ttpzc.appendChild(ttpze)
        }

        const ttpz = document.querySelector('.tweet-twitter_picture_zoom')
        const ttpznSelectors = '.tweet-twitter_picture_zoom-navigator'
        const ttpzn = document.querySelectorAll(ttpznSelectors)

        ttpz.style.display = 'flex'

        const apThemeDark = utils.getApTheme() === 'dark'
        const mediaQueryString = '(prefers-color-scheme: dark)'
        const prefersColorSchemeDark = window.matchMedia(mediaQueryString)

        ttpz.style.background =
            apThemeDark || prefersColorSchemeDark.matches
                ? 'rgba(21, 32, 43, 0.8)'
                : 'rgba(255, 255, 255, 0.8)'

        for (let index = 0; index < ttpzn.length; index++) {
            const element = ttpzn[index]
            element.style.background =
                apThemeDark || prefersColorSchemeDark.matches
                    ? 'rgba(21, 32, 43)'
                    : 'rgba(255, 255, 255)'
        }

        jumpToSlide(currentImgNumber)
        selectedTweetTwitterPicture = currentImg
        tweetTwitterPictureZoomOpen(currentImgNumber)
        const touchstart = e => {
            const ttpzcClassName = 'tweet-twitter_picture_zoom-container'
            const container = findParents(e.target, ttpzcClassName)
            container && boxContainerTouchStart(e, container)
            container && e.preventDefault()
        }
        const touchmove = e => {
            const ttpzcClassName = 'tweet-twitter_picture_zoom-container'
            const container = findParents(e.target, ttpzcClassName)
            container && boxContainerTouchMove(e, container)
            container && e.preventDefault()
        }
        const touchend = e => {
            const ttpzcClassName = 'tweet-twitter_picture_zoom-container'
            const container = findParents(e.target, ttpzcClassName)
            container && boxContainerTouchEnd(e, container)
            container && e.preventDefault()
        }
        ttpz.addEventListener('touchstart', touchstart)
        ttpz.addEventListener('touchmove', touchmove)
        ttpz.addEventListener('touchend', touchend)

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                const oldValue = mutation.oldValue
                const isDisplayFlex = oldValue.indexOf('display: flex;') !== -1
                const isDisplayNone = mutation.target.style.display === 'none'
                if (isDisplayFlex && isDisplayNone) {
                    ttpz.removeEventListener('touchstart', touchstart)
                    ttpz.removeEventListener('touchmove', touchmove)
                    ttpz.removeEventListener('touchend', touchend)
                    observer.disconnect()
                }
            })
        })
        const config = {
            attributes: true,
            characterData: true,
            attributeOldValue: true,
            characterDataOldValue: true,
        }
        observer.observe(ttpz, config)
    }

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

    let scrollingDirection = ''
    var touchingPositionPageX = 0
    var touchingPositionPageY = 0
    var touchStartScrollLeft = 0
    var currentSlideNumber = {
        number: 0,
    }
    var currentSlideNumberProxy = new Proxy(currentSlideNumber, {
        set: (target, property, value) => {
            target[property] = value
            tweetTwitterPictureCloseDisplayController()
            return true
        },
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
        touchingPositionPageY = e.changedTouches[0].pageY
        touchStartScrollLeft = container.style.transform
            ? analyzeTransform(container.style.transform)
            : [0, 0, 0]
    }

    function boxContainerTouchMove(e, container) {
        const pageX = e.changedTouches[0].pageX
        const pageY = e.changedTouches[0].pageY
        const amountOfMovementX = touchingPositionPageX - pageX
        const amountOfMovementY = touchingPositionPageY - pageY
        if (scrollingDirection === '') {
            scrollingDirection =
                Math.abs(amountOfMovementX) > Math.abs(amountOfMovementY)
                    ? 'parallel'
                    : 'vertical'
        }
        if (scrollingDirection === 'parallel') {
            const tx = (touchStartScrollLeft[0] * -1 + amountOfMovementX) * -1
            container.style.transform = `translate3d(${tx}px, 0px, 0px)`
        } else if (scrollingDirection === 'vertical') {
            const tx = touchStartScrollLeft[0]
            const ty = amountOfMovementY * -1
            container.style.transform = `translate3d(${tx}px, ${ty}px, 0px)`
        }
    }

    function boxContainerTouchEnd(e, container) {
        const elements = document.querySelectorAll(`.${e.target.className}`)
        const elementIndex = Array.from(elements).findIndex(
            item => item === e.target
        )
        const elementWidth = window.innerWidth
        const pageX = e.changedTouches[0].pageX
        const pageY = e.changedTouches[0].pageY
        const amountOfMovementX = touchingPositionPageX - pageX
        const amountOfMovementY = touchingPositionPageY - pageY

        const transitionend = () => {
            container.style.transition = 'all 0ms ease 0s'
            container.removeEventListener('transitionend', transitionend)
        }
        container.addEventListener('transitionend', transitionend)
        container.style.transition = 'all 300ms ease 0s'

        if (scrollingDirection === 'parallel') {
            const tx = `${elementIndex * elementWidth * -1}px`
            const transformFunction = `translate3d(${tx}, 0px, 0px)`
            container.style.transform = transformFunction

            if (amountOfMovementX > container.offsetWidth / 6) {
                if (elements.length - 1 < currentSlideNumberProxy.number + 1) {
                    return
                }
                const tx = `${(elementIndex + 1) * elementWidth * -1}px`
                const transformFunction = `translate3d(${tx}, 0px, 0px)`
                container.style.transform = transformFunction
                currentSlideNumberProxy.number += 1
                setTimeout(() => {
                    AverageColorByImageOnTweetTwitterPictureZoom()
                }, 0)
            } else if (amountOfMovementX < -(container.offsetWidth / 6)) {
                if (currentSlideNumberProxy.number - 1 < 0) {
                    return
                }
                const tx = `${(elementIndex - 1) * elementWidth * -1}px`
                const transformFunction = `translate3d(${tx}, 0px, 0px)`
                container.style.transform = transformFunction
                currentSlideNumberProxy.number -= 1
                setTimeout(() => {
                    AverageColorByImageOnTweetTwitterPictureZoom()
                }, 0)
            }
        } else if (scrollingDirection === 'vertical') {
            if (Math.abs(amountOfMovementY) > container.offsetHeight / 6) {
                tweetTwitterPictureZoomClose()
            } else {
                const tx = `${elementIndex * elementWidth * -1}px`
                const transformFunction = `translate3d(${tx}, 0px, 0px)`
                container.style.transform = transformFunction
            }
        }

        setTimeout(() => {
            if (scrollingDirection === 'parallel') {
                AverageColorByImageOnTweetTwitterPictureZoom()
            }
        }, 0)

        scrollingDirection = ''
        touchingPositionPageX = 0
        touchingPositionPageY = 0
        touchStartScrollLeft = 0
    }

    var clickingNow = false
    var clickingPositionOffsetX = 0
    var clickingPositionPageX = 0

    /* eslint-disable */
    function boxContainerMouseDown(e, container) {
        clickingNow = true
        clickingPositionOffsetX = e.offsetX
        clickingPositionPageX = e.pageX
        touchStartScrollLeft = container.style.transform
            ? analyzeTransform(container.style.transform)
            : [0, 0, 0]
    }

    function boxContainerMouseMove(e, container) {
        if (clickingNow) {
            const amountOfMovement = clickingPositionOffsetX - e.offsetX
            const tx = (touchStartScrollLeft[0] * -1 + amountOfMovement) * -1
            container.style.transform = `translate3d(${tx}px, 0px, 0px)`
        }
    }

    function boxContainerMouseUp(e, container) {
        const elements = document.querySelectorAll(`.${e.target.className}`)
        const elementIndex = Array.from(elements).findIndex(
            item => item === e.target
        )
        const elementWidth = elements[0].offsetWidth
        const amountOfMovement = clickingPositionPageX - e.pageX

        container.addEventListener(
            'transitionend',
            () => (container.style.transition = 'all 0ms ease 0s')
        )
        container.style.transition = 'all 300ms ease 0s'

        const tx = `${elementIndex * elementWidth * -1}px`
        const transformFunction = `translate3d(${tx}, 0px, 0px)`
        container.style.transform = transformFunction
        touchingPositionPageX = 0
        touchStartScrollLeft = 0

        if (amountOfMovement > container.offsetWidth / 6) {
            if (elements.length - 1 < currentSlideNumberProxy.number + 1) {
                return
            }
            const tx = `${(elementIndex + 1) * elementWidth * -1}px`
            const transformFunction = `translate3d(${tx}, 0px, 0px)`
            container.style.transform = transformFunction
            currentSlideNumberProxy.number += 1
        } else if (amountOfMovement < -(container.offsetWidth / 6)) {
            if (currentSlideNumberProxy.number - 1 < 0) {
                return
            }
            const tx = `${(elementIndex - 1) * elementWidth * -1}px`
            const transformFunction = `translate3d(${tx}, 0px, 0px)`
            container.style.transform = transformFunction
            currentSlideNumberProxy.number -= 1
        }

        clickingNow = false
    }

    function boxContainerMouseLeave(e, container) {
        if (!clickingNow) return

        const elements = document.querySelectorAll(`.${e.target.className}`)
        const elementIndex = Array.from(elements).findIndex(
            item => item === e.target
        )
        const elementWidth = elements[0].offsetWidth
        const amountOfMovement = clickingPositionPageX - e.pageX

        container.addEventListener(
            'transitionend',
            () => (container.style.transition = 'all 0ms ease 0s')
        )
        container.style.transition = 'all 300ms ease 0s'

        const tx = `${elementIndex * elementWidth * -1}px`
        const transformFunction = `translate3d(${tx}, 0px, 0px)`
        container.style.transform = transformFunction
        touchingPositionPageX = 0
        touchStartScrollLeft = 0

        if (amountOfMovement > container.offsetWidth / 6) {
            if (elements.length - 1 < currentSlideNumberProxy.number + 1) {
                return
            }
            const tx = `${(elementIndex + 1) * elementWidth * -1}px`
            const transformFunction = `translate3d(${tx}, 0px, 0px)`
            container.style.transform = transformFunction
            currentSlideNumberProxy.number += 1
        } else if (amountOfMovement < -(container.offsetWidth / 6)) {
            if (currentSlideNumberProxy.number - 1 < 0) {
                return
            }
            const tx = `${(elementIndex - 1) * elementWidth * -1}px`
            const transformFunction = `translate3d(${tx}, 0px, 0px)`
            container.style.transform = transformFunction
            currentSlideNumberProxy.number -= 1
        }

        clickingNow = false
    }
    /* eslint-enable */

    function prevSlideBtn() {
        const containerSelectors = '.tweet-twitter_picture_zoom-container'
        const container = document.querySelector(containerSelectors)
        const elementWidth = window.innerWidth
        const elementIndex = currentSlideNumberProxy.number

        container.addEventListener(
            'transitionend',
            () => (container.style.transition = 'all 0ms ease 0s')
        )
        container.style.transition = 'all 300ms ease 0s'

        if (currentSlideNumberProxy.number - 1 < 0) {
            const tx = `${elementIndex * elementWidth * -1}px`
            const transformFunction = `translate3d(${tx}, 0px, 0px)`
            container.style.transform = transformFunction
            return
        }

        const tx = `${(elementIndex - 1) * elementWidth * -1}px`
        const transformFunction = `translate3d(${tx}, 0px, 0px)`
        container.style.transform = transformFunction

        currentSlideNumberProxy.number -= 1

        setTimeout(() => {
            AverageColorByImageOnTweetTwitterPictureZoom()
        }, 0)
    }

    function nextSlideBtn() {
        const containerSelectors = '.tweet-twitter_picture_zoom-container'
        const container = document.querySelector(containerSelectors)
        const elementsSelectors = '.tweet-twitter_picture_zoom-element_img'
        const elements = document.querySelectorAll(elementsSelectors)
        const elementWidth = window.innerWidth
        const elementIndex = currentSlideNumberProxy.number

        container.addEventListener(
            'transitionend',
            () => (container.style.transition = 'all 0ms ease 0s')
        )
        container.style.transition = 'all 300ms ease 0s'

        if (elements.length - 1 < currentSlideNumberProxy.number + 1) {
            const tx = `${elementIndex * elementWidth * -1}px`
            const transformFunction = `translate3d(${tx}, 0px, 0px)`
            container.style.transform = transformFunction
            return
        }

        const tx = `${(elementIndex + 1) * elementWidth * -1}px`
        const transformFunction = `translate3d(${tx}, 0px, 0px)`
        container.style.transform = transformFunction
        currentSlideNumberProxy.number += 1

        setTimeout(() => {
            AverageColorByImageOnTweetTwitterPictureZoom()
        }, 0)
    }

    function jumpToSlide(jumpToSlideNumber) {
        const containerSelectors = '.tweet-twitter_picture_zoom-container'
        const container = document.querySelector(containerSelectors)
        const elementWidth = window.innerWidth
        const elementIndex = jumpToSlideNumber

        container.style.transition = 'all 0ms ease 0s'

        const tx = `${elementIndex * elementWidth * -1}px`
        const transformFunction = `translate3d(${tx}, 0px, 0px)`
        container.style.transform = transformFunction

        currentSlideNumberProxy.number = jumpToSlideNumber
    }

    let selectedTweetTwitterPicture = null

    function tweetTwitterPictureZoomOpen(currentImgNumber) {
        if (localStorage.getItem('twitter-reduce_animation') === null) {
            const ttpzeSelectors = '.tweet-twitter_picture_zoom-element'
            const ttpze = document.querySelectorAll(ttpzeSelectors)
            const targetTtpze = ttpze[currentImgNumber]

            const elementWidth = window.innerWidth
            const elementIndex = currentImgNumber
            const tx = `${Math.abs(elementIndex * elementWidth * -1)}px`

            const targetDiv = targetTtpze.querySelector('div')
            const DOMRect = selectedTweetTwitterPicture.getBoundingClientRect()
            const duration = 0.15
            targetDiv.style.position = 'absolute'
            targetDiv.style.height = `${DOMRect.height}px`
            targetDiv.style.top = `${DOMRect.top}px`
            targetDiv.style.left = `calc(${DOMRect.left}px + ${tx})`
            targetDiv.style.width = `${DOMRect.width}px`
            targetDiv.style.overflow = 'hidden'
            targetDiv.style.transition = `${duration}s`

            const targetImg = targetTtpze.querySelector('img')
            const targetImgDOMRect = targetImg.getBoundingClientRect()
            const picWidth = targetImgDOMRect.width
            const scale = DOMRect.width / picWidth
            targetImg.style.transform = `scale(${scale})`

            const ttpzc = document.querySelector('.tweet-twitter_picture_zoom')
            ttpzc.style.transition = `${duration}s`
            setTimeout(() => {
                for (let index = 0; index < ttpze.length; index++) {
                    if (index === currentImgNumber) continue
                    const element = ttpze[index]
                    const elementDiv = element.querySelector('div')
                    const elementImg = element.querySelector('img')
                    const left = Math.abs(index * elementWidth * -1)
                    elementDiv.style.height = '100%'
                    elementDiv.style.width = '100%'
                    elementDiv.style.top = '0'
                    elementDiv.style.left = `${left}px`
                    elementDiv.style.overflow = 'hidden'
                    elementImg.style.height = '100%'
                    elementImg.style.width = '100%'
                }
                const left = Math.abs(elementIndex * elementWidth * -1)
                targetDiv.style.height = '100%'
                targetDiv.style.width = '100%'
                targetDiv.style.top = '0'
                targetDiv.style.left = `${left}px`
                targetImg.style.transition = `${duration / 8}s`
                targetImg.style.transform = ''
                targetImg.style.height = '100%'
                targetImg.style.width = '100%'
            }, 0)
            const transitionend = () => {
                AverageColorByImageOnTweetTwitterPictureZoom()
                targetDiv.removeEventListener('transitionend', transitionend)
            }
            targetDiv.addEventListener('transitionend', transitionend)
        }
        const body = document.querySelector('body')
        body.style.marginRight = `${window.innerWidth - body.offsetWidth}px`
        body.style.overflowY = 'hidden'
    }

    function tweetTwitterPictureZoomClose() {
        const ttpzSelectors = '.tweet-twitter_picture_zoom'
        const ttpz = document.querySelector(ttpzSelectors)
        if (localStorage.getItem('twitter-reduce_animation') === null) {
            const sttp = selectedTweetTwitterPicture
            const ttpsClassName = 'tweet-twitter_pictures'
            const ttpSelectors = '.tweet-twitter_picture'
            const ttpzeiSelectors = '.tweet-twitter_picture_zoom-element_img'
            const ttpsElement = findParents(sttp, ttpsClassName)
            const ttps = ttpsElement.querySelectorAll(ttpSelectors)
            const ttpzeis = ttpz.querySelectorAll(ttpzeiSelectors)

            const ttpsIndex = Array.from(ttps).findIndex(element => {
                return element.src === ttpzeis[currentSlideNumber.number].src
            })
            const targetTtps = Array.from(ttps).find(element => {
                return element.src === ttpzeis[currentSlideNumber.number].src
            })
            const ttpzeSelectors = '.tweet-twitter_picture_zoom-element > div'
            const ttpzes = document.querySelectorAll(ttpzeSelectors)

            const elementWidth = window.innerWidth
            const elementIndex = ttpsIndex
            const tx = `${Math.abs(elementIndex * elementWidth * -1)}px`

            // Set .tweet-twitter_picture_zoom-element > div's style.
            const ttpsElementDOMRect = targetTtps.getBoundingClientRect()
            const ttpze = ttpzes[elementIndex]
            const duration = 0.15
            ttpze.style.position = 'absolute'
            ttpze.style.height = `${ttpsElementDOMRect.height}px`
            ttpze.style.left = `calc(${ttpsElementDOMRect.left}px + ${tx})`
            ttpze.style.top = `${ttpsElementDOMRect.top}px`
            ttpze.style.width = `${ttpsElementDOMRect.width}px`
            ttpze.style.transition = `${duration}s`

            const containerClassName = 'tweet-twitter_picture_zoom-container'
            const container = findParents(ttpze, containerClassName)
            const cst = container.style.transform
            const ct = analyzeTransform(cst)
            const transformFunction = `translate3d(${ct[0]}px, 0px, ${ct[2]}px)`
            container.style.transform = transformFunction

            setTimeout(() => {
                // Set .tweet-twitter_picture_zoom-element > div > img's style.
                const ttpzeImg = ttpze.querySelector('img')
                const ttpsElementHeight = ttpsElementDOMRect.height
                const ttpsElementWidth = ttpsElementDOMRect.width
                const ratio = ttpzeImg.naturalHeight / ttpzeImg.naturalWidth
                const scale = (ttpsElementWidth * ratio) / ttpsElementHeight
                ttpzeImg.style.transform = `scale(${scale})`
                ttpzeImg.style.transition = `${duration}s`
                ttpz.style.background = ''
                ttpz.style.transition = `${duration}s`
                Array.from(ttpz.querySelectorAll('button')).forEach(element => {
                    element.style.background = ''
                    element.style.transition = `${duration}s`
                })
                let isTransitionend = false
                const transitionend = () => {
                    ttpz.style.display = 'none'
                    ttpzeImg.removeEventListener('transitionend', transitionend)
                    isTransitionend = true
                }
                setTimeout(() => {
                    // transitionend does not fire.
                    if (ttpz.style.display !== 'none' && !isTransitionend) {
                        transitionend()
                    }
                }, duration * 1000 + 500)
                ttpzeImg.addEventListener('transitionend', transitionend)
            }, 0)
        }
        const body = document.querySelector('body')
        body.style.marginRight = ''
        body.style.overflowY = ''
        if (localStorage.getItem('twitter-reduce_animation') === null) {
            return
        }
        if (ttpz.style.display === 'flex') {
            ttpz.style.display = 'none'
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
        const ttpzeSelectors = '.tweet-twitter_picture_zoom-element'
        const ttpze = document.querySelectorAll(ttpzeSelectors)
        const ttpzeLength = ttpze.length

        const ttpzpSelectors = '.tweet-twitter_picture_zoom-prev'
        const ttpznSelectors = '.tweet-twitter_picture_zoom-next'
        const ttpzp = document.querySelector(ttpzpSelectors)
        const ttpzn = document.querySelector(ttpznSelectors)

        if (currentSlideNumberProxy.number === 0) {
            ttpzp.style.display = 'none'
        } else {
            ttpzp.style.display = ''
        }

        if (currentSlideNumberProxy.number === ttpzeLength - 1) {
            ttpzn.style.display = 'none'
        } else {
            ttpzn.style.display = ''
        }
    }

    document.addEventListener('keydown', e => {
        const keycode = e.keyCode
        if (keycode === 37 || keycode === 39) {
            if (utils.locationMatch('/twitter')) {
                const ttpzSelectors = '.tweet-twitter_picture_zoom'
                const ttpz = document.querySelector(ttpzSelectors)
                if (ttpz.style.display !== 'none') {
                    if (keycode === 37) {
                        prevSlideBtn()
                    } else if (keycode === 39) {
                        nextSlideBtn()
                    }
                }
            }
        }
    })

    const twitterPictureAverageColorList = []

    function AverageColorByImageOnTweetTwitterPictureZoom() {
        const ttpzSelectors = '.tweet-twitter_picture_zoom'
        const ttpznSelectors = '.tweet-twitter_picture_zoom-navigator'
        const ttpzeSelectors = '.tweet-twitter_picture_zoom-element img'
        const ttpz = document.querySelector(ttpzSelectors)
        const ttpzn = document.querySelectorAll(ttpznSelectors)
        const ttpze = document.querySelectorAll(ttpzeSelectors)

        const imgTable = []
        for (let index = 0; index < ttpze.length; index++) {
            const element = ttpze[index]
            imgTable.push(element.src)
        }

        const twitterPictureSrc = imgTable[currentSlideNumberProxy.number]

        const twitterPictureData = twitterPictureAverageColorList.find(
            element => element['src'] === twitterPictureSrc
        )

        if (twitterPictureData) {
            setBackgroundColor(twitterPictureData['rgb'])
        } else {
            averageColorByImage(twitterPictureSrc).then(res => {
                twitterPictureAverageColorList.push({
                    src: twitterPictureSrc,
                    rgb: res,
                })
                setBackgroundColor(res)
            })
        }

        function setBackgroundColor(rgb) {
            const hslc = rgb2hsl(rgb)
            const hslColor = `hsla(${hslc[0]}, ${hslc[1]}%, ${hslc[2]}%`
            ttpz.style.background = `${hslColor}, 90%)`
            for (let index = 0; index < ttpzn.length; index++) {
                const element = ttpzn[index]
                const l = Number(hslc[2]) - 10
                const hslColor = `hsla(${hslc[0]}, ${hslc[1]}%, ${l}%`
                element.style.background = `${hslColor}, 77%)`
            }
        }
    }

    let selectExistOwnListResutId = ''

    document.addEventListener('click', e => {
        if (findParents(e.target, 'select_exist_own_list-list')) {
            selectExistOwnListListClick(e)
        }
    })

    function selectExistOwnListListClick(e) {
        const target = findParents(e.target, 'select_exist_own_list-list')
        const checkStatus = target.dataset['check_status']
        const seollnimSelectors = '.select_exist_own_list-list_name_id_mode'
        const seollnimiSelectors = `${seollnimSelectors}-id`
        if (checkStatus === 'none') {
            target.dataset['check_status'] = 'checked'
            selectExistOwnListResutId = target
                .querySelector(seollnimSelectors)
                .querySelector(seollnimiSelectors).innerHTML
            utils.remove(target, 'checked_css_opacity')
            target.classList.add('check_css_opacity')
        }
        if (checkStatus === 'checked') {
            target.dataset['check_status'] = 'none'
            selectExistOwnListResutId = ''
            utils.remove(target, 'checked_css_opacity')
            target.classList.add('check_css_opacity')
        }
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'startTwitter')) {
            CheckTwitterWelcomeResult()
        }
    })

    function CheckTwitterWelcomeResult() {
        const tclnSelectors = '.twitter_create_list-name'
        const tcldSelectors = '.twitter_create_list-description'
        const tclmSelectors = '.twitter_create_list-mode'
        const tcln = document.querySelector(tclnSelectors)
        const tcld = document.querySelector(tcldSelectors)
        const tclm = document.querySelector(tclmSelectors)
        const tclnValue = tcln.value
        const tcldValue = tcld.value
        const tclmInputChecked = tclm.querySelector('input').checked

        let is_send_ok = false

        if (tclnValue === '' && selectExistOwnListResutId === '') {
            alert('Create Something.')
        } else if (tclnValue !== '' && selectExistOwnListResutId !== '') {
            alert('only select one.')
        } else {
            is_send_ok = true
        }
        log(tclnValue, tcldValue, tclmInputChecked)
        if (is_send_ok === true) {
            if (tclnValue !== '') {
                SendTwitterWelcomeResult('CreateNewList', {
                    twittterCreateListName: tclnValue,
                    twitterCreateListDescription: tcldValue,
                    twitterCreateListMode: tclmInputChecked,
                })
            } else if (selectExistOwnListResutId !== '') {
                SendTwitterWelcomeResult('SelectOwnList', {
                    selectExistOwnListResutId: selectExistOwnListResutId,
                })
            }
        }
    }

    async function SendTwitterWelcomeResult(list_mode, list_information) {
        document.querySelector('.startingTwitter').style.display = ''
        const post_url = 'lists'
        const post_data = {}
        post_data['list_mode'] = list_mode
        post_data['list_information'] = list_information

        try {
            const fetching = fetch(post_url, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(post_data),
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })

            const response = await fetching
            if (response.ok === false) {
                error(response)
                return
            }
            const data = await response.text()

            log(data)
            location.href = '/twitter'
        } catch (err) {
            error(err)
        }
    }

    // twitter_anchor
    document.addEventListener('click', e => {
        if (findParents(e.target, 'twitter_anchor')) {
            twitterAnchorClick(e)
        }
    })

    function twitterAnchorClick(e) {
        if (isTweetTwitterPictureClick) {
            isTweetTwitterPictureClick = false
            return
        }
        const target = findParents(e.target, 'twitter_anchor')

        if (window.getSelection().toString() !== '') {
            return
        }
        const targetHref = target.getAttribute('href')
        const targetPage = targetHref.replace(location.origin, '')
        const currentPage = utils.getCurrentPage()
        const replaceState = Object.assign({}, history.state)
        replaceState['scrollTop'] = window.scrollY
        history.replaceState(replaceState, null, currentPage)
        scanTweetHeight()
        history.pushState({ targetPage, currentPage }, null, targetPage)

        const twitterUserScreenName = target.dataset['twitter_userScreen_name']
        const tweetId = target.dataset['tweet_id']
        if (twitterUserScreenName !== undefined) {
            changeContent(targetPage, 'twitter_user', twitterUserScreenName)
        } else if (tweetId !== undefined) {
            changeContent(targetPage, 'tweet', tweetId)
        } else {
            changeContent(targetPage)
        }
        window.scrollTo(0, 0)
        e.preventDefault()
    }

    async function changeContent(href, anchorMode, anchorContext) {
        utils.updateDocumentTitle()
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')
        anchorMode === 'twitter_user' && changeContentTwitterUser(anchorContext)
        anchorMode === 'tweet' && changeContentTweet(anchorContext)
        if (anchorMode !== 'twitter_user' && anchorMode !== 'tweet') {
            const main = document.querySelector('#main')
            utils.emptyNode(main)
            const loader = document.createElement('div')
            loader.className = 'loader'
            main.append(loader)
        }

        !(() => {
            utils.removeClass(ajaxProgressBar, 'bg-danger')
            ajaxProgressBar.parentNode.style.visibility = ''
            ajaxProgressBar.style.width = '80%'
        })()

        // Cache exsists.
        if (window.AquaProjectsCache[href]) {
            utils.repaintNode(href, '#main', true)

            ajaxProgressBar.style.width = '100%'

            window.dispatchEvent(new Event('aquaprojects_popstate'))
        }

        try {
            const fetching = fetch(href, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
            })

            const response = await fetching
            if (response.ok === false) {
                error(response)
                showError()
                return
            }
            const data = await response.text()

            // Save Cache.
            utils.saveApCache(href, data)
            if (href != location.href.replace(location.origin, '')) {
                log('It seems that you moved to a different page first.')
                return
            }
            utils.repaintNode(href, '#main')

            window.dispatchEvent(new Event('aquaprojects_popstate'))

            ajaxProgressBar.style.width = '100%'
            ajaxProgressBar.style.transition = 'width 0.1s ease 0s'

            setTimeout(() => {
                ajaxProgressBar.parentNode.style.visibility = 'hidden'
                ajaxProgressBar.style.width = '0%'
                ajaxProgressBar.style.transition = ''
            }, 200)
        } catch (err) {
            error(err)
            showError()
        }

        function changeContentTwitterUser(screen_name) {
            // The following will be changed:
            // twitter_user -> Add id as twitter_user.
            // .twitter_title-home-text -> Add twitter user name.
            // .twitter-back -> css: display: block.
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
            // .twitter_user-profile_timeline_navigation-block -> css: display: ''.
            // .twitter_user-profile_timeline_navigation-tweets -> Add .twitter_user-profile_timeline_navigation-selected.
            // .timeline -> Add loading html.
            // .twitter_user -> call setTweetCreated_at.
            const ttutSelectors = '.tweet-twitter_user_tooltip'
            const ttutElements = document.querySelectorAll(ttutSelectors)
            const targetTtut = Array.from(ttutElements).find(element => {
                return (
                    JSON.parse(element.dataset['uo'])['screen_name'] ==
                    screen_name
                )
            })
            const tu = createTweetTwitterUserTooltip(
                JSON.parse(targetTtut.dataset['uo'])
            )

            const tuSelectors = '.twitter_user'
            const twitterTitle = document.querySelector('.twitter_title-block')

            const timeline = document.querySelector('.timeline')
            timeline.innerHTML = tu.outerHTML

            const twitterUserContent = timeline.querySelector(tuSelectors)
            twitterUserContent.id = 'twitter_user'

            timeline.insertAdjacentElement('afterbegin', twitterTitle)
            const tunSelectors = '.twitter_user-name > span'
            const tthtSelectors = '.twitter_title-home-text'
            const tun = timeline.querySelector(tunSelectors)
            document.querySelector(tthtSelectors).innerHTML = tun.innerHTML
            document.querySelector('.twitter-back').style.display = 'block'
            const tthbSelectors = '.twitter_title-home-block'
            const tthb = document.querySelector(tthbSelectors)
            tthb.style.grid = 'auto auto / 3rem 1fr 3rem 3rem 3rem'
            const tthdSelectors = '.twitter_title-home-description'
            const tthd = document.querySelector(tthdSelectors)
            const tuscount = tu.querySelector('.twitter_user-statuses_count')
            const statusesCount = tuscount.querySelector('span:nth-child(2)')
            tthd.innerHTML = `${statusesCount.innerText} Tweets`

            const tubgimgSelectors = '.twitter_user-background_image'
            const tubgimg = timeline.querySelector(tubgimgSelectors)
            const tubgimgcode = document.createElement('img')
            tubgimgcode.src = tubgimg.dataset['imgSrc']
            tubgimgcode.loading = 'lazy'
            tubgimgcode.crossOrigin = 'anonymous'
            tubgimg.insertAdjacentElement('beforeend', tubgimgcode)

            const tupimg = timeline.querySelector('.twitter_user-profile_image')
            tupimg.style.margin = '10px 1rem'
            tupimg.style.position = 'relative'
            tupimg.classList.add('twitter_user-twitter_icon')
            const tupimgimg = tupimg.querySelector('img')
            const apTheme = utils.getApTheme()
            tupimgimg.classList.add('ap-theme')
            tupimgimg.classList.add(`ap_theme-${apTheme}-background`)
            tupimgimg.style.width = '25%'
            tupimgimg.style.height = ''
            tupimgimg.style.top = ''
            tupimgimg.style.marginTop = '-15.5%'
            tupimgimg.style.padding = '4px'
            tupimg.insertBefore(tupimgimg, tupimg.firstChild)
            tupimg.querySelector('a').remove()
            const tulfbSelectors = '.twitter_user-lists_follow_button'
            tupimg.querySelector(tulfbSelectors).style.padding = ''

            const tunsnSelectors = '.twitter_user-name_screen_name'
            const tunsn = timeline.querySelector(tunsnSelectors)
            const tunsna = tunsn.querySelector('a')
            tunsn.querySelector('.twitter_user-name').style.fontSize = '1.2rem'
            tunsn.insertBefore(
                tunsn.querySelector('.twitter_user-name'),
                tunsna
            )
            tunsn.insertBefore(
                tunsn.querySelector('.twitter_user-screen_name'),
                tunsna
            )
            tunsna.remove()

            const tul = timeline.querySelector('.twitter_user-local')
            tul.style.display = 'flex'
            tul.style.flexWrap = 'wrap'

            const tumSelectors = '.twitter_user-main'
            timeline.querySelector(tumSelectors).style.padding = '0 1rem'

            const tuptnbSelectors =
                '.twitter_user-profile_timeline_navigation-block'
            timeline.querySelector(tuptnbSelectors).style.display = ''

            const tuptntSelectors =
                '.twitter_user-profile_timeline_navigation-tweets'
            twitterUserProfileTimelineNavigationSelected(
                timeline.querySelector(tuptntSelectors)
            )

            const loader = document.createElement('div')
            loader.className = 'loader'
            const formatTimeline = document.createElement('div')
            formatTimeline.className = 'format_timeline'
            formatTimeline.appendChild(loader)
            timeline.appendChild(formatTimeline)

            setTweetCreated_at()
            makeTwitterUserTwitterIconClear()
            return
        }

        function changeContentTweet(tweet_id) {
            var twitterTitle = document.querySelector('.twitter_title-block')

            const tweet = document.querySelectorAll('.tweet')
            const targetElement = Array.from(tweet).find(element => {
                const keyname = 'tweet_id'
                return element.dataset[keyname] === String(tweet_id)
            })
            const timeline = document.querySelector('.timeline')
            timeline.innerHTML = targetElement.outerHTML
            timeline.insertAdjacentElement('afterbegin', twitterTitle)
            const tthtSelectors = '.twitter_title-home-text'
            document.querySelector(tthtSelectors).innerHTML = 'Tweets'
            document.querySelector('.twitter-back').style.display = 'block'
            const tthbSelectors = '.twitter_title-home-block'
            const tthb = document.querySelector(tthbSelectors)
            tthb.style.grid = 'auto auto / 3rem 1fr 3rem 3rem 3rem'

            timeline.insertAdjacentHTML(
                'beforeend',
                '<div class="loader"></div>'
            )
            return
        }
    }

    function changeTwitterTimelineBackgroundSize() {
        const windowWidth = window.innerWidth
        const tbSelectors = '.timeline_background'
        const tb = document.querySelectorAll(tbSelectors)

        const main = document.querySelector('#main')
        const mainClassList = Object.entries(main.classList).flat()
        if (windowWidth >= 992) {
            const lg = mainClassList.filter(i => i.indexOf('lg') >= 0)
            const lgNumber = lg[0].split('-')[lg[0].split('-').length - 1]
            tb[0].style.width = `${(windowWidth * lgNumber) / 12}px`
        } else if (windowWidth >= 768) {
            const md = mainClassList.filter(i => i.indexOf('md') >= 0)
            const mdNumber = md[0].split('-')[md[0].split('-').length - 1]
            tb[1].style.width = `${(windowWidth * mdNumber) / 12}px`
        } else {
            const sm = mainClassList.filter(i => i.indexOf('sm') >= 0)
            const smNumber = sm[0].split('-')[sm[0].split('-').length - 1]
            tb[2].style.width = `${(windowWidth * smNumber) / 12}px`
        }
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'twitter-refresh')) {
            changeContent(location.href.replace(location.origin, ''))
        }
    })

    window.addEventListener('resize', () => {
        if (utils.locationMatch('/twitter')) {
            changeTwitterTimelineBackgroundSize()
            twitterProfile()
            twitterTrends()
        }
    })

    async function twitterProfile() {
        const windowWidth = window.innerWidth
        if (windowWidth < 768) {
            return
        }
        const href = '/twitter/profile'
        if (window.AquaProjectsCache[href]) {
            utils.repaintNode(href, '.twitter-profile')
        } else {
            await refreshtwitterProfile(href)
        }
        makeTwitterUserTwitterIconClear()
    }

    async function refreshtwitterProfile(href) {
        try {
            const fetching = fetch(href, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
            })

            const response = await fetching
            if (response.ok === false) {
                alert(response)
            }
            const data = await response.text()

            utils.saveApCache(href, data)
            utils.repaintNode(href, '.twitter-profile')
        } catch (err) {
            alert(err)
        }
    }

    function twitterTrends() {
        const windowWidth = window.innerWidth
        if (windowWidth < 768) {
            return
        }
        const href = '/twitter/trends'
        const key = 'twitterTrendsExpireDate'
        const tted = sessionStorage.getItem(key)
        const isExpired =
            tted === null ? true : parseInt(tted) < new Date().getTime()
        if (window.AquaProjectsCache[href] && !isExpired) {
            utils.repaintNode(href, '.twitter-trends')
        } else {
            refreshTwitterTrends(href)
        }

        async function refreshTwitterTrends(href) {
            try {
                const fetching = fetch(href, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include',
                })

                const response = await fetching
                if (response.ok === false) {
                    alert(response)
                }
                const data = await response.text()

                utils.saveApCache(href, data)
                utils.repaintNode(href, '.twitter-trends')

                const expire = new Date(
                    new Date().setMinutes(new Date().getMinutes() + 15)
                ).getTime()
                sessionStorage.setItem(key, expire)
            } catch (err) {
                alert(err)
            }
        }
    }

    function setTweetCreated_at() {
        const month_list = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ]

        const ttc = document.querySelectorAll('.tweet-twitter_createdat')
        for (let index = 0; index < ttc.length; index++) {
            const element = ttc[index]
            const createdat_title = element.getAttribute('title')
            const created_at_time = new Date(createdat_title).getTime()
            const currentTime = new Date().getTime()
            const diffTime = currentTime - created_at_time
            const displayTime = calculateTime(diffTime, createdat_title)
            element.innerHTML = ` · ${displayTime}`
        }

        const twitterUserPageCreatedAt = document.querySelector(
            '.timeline #twitter_user .twitter_user-created_at'
        )
        if (!twitterUserPageCreatedAt) {
            return
        }

        !(() => {
            const createdat_title = twitterUserPageCreatedAt.title
            const displayTime = calculateJoinTime(createdat_title)
            const timeBlock = document.createElement('span')
            timeBlock.style.paddingLeft = '4px'
            timeBlock.innerHTML = displayTime
            twitterUserPageCreatedAt.querySelector('span').remove()
            twitterUserPageCreatedAt.appendChild(timeBlock)
        })()

        function calculateTime(diffTime, createdat_title) {
            diffTime /= 1000
            let displayTime = ''
            if (diffTime < 60) {
                displayTime = `${parseInt(diffTime)} s`
            } else if (diffTime < 60 * 60) {
                displayTime = `${parseInt(diffTime / 60)} m`
            } else if (diffTime < 60 * 60 * 24) {
                displayTime = `${parseInt(diffTime / 60 / 60)} h`
            } else {
                const displayCreated_at = new Date(createdat_title)
                const month = month_list[displayCreated_at.getMonth()]
                const date = displayCreated_at.getDate()
                displayTime = `${month} ${date}`
            }
            return displayTime
        }

        function calculateJoinTime(createdat_title) {
            const monthList = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ]
            const displayCreated_at = new Date(createdat_title)
            const month = monthList[displayCreated_at.getMonth()]
            const year = displayCreated_at.getFullYear()
            return `Joined ${month} ${year}`
        }
    }

    document.addEventListener(
        'mouseover',
        e => {
            if (findParents(e.target, 'tweet-twitter_user_name')) {
                tweetTwitterUserNameMouseover(e)
            }
        },
        true
    )

    function tweetTwitterUserNameMouseover(e) {
        const target = findParents(e.target, 'tweet-twitter_user_name')

        const selectors = '.tweet-twitter_user_tooltip'
        const tweetTwitterUserTooltip = target.querySelector(selectors)
        if (tweetTwitterUserTooltip.children.length === 0) {
            tweetTwitterUserTooltip.appendChild(
                createTweetTwitterUserTooltip(
                    JSON.parse(tweetTwitterUserTooltip.dataset['uo'])
                )
            )
        } else {
            return
        }

        const y = target.offsetTop + target.clientHeight
        const ttut = target.querySelector(selectors)
        ttut.style.display = 'block'
        ttut.style.top = y

        const mouseleave = e => {
            const ttutc = 'tweet-twitter_user_tooltip'
            const ttunc = 'tweet-twitter_user_name'
            const cc = className => e.target.classList.contains(className)
            if (e.target.classList) {
                if (cc(ttutc) || cc(ttunc)) {
                    const target = findParents(e.target, ttunc)
                    target.querySelector(selectors).style.display = ''

                    const ttut = target.querySelector(selectors)
                    utils.emptyNode(ttut)
                    ttut.removeEventListener('mouseleave', mouseleave)
                    target.removeEventListener('mouseleave', mouseleave)
                }
            }
        }
        tweetTwitterUserTooltip.addEventListener('mouseleave', mouseleave)
        target.addEventListener('mouseleave', mouseleave)
    }

    function createTweetTwitterUserTooltip(uo) {
        const dc = tagName => document.createElement(tagName)
        const dcns = (uri, tagName) => document.createElementNS(uri, tagName)
        const ca = styles => `ap_theme-${utils.getApTheme()}-${styles}`
        const cas = styles => `ap_theme-${utils.getApTheme()}-${styles}-skelton`
        const svgns = 'http://www.w3.org/2000/svg'
        const xlinkns = 'http://www.w3.org/1999/xlink'
        const bi = '/libs/bootstrap-icons/1.5.0/bootstrap-icons.svg'
        const sicon = (e, i) => e.setAttributeNS(xlinkns, 'href', `${bi}#${i}`)
        const twitterUser = dc('div')
        const twitterUserBackgroundImage = dc('div')
        const twitterUserProfileImage = dc('div')
        const twitterUserProfileImageA = dc('a')
        const twitterUserProfileImageAImg = dc('img')
        const twitterUserProfileImageDiv = dc('div')
        const twitterUserListsFollowButton = dc('div')
        const twitterUserListsButton = dc('button')
        const twitterUserListsButtonSvg = dcns(svgns, 'svg')
        const twitterUserListsButtonSvgUse = dcns(svgns, 'use')
        const twitterUserFollowButton = dc('button')
        const twitterUserDetails = dc('div')
        const twitterUserMain = dc('div')
        const twitterUserNameScreenName = dc('div')
        const twitterUserNameScreenNameA = dc('a')
        const twitterUserName = dc('div')
        const twitterUserNameSpan = dc('span')
        const twitterUserScreenName = dc('div')
        const twitterUserDescription = dc('div')
        const twitterUserLocal = dc('div')
        const twitterUserLocation = dc('div')
        const twitterUserLocationSvg = dcns(svgns, 'svg')
        const twitterUserLocationSvgUse = dcns(svgns, 'use')
        const twitterUserLocationSpan = dc('span')
        const twitterUserLink = dc('div')
        const twitterUserLinkSvg = dcns(svgns, 'svg')
        const twitterUserLinkSvgUse = dcns(svgns, 'use')
        const twitterUserLinkA = dc('a')
        const twitterUserCreatedAt = dc('div')
        const twitterUserCreatedAtSvg = dcns(svgns, 'svg')
        const twitterUserCreatedAtSvgUse = dcns(svgns, 'use')
        const twitterUserCreatedAtSpan = dc('span')
        const twitterUserCountStatus = dc('div')
        const twitterUserFavoritesCount = dc('div')
        const twitterUserFavoritesCountNumber = dc('span')
        const twitterUserFavoritesCountUnit = dc('span')
        const twitterUserStatusesCount = dc('div')
        const twitterUserStatusesCountSpan = dc('span')
        const twitterUserStatusesCountNumber = dc('span')
        const twitterUserStatusesCountUnit = dc('span')
        const twitterUserStatus = dc('div')
        const twitterUserFollowingCount = dc('div')
        const twitterUserFollowingCountA = dc('a')
        const twitterUserFollowingCountNumber = dc('span')
        const twitterUserFollowingCountUnit = dc('span')
        const twitterUserFollowersCount = dc('div')
        const twitterUserFollowersCountSpan = dc('span')
        const twitterUserFollowersCountA = dc('a')
        const twitterUserFollowersCountNumber = dc('span')
        const twitterUserFollowersCountUnit = dc('span')
        const twitterUserProfileTimelineNavigationBlock = dc('div')
        const twitterUserProfileTimelineNavigation = dc('div')
        const twitterUserProfileTimelineNavigationTweets = dc('div')
        const twitterUserProfileTimelineNavigationTweetsA = dc('a')
        const twitterUserProfileTimelineNavigationWithReplies = dc('div')
        const twitterUserProfileTimelineNavigationWithRepliesA = dc('a')
        const twitterUserProfileTimelineNavigationMedia = dc('div')
        const twitterUserProfileTimelineNavigationMediaA = dc('a')
        const twitterUserProfileTimelineNavigationLikes = dc('div')
        const twitterUserProfileTimelineNavigationLikesA = dc('a')

        const name = uo['name']
        const screenName = uo['screen_name']
        const followersCount = uo['followers_count']
        const followingCount = uo['friends_count']
        const favoritesCount = uo['favourites_count']
        const statusesCount = uo['statuses_count']
        const location = uo['location']
        const displayUrl =
            Object.keys(uo['entities']).indexOf('url') !== -1
                ? uo['entities']['url']['urls'][0]['display_url']
                : ''
        const expandedUrl =
            Object.keys(uo['entities']).indexOf('url') !== -1
                ? uo['entities']['url']['urls'][0]['expanded_url']
                : ''
        const createdAt = uo['created_at']
        const description = uo['description']
        const profileImage = uo['profile_image_url_https']
        const profileBanner = uo['profile_banner_url']
        const following = uo['following']

        const tac = 'twitter_anchor'
        const ttfthc = 'tweet-twitter_full_text_hashtags'
        const ttac = 'tweet-twitter_anchor'
        const tusnk = 'twitter_userScreen_name'
        const apts = localStorage.getItem('ap-theme-skelton')
        const aptc = 'ap_theme'
        const aptbc = ca('border')
        // const aptbgc = ca('background')
        const aptbgsc = apts ? cas('background') : ca('background')
        const aptcsc = ca('color-sub')
        const bsbtnc = 'btn'
        const apbtnc = 'ap_btn'
        const apbtnfillc = 'ap_btn-fill'

        const tuc = 'twitter_user'
        twitterUser.classList.add(tuc)
        twitterUser.dataset[tusnk] = screenName

        const tubic = 'twitter_user-background_image'
        twitterUserBackgroundImage.classList.add(tubic)
        twitterUserBackgroundImage.dataset['imgSrc'] = profileBanner

        const tupic = 'twitter_user-profile_image'
        const ttic = 'tweet-twitter_icon'
        twitterUserProfileImage.classList.add(tupic, ttic)
        twitterUserProfileImage.style.display = 'flex'
        twitterUserProfileImage.style.justifyContent = 'space-between'

        twitterUserProfileImageA.classList.add(tac)
        twitterUserProfileImageA.style.position = 'relative'
        twitterUserProfileImageA.dataset[tusnk] = screenName

        const keyname = 'twitter-view_clear_icon'
        twitterUserProfileImageAImg.src = localStorage.getItem(keyname)
            ? profileImage.replace('_normal', '_400x400')
            : profileImage
        twitterUserProfileImageAImg.crossOrigin = 'anonymous'
        twitterUserProfileImageAImg.style.position = 'absolute'
        twitterUserProfileImageAImg.style.height = '100%'
        twitterUserProfileImageAImg.style.borderRadius = '50%'

        twitterUserProfileImageA.appendChild(twitterUserProfileImageAImg)

        const tulfbc = 'twitter_user-lists_follow_button'
        twitterUserListsFollowButton.classList.add(tulfbc)
        twitterUserListsFollowButton.style.padding = '5px 0'

        const tulbc = 'twitter_user-lists_button'
        twitterUserListsButton.classList.add(bsbtnc, apbtnc, tulbc)
        twitterUserListsButton.dataset[tusnk] = screenName
        twitterUserListsButton.dataset['twitter_userLists_status'] = 'unknown'
        twitterUserListsButton.style.borderRadius = '100px'
        twitterUserListsButton.style.margin = '0 10px 10px'
        twitterUserListsButton.style.height = '2.66rem'
        twitterUserListsButton.style.width = '2.66rem'

        twitterUserListsButtonSvg.classList.add('bi')
        sicon(twitterUserListsButtonSvgUse, 'three-dots')
        twitterUserListsButtonSvg.appendChild(twitterUserListsButtonSvgUse)

        twitterUserListsButton.appendChild(twitterUserListsButtonSvg)

        const tufbc = 'twitter_user-follow_button'
        twitterUserFollowButton.classList.add(bsbtnc, tufbc)
        following
            ? twitterUserFollowButton.classList.add(apbtnfillc)
            : twitterUserFollowButton.classList.add(apbtnc)
        twitterUserFollowButton.dataset[tusnk] = screenName
        twitterUserFollowButton.dataset['twitter_userFollow_status'] = following
        twitterUserFollowButton.style.borderRadius = '100px'
        twitterUserFollowButton.style.margin = '0 0 10px'
        twitterUserFollowButton.style.padding = '0 1rem'
        twitterUserFollowButton.style.height = '2.66rem'
        twitterUserFollowButton.style.fontWeight = 'bold'
        twitterUserFollowButton.textContent = following ? 'Following' : 'Follow'

        twitterUserListsFollowButton.appendChild(twitterUserListsButton)
        twitterUserListsFollowButton.appendChild(twitterUserFollowButton)

        twitterUserProfileImage.appendChild(twitterUserProfileImageA)
        twitterUserProfileImage.appendChild(twitterUserProfileImageDiv)
        twitterUserProfileImage.appendChild(twitterUserListsFollowButton)

        const tudc = 'twitter_user-details'
        twitterUserDetails.classList.add(tudc)

        const tumc = 'twitter_user-main'
        twitterUserMain.classList.add(tumc)
        twitterUserMain.style.overflow = 'hidden'

        const tunsnc = 'twitter_user-name_screen_name'
        twitterUserNameScreenName.classList.add(tunsnc)

        twitterUserNameScreenNameA.classList.add(tac)
        twitterUserNameScreenNameA.href = `/twitter/${screenName}`
        twitterUserNameScreenNameA.style.color = 'inherit'
        twitterUserNameScreenNameA.dataset[tusnk] = screenName

        const tunc = 'twitter_user-name'
        twitterUserName.classList.add(tunc)
        twitterUserName.style.overflow = 'hidden'
        twitterUserName.style.textOverflow = 'ellipsis'
        twitterUserName.style.whiteSpace = 'nowrap'

        twitterUserNameSpan.textContent = name
        twitterUserNameSpan.style.fontWeight = 'bold'

        twitterUserName.appendChild(twitterUserNameSpan)

        const tusnc = 'twitter_user-screen_name'
        twitterUserScreenName.classList.add(tusnc, aptc, aptcsc)
        twitterUserScreenName.textContent = `@${screenName}`

        twitterUserNameScreenNameA.appendChild(twitterUserName)
        twitterUserNameScreenNameA.appendChild(twitterUserScreenName)
        twitterUserNameScreenName.appendChild(twitterUserNameScreenNameA)

        const tudescriptionc = 'twitter_user-description'
        twitterUserDescription.classList.add(tudescriptionc)
        for (let index = 0; index < description.length; index++) {
            const element = description[index]
            if (Object.keys(element).indexOf('url') !== -1) {
                const twitterUserDescriptionA = dc('a')
                twitterUserDescriptionA.classList.add(ttac, ttfthc)
                twitterUserDescriptionA.target = '_blank'
                twitterUserDescriptionA.rel = 'noopener'
                twitterUserDescriptionA.style.whiteSpace = 'pre-line'
                twitterUserDescriptionA.href = element['url']
                twitterUserDescriptionA.text = element['text']
                twitterUserDescription.appendChild(twitterUserDescriptionA)
            } else {
                const twitterUserDescriptionSpan = dc('span')
                twitterUserDescriptionSpan.style.whiteSpace = 'pre-line'
                twitterUserDescriptionSpan.textContent = element['text']
                twitterUserDescription.appendChild(twitterUserDescriptionSpan)
            }
        }

        const tulocalc = 'twitter_user-local'
        const tuloc = 'twitter_user-location'
        const tulic = 'twitter_user-link'
        const tucac = 'twitter_user-created_at'

        twitterUserLocal.classList.add(tulocalc, aptc, aptcsc)
        twitterUserLocal.style.display = 'none'

        twitterUserLocation.classList.add(tuloc)
        if (location) {
            twitterUserLocation.style.marginRight = '10px'

            twitterUserLocationSvg.classList.add('bi')
            twitterUserLocationSvg.style.height = '1.25rem'
            twitterUserLocationSvg.style.width = '1.25rem'
            twitterUserLocationSvg.style.verticalAlign = 'sub'
            sicon(twitterUserLocationSvgUse, 'geo-alt')
            twitterUserLocation.appendChild(twitterUserLocationSvgUse)

            twitterUserLocationSpan.textContent = location
            twitterUserLocationSpan.style.paddingLeft = '4px'

            twitterUserLocation.appendChild(twitterUserLocationSvg)
            twitterUserLocation.appendChild(twitterUserLocationSpan)
        }

        twitterUserLink.classList.add(tulic)
        if (expandedUrl) {
            twitterUserLink.style.marginRight = '10px'

            twitterUserLinkSvg.classList.add('bi')
            twitterUserLinkSvg.style.height = '1.25rem'
            twitterUserLinkSvg.style.width = '1.25rem'
            twitterUserLinkSvg.style.verticalAlign = 'sub'
            sicon(twitterUserLinkSvgUse, 'link-45deg')
            twitterUserLinkSvg.appendChild(twitterUserLinkSvgUse)

            twitterUserLinkA.classList.add(ttac, ttfthc)
            twitterUserLinkA.target = '_blank'
            twitterUserLinkA.rel = 'noopener'
            twitterUserLinkA.href = expandedUrl
            twitterUserLinkA.style.paddingLeft = '4px'
            twitterUserLinkA.style.whiteSpace = 'pre-line'
            twitterUserLinkA.textContent = displayUrl

            twitterUserLink.appendChild(twitterUserLinkSvg)
            twitterUserLink.appendChild(twitterUserLinkA)
        }

        twitterUserCreatedAt.classList.add(tucac)
        twitterUserCreatedAt.title = createdAt

        twitterUserCreatedAtSvg.classList.add('bi')
        twitterUserCreatedAtSvg.style.height = '1.25rem'
        twitterUserCreatedAtSvg.style.width = '1.25rem'
        twitterUserCreatedAtSvg.style.verticalAlign = 'sub'
        sicon(twitterUserCreatedAtSvgUse, 'calendar3')
        twitterUserCreatedAtSvg.appendChild(twitterUserCreatedAtSvgUse)

        twitterUserCreatedAtSpan.style.paddingLeft = '4px'
        twitterUserCreatedAtSpan.textContent = createdAt

        twitterUserCreatedAt.appendChild(twitterUserCreatedAtSvg)
        twitterUserCreatedAt.appendChild(twitterUserCreatedAtSpan)

        twitterUserLocal.appendChild(twitterUserLocation)
        twitterUserLocal.appendChild(twitterUserLink)
        twitterUserLocal.appendChild(twitterUserCreatedAt)

        const tucsStr = 'twitter_user-count_status'
        const tucsc = tucsStr
        const tucscc = `${tucsStr}-comma`

        const tufavcStr = 'twitter_user-favorites_count'
        const tustatuscStr = 'twitter_user-statuses_count'
        const tufavcc = tufavcStr
        const tustatuscc = tustatuscStr
        const tufavcnc = `${tufavcStr}-number`
        const tustatuscnc = `${tustatuscStr}-number`
        const tufavcuc = `${tufavcStr}-unit`
        const tustatuscuc = `${tustatuscStr}-unit`

        twitterUserCountStatus.classList.add(tucsc)
        twitterUserCountStatus.style.display = 'flex'

        twitterUserFavoritesCount.classList.add(tufavcc)
        twitterUserFavoritesCountNumber.classList.add(tufavcnc)
        twitterUserFavoritesCountNumber.style.fontWeight = 'bold'
        twitterUserFavoritesCountNumber.textContent = favoritesCount.toLocaleString()
        twitterUserFavoritesCountUnit.classList.add(tufavcuc, aptc, aptcsc)
        twitterUserFavoritesCountUnit.textContent = ' likes'

        twitterUserFavoritesCount.appendChild(twitterUserFavoritesCountNumber)
        twitterUserFavoritesCount.appendChild(twitterUserFavoritesCountUnit)

        twitterUserStatusesCount.classList.add(tustatuscc)
        twitterUserStatusesCountSpan.classList.add(tucscc, aptc, aptcsc)
        twitterUserStatusesCountSpan.textContent = ', '
        twitterUserStatusesCountNumber.classList.add(tustatuscnc)
        twitterUserStatusesCountNumber.style.fontWeight = 'bold'
        twitterUserStatusesCountNumber.textContent = statusesCount.toLocaleString()
        twitterUserStatusesCountUnit.classList.add(tustatuscuc, aptc, aptcsc)
        twitterUserStatusesCountUnit.textContent = ' tweets'

        twitterUserStatusesCount.appendChild(twitterUserStatusesCountSpan)
        twitterUserStatusesCount.appendChild(twitterUserStatusesCountNumber)
        twitterUserStatusesCount.appendChild(twitterUserStatusesCountUnit)

        twitterUserCountStatus.appendChild(twitterUserFavoritesCount)
        twitterUserCountStatus.appendChild(twitterUserStatusesCount)

        const tusStr = 'twitter_user-status'
        const tusc = tusStr
        const tuscc = `${tusStr}-comma`

        const tufingcStr = 'twitter_user-following_count'
        const tuferscStr = 'twitter_user-followers_count'
        const tufingcc = tufingcStr
        const tuferscc = tuferscStr
        const tufingcnc = `${tufingcStr}-number`
        const tuferscnc = `${tuferscStr}-number`
        const tufingcuc = `${tufingcStr}-unit`
        const tuferscuc = `${tuferscStr}-unit`

        twitterUserStatus.classList.add(tusc)
        twitterUserStatus.style.display = 'flex'

        twitterUserFollowingCount.classList.add(tufingcc)
        twitterUserFollowingCountA.href = `/twitter/${screenName}/following`
        twitterUserFollowingCountA.classList.add(tac)
        twitterUserFollowingCountNumber.classList.add(tufingcnc)
        twitterUserFollowingCountNumber.style.fontWeight = 'bold'
        twitterUserFollowingCountNumber.textContent = followingCount.toLocaleString()
        twitterUserFollowingCountUnit.classList.add(tufingcuc, aptc, aptcsc)
        twitterUserFollowingCountUnit.textContent = ' Following'

        twitterUserFollowingCountA.appendChild(twitterUserFollowingCountNumber)
        twitterUserFollowingCountA.appendChild(twitterUserFollowingCountUnit)
        twitterUserFollowingCount.appendChild(twitterUserFollowingCountA)

        twitterUserFollowersCount.classList.add(tuferscc)
        twitterUserFollowersCountSpan.classList.add(tuscc, aptc, aptcsc)
        twitterUserFollowersCountSpan.textContent = ', '
        twitterUserFollowersCountA.href = `/twitter/${screenName}/followers`
        twitterUserFollowersCountA.classList.add(tac)
        twitterUserFollowersCountNumber.classList.add(tuferscnc)
        twitterUserFollowersCountNumber.style.fontWeight = 'bold'
        twitterUserFollowersCountNumber.textContent = followersCount.toLocaleString()
        twitterUserFollowersCountUnit.classList.add(tuferscuc, aptc, aptcsc)
        twitterUserFollowersCountUnit.textContent = ' Followers'

        twitterUserFollowersCountA.appendChild(twitterUserFollowersCountNumber)
        twitterUserFollowersCountA.appendChild(twitterUserFollowersCountUnit)
        twitterUserFollowersCount.appendChild(twitterUserFollowersCountSpan)
        twitterUserFollowersCount.appendChild(twitterUserFollowersCountA)

        twitterUserStatus.appendChild(twitterUserFollowingCount)
        twitterUserStatus.appendChild(twitterUserFollowersCount)

        twitterUserMain.appendChild(twitterUserNameScreenName)
        twitterUserMain.appendChild(twitterUserDescription)
        twitterUserMain.appendChild(twitterUserLocal)
        twitterUserMain.appendChild(twitterUserCountStatus)
        twitterUserMain.appendChild(twitterUserStatus)

        const tuptnStr = 'twitter_user-profile_timeline_navigation'
        const tuptnb = twitterUserProfileTimelineNavigationBlock
        const tuptnbc = `${tuptnStr}-block`
        tuptnb.classList.add(tuptnbc, aptc, aptbc)
        tuptnb.style.display = 'none'
        tuptnb.style.margin = '12px 0 0'
        tuptnb.style.borderBottomStyle = 'solid'
        tuptnb.style.borderBottomWidth = '1px'
        const tuptn = twitterUserProfileTimelineNavigation
        const tuptnc = tuptnStr
        tuptn.classList.add(tuptnc)
        tuptn.style.display = 'flex'
        const tuptnt = twitterUserProfileTimelineNavigationTweets
        const tuptnwr = twitterUserProfileTimelineNavigationWithReplies
        const tuptnm = twitterUserProfileTimelineNavigationMedia
        const tuptnl = twitterUserProfileTimelineNavigationLikes
        const tuptnic = `${tuptnStr}-item`
        const tuptnsc = `${tuptnStr}-selected`
        const tuptntc = `${tuptnStr}-tweets`
        const tuptnwrc = `${tuptnStr}-with_replies`
        const tuptnmc = `${tuptnStr}-media`
        const tuptnlc = `${tuptnStr}-likes`
        tuptnt.classList.add(tuptnic, tuptntc, tuptnsc, aptc, aptbgsc, aptcsc)
        tuptnwr.classList.add(tuptnic, tuptnwrc, aptc, aptbgsc, aptcsc)
        tuptnm.classList.add(tuptnic, tuptnmc, aptc, aptbgsc, aptcsc)
        tuptnl.classList.add(tuptnic, tuptnlc, aptc, aptbgsc, aptcsc)
        const tuptnta = twitterUserProfileTimelineNavigationTweetsA
        const tuptnwra = twitterUserProfileTimelineNavigationWithRepliesA
        const tuptnma = twitterUserProfileTimelineNavigationMediaA
        const tuptnla = twitterUserProfileTimelineNavigationLikesA
        tuptnta.href = `/twitter/${screenName}`
        tuptnwra.href = `/twitter/${screenName}/with_replies`
        tuptnma.href = `/twitter/${screenName}/media`
        tuptnla.href = `/twitter/${screenName}/likes`
        tuptnta.text = 'Tweets'
        tuptnwra.text = 'Tweets & replies'
        tuptnma.text = 'Media'
        tuptnla.text = 'Likes'

        tuptnt.appendChild(tuptnta)
        tuptnwr.appendChild(tuptnwra)
        tuptnm.appendChild(tuptnma)
        tuptnl.appendChild(tuptnla)
        tuptn.appendChild(tuptnt)
        tuptn.appendChild(tuptnwr)
        tuptn.appendChild(tuptnm)
        tuptn.appendChild(tuptnl)
        tuptnb.appendChild(tuptn)

        twitterUserDetails.appendChild(twitterUserMain)
        twitterUserDetails.appendChild(tuptnb)

        twitterUser.appendChild(twitterUserBackgroundImage)
        twitterUser.appendChild(twitterUserProfileImage)
        twitterUser.appendChild(twitterUserDetails)

        return twitterUser
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'twitter_user-lists_button')) {
            twitterUserListsButtonClick(e)
        }
    })

    function twitterUserListsButtonClick(e) {
        const target = findParents(e.target, 'twitter_user-lists_button')
        const lists_status = target.dataset['twitter_userLists_status']
        const screen_name = target.dataset['twitter_userScreen_name']
        const twitterUserListButton = document.querySelectorAll(
            '.twitter_user-lists_button'
        )
        for (let index = 0; index < twitterUserListButton.length; index++) {
            const element = twitterUserListButton[index]
            const keyname = 'twitter_userScreen_name'
            if (element.dataset[keyname] === screen_name) {
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

    async function listsMembers(screen_name) {
        const href = '/twitter/lists/members'
        try {
            const fetching = fetch(href, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify({
                    screen_name: screen_name,
                }),
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })

            const response = await fetching
            if (response.ok === false) {
                error(response)
                return
            }

            const data = await response.text()

            const keyname = 'twitter_userScreen_name'
            const twitterUserListButton = document.querySelectorAll(
                '.twitter_user-lists_button'
            )
            for (let index = 0; index < twitterUserListButton.length; index++) {
                const element = twitterUserListButton[index]
                if (element.dataset[keyname] === screen_name) {
                    element.disabled = false
                    const keyname = 'twitter_userLists_status'
                    if (data === 'untracked') {
                        const i = document.createElement('i')
                        i.classList.add('fas', 'fa-user-plus')
                        utils.emptyNode(element)
                        element.appendChild(i)
                        element.dataset[keyname] = 'untracked'
                    } else if (data === 'tracked') {
                        const i = document.createElement('i')
                        i.classList.add('fas', 'fa-user-check')
                        utils.emptyNode(element)
                        element.appendChild(i)
                        element.dataset[keyname] = 'tracked'
                    }
                }
            }
        } catch (err) {
            error(err)
        }
    }

    async function listsMembersCreate(screen_name) {
        const href = '/twitter/lists/members/create'
        try {
            const fetching = fetch(href, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify({
                    screen_name: screen_name,
                }),
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })

            const response = await fetching
            if (response.ok === false) {
                error(response)
                return
            }

            const data = await response.text()

            log(data)
            const keyname = 'twitter_userScreen_name'
            const twitterUserListButton = document.querySelectorAll(
                '.twitter_user-lists_button'
            )
            for (let index = 0; index < twitterUserListButton.length; index++) {
                const element = twitterUserListButton[index]
                if (element.dataset[keyname] === screen_name) {
                    element.disabled = false
                    const i = document.createElement('i')
                    i.classList.add('fas', 'fa-user-check')
                    utils.emptyNode(element)
                    element.appendChild(i)
                    element.dataset['twitter_userLists_status'] = 'tracked'
                }
            }
        } catch (err) {
            error(err)
        }
    }

    async function listsMembersDestroy(screen_name) {
        const href = '/twitter/lists/members/destroy'
        try {
            const fetching = fetch(href, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify({
                    screen_name: screen_name,
                }),
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })

            const response = await fetching
            if (response.ok === false) {
                error(response)
                return
            }

            const data = await response.text()

            log(data)
            const keyname = 'twitter_userScreen_name'
            const twitterUserListButton = document.querySelectorAll(
                '.twitter_user-lists_button'
            )
            for (let index = 0; index < twitterUserListButton.length; index++) {
                const element = twitterUserListButton[index]
                if (element.dataset[keyname] === screen_name) {
                    element.disabled = false
                    const i = document.createElement('i')
                    i.classList.add('fas', 'fa-user-plus')
                    utils.emptyNode(element)
                    element.appendChild(i)
                    element.dataset['twitter_userLists_status'] = 'untracked'
                }
            }
        } catch (err) {
            error(err)
        }
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'twitter_user-follow_button')) {
            twitterUserFollowButtonClick(e)
        }
    })

    function twitterUserFollowButtonClick(e) {
        const target = findParents(e.target, 'twitter_user-follow_button')
        const keyname = 'twitter_userFollow_status'
        const follow_status = target.dataset[keyname] === 'true'
        const screen_name = target.dataset['twitter_userScreen_name']

        const twitterUserFollowButton = document.querySelectorAll(
            '.twitter_user-follow_button'
        )
        for (let index = 0; index < twitterUserFollowButton.length; index++) {
            const element = twitterUserFollowButton[index]
            if (element.dataset['twitter_userScreen_name'] === screen_name) {
                element.disabled = true
            }
        }

        !follow_status && friendshipsCreate(screen_name)
        follow_status && friendshipsDestroy(screen_name)
    }

    async function friendshipsCreate(screen_name) {
        const href = '/twitter/friendships/create'
        try {
            const fetching = fetch(href, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify({
                    screen_name: screen_name,
                }),
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })

            const response = await fetching
            if (response.ok === false) {
                error(response)
            }
            await response.text()

            const tufb = document.querySelectorAll(
                '.twitter_user-follow_button'
            )
            const keyname = 'twitter_userScreen_name'
            for (let index = 0; index < tufb.length; index++) {
                const element = tufb[index]
                if (element.dataset[keyname] === screen_name) {
                    utils.removeClass(element, 'btn-outline-primary')
                    element.classList.add('btn-primary')
                    element.innerHTML = 'Following'
                    element.dataset['twitter_userFollow_status'] = true
                    element.disabled = false
                }
            }
        } catch (err) {
            error(err)
        }
    }

    async function friendshipsDestroy(screen_name) {
        const href = '/twitter/friendships/destroy'
        try {
            const fetching = fetch(href, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify({
                    screen_name: screen_name,
                }),
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })

            const response = await fetching
            if (response.ok === false) {
                error(response)
            }
            await response.text()

            const tufb = document.querySelectorAll(
                '.twitter_user-follow_button'
            )
            const keyname = 'twitter_userScreen_name'
            for (let index = 0; index < tufb.length; index++) {
                const element = tufb[index]
                if (element.dataset[keyname] === screen_name) {
                    utils.removeClass(element, 'btn-primary')
                    element.classList.add('btn-outline-primary')
                    element.innerHTML = 'Follow'
                    element.dataset['twitter_userFollow_status'] = false
                    element.disabled = false
                }
            }
        } catch (err) {
            error(err)
        }
    }

    document.addEventListener('mouseover', e => {
        if (findParents(e.target, 'twitter_user-follow_button')) {
            twitterUserFollowButtonMouseover(e)
        }
    })

    function twitterUserFollowButtonMouseover(e) {
        const target = findParents(e.target, 'twitter_user-follow_button')
        const fs = target.dataset['twitter_userFollow_status'] === 'true'
        target.innerText = fs === true ? 'Unfollow' : 'Follow'
        target.classList.add(fs === true ? 'btn-danger' : '')
    }

    document.addEventListener('mouseout', e => {
        if (findParents(e.target, 'twitter_user-follow_button')) {
            twitterUserFollowButtonMouseout(e)
        }
    })

    function twitterUserFollowButtonMouseout(e) {
        const target = findParents(e.target, 'twitter_user-follow_button')
        const fs = target.dataset['twitter_userFollow_status'] === 'true'
        target.innerText = fs === true ? 'Following' : 'Follow'
        utils.removeClass(target, 'btn-danger')
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'tweet-twitter_favorite')) {
            tweetTwitterFavoriteClick(e)
        }
    })

    function tweetTwitterFavoriteClick(e) {
        const target = findParents(e.target, 'tweet-twitter_favorite')
        const keyname = 'tweet_favorited'
        const tweet_favorited = target.dataset[keyname] === 'true'
        const tweet_id = target.dataset['tweet_id']
        const tweetTwitterFavorite = document.querySelectorAll(
            '.tweet-twitter_favorite'
        )
        for (let index = 0; index < tweetTwitterFavorite.length; index++) {
            const element = tweetTwitterFavorite[index]
            if (parseInt(element.dataset['tweet_id']) === tweet_id) {
                element.disabled = true
            }
        }
        tweet_favorited && favoritesDestroy(tweet_id)
        !tweet_favorited && favoritesCreate(tweet_id)
    }

    async function favoritesCreate(tweet_id) {
        const href = '/twitter/favorites/create'
        try {
            const fetching = fetch(href, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify({
                    tweet_id: tweet_id,
                }),
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })

            const response = await fetching
            if (response.ok === false) {
                error(response)
            }
            const data = await response.text()

            utils.saveApCache(href, data)
            const selectors = '.tweet-twitter_favorite'
            updateTweetSocial(tweet_id, href, selectors)
        } catch (err) {
            error(err)
        }
    }

    async function favoritesDestroy(tweet_id) {
        const href = '/twitter/favorites/destroy'
        try {
            const fetching = fetch(href, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify({
                    tweet_id: tweet_id,
                }),
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })

            const response = await fetching
            if (response.ok === false) {
                error(response)
            }
            const data = await response.text()

            utils.saveApCache(href, data)
            const selectors = '.tweet-twitter_favorite'
            updateTweetSocial(tweet_id, href, selectors)
        } catch (err) {
            error(err)
        }
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'tweet-twitter_retweet')) {
            tweetTwitterRetweetClick(e)
        }
    })

    function tweetTwitterRetweetClick(e) {
        const target = findParents(e.target, 'tweet-twitter_retweet')
        const keyname = 'tweet_retweeted'
        const tweet_retweet = target.dataset[keyname] === 'true'
        const tweet_id = target.dataset['tweet_id']
        const tweetTwitterRetweet = document.querySelectorAll(
            '.tweet-twitter_retweet'
        )
        for (let index = 0; index < tweetTwitterRetweet.length; index++) {
            const element = tweetTwitterRetweet[index]
            if (parseInt(element.dataset['tweet_id']) === tweet_id) {
                element.disabled = true
            }
        }
        tweet_retweet && statusesUnretweet(tweet_id)
        !tweet_retweet && statusesRetweet(tweet_id)
    }

    async function statusesRetweet(tweet_id) {
        const href = '/twitter/statuses/retweet'
        try {
            const fetching = fetch(href, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify({
                    tweet_id: tweet_id,
                }),
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })

            const response = await fetching
            if (response.ok === false) {
                error(response)
            }
            const data = await response.text()

            utils.saveApCache(href, data)
            const selectors = '.tweet-twitter_retweet'
            updateTweetSocial(tweet_id, href, selectors)
        } catch (err) {
            error(err)
        }
    }

    async function statusesUnretweet(tweet_id) {
        const href = '/twitter/statuses/unretweet'
        try {
            const fetching = fetch(href, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify({
                    tweet_id: tweet_id,
                }),
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })

            const response = await fetching
            if (response.ok === false) {
                error(response)
            }
            const data = await response.text()

            utils.saveApCache(href, data)
            const selectors = '.tweet-twitter_retweet'
            updateTweetSocial(tweet_id, href, selectors)
        } catch (err) {
            error(err)
        }
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'tweet-twitter_share')) {
            tweetTwitterShareClick(e)
        }
    })

    async function tweetTwitterShareClick(e) {
        if (!navigator.share) return undefined
        const target = findParents(e.target, 'twitter_anchor')
        const targetHref = target.getAttribute('href')
        const screenName = targetHref.split('/')[2]
        const url = `${location.origin}${targetHref}`
        const text = `@${screenName} tweet on Twitter for Aqua Projects`
        try {
            await navigator.share({
                title: 'Twitter for Aqua Projects',
                text,
                url,
            })
        } catch (e) {
            error(e)
        }
    }

    function updateTweetSocial(tweet_id, href, selectors) {
        try {
            const ttsCache = utils.getApCache(href).querySelectorAll(selectors)
            const tts = document.querySelectorAll(selectors)
            const keyname = 'tweet_id'
            for (let index = 0; index < tts.length; index++) {
                const element = tts[index]
                if (element.dataset[keyname] === tweet_id) {
                    const social = findParents(element, 'tweet-twitter_social')
                    const socialCache = findParents(
                        Array.from(ttsCache).find(element => {
                            return element.dataset[keyname] === tweet_id
                        }),
                        'tweet-twitter_social'
                    )
                    social.parentNode.insertBefore(socialCache, social)
                    social.remove()
                }
            }
        } catch (err) {
            error(err)
        }
    }

    document.addEventListener('click', e => {
        const className = 'twitter_user-profile_timeline_navigation-item'
        if (findParents(e.target, className)) {
            twitterUserProfileTimelineNavigationItemClick(e)
            e.preventDefault()
        }
    })

    function twitterUserProfileTimelineNavigationItemClick(e) {
        const className = 'twitter_user-profile_timeline_navigation-item'
        const target = findParents(e.target, className)
        const href = target.querySelector('a').href.replace(location.origin, '')
        twitterUserProfileTimelineNavigationSelected(target)
        twitterUserProfileTimelineNavigationPushState(href)
        twitterUserProfileTimelineNavigationLoader()
        window.scrollTo(0, 0)
        twitterUserProfileTimelineNavigationFetch(href)
    }

    function twitterUserProfileTimelineNavigationSelected(element) {
        const className = '.twitter_user-profile_timeline_navigation-item'
        const tuptni = document.querySelectorAll(className)

        const tuptnsClassName =
            'twitter_user-profile_timeline_navigation-selected'

        for (let index = 0; index < tuptni.length; index++) {
            const element = tuptni[index]
            utils.removeClass(element, tuptnsClassName)
        }
        element.classList.add(tuptnsClassName)
    }

    function twitterUserProfileTimelineNavigationPushState(href) {
        const targetPage = href
        const currentPage = utils.getCurrentPage()
        const replaceState = Object.assign({}, history.state)
        replaceState['scrollTop'] = window.scrollY
        history.replaceState(replaceState, null, currentPage)
        history.pushState({ targetPage, currentPage }, null, targetPage)
        utils.updateDocumentTitle()
    }

    function twitterUserProfileTimelineNavigationLoader() {
        const formatTimeline = document.querySelector('.format_timeline')
        formatTimeline && utils.emptyNode(formatTimeline)
        const loader = document.createElement('div')
        loader.className = 'loader'
        document.querySelector('.format_timeline').appendChild(loader)
    }

    async function twitterUserProfileTimelineNavigationFetch(href) {
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')
        !(() => {
            utils.removeClass(ajaxProgressBar, 'bg-danger')
            ajaxProgressBar.parentNode.style.visibility = ''
            ajaxProgressBar.style.width = '80%'
        })()

        // Cache exsists.
        if (window.AquaProjectsCache[href]) {
            utils.repaintNode(href, '#main', true)

            ajaxProgressBar.style.width = '100%'

            window.dispatchEvent(new Event('aquaprojects_popstate'))
        }

        try {
            const fetching = fetch(href, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
            })

            const response = await fetching
            if (response.ok === false) {
                error(response)
                showError()
                return
            }
            const data = await response.text()

            // Save Cache.
            utils.saveApCache(href, data)
            if (href != location.href.replace(location.origin, '')) {
                log('It seems that you moved to a different page first.')
                return
            }
            utils.repaintNode(href, '#main')

            window.dispatchEvent(new Event('aquaprojects_popstate'))

            ajaxProgressBar.style.width = '100%'
            ajaxProgressBar.style.transition = 'width 0.1s ease 0s'

            setTimeout(() => {
                ajaxProgressBar.parentNode.style.visibility = 'hidden'
                ajaxProgressBar.style.width = '0%'
                ajaxProgressBar.style.transition = ''
            }, 200)
        } catch (err) {
            error(err)
            showError()
        }
    }

    document.addEventListener(
        'focus',
        e => {
            if (e.target.classList.contains('twitter-search_box-input')) {
                twitterSearachBoxInputFocus(e)
            }
        },
        true
    )

    function twitterSearachBoxInputFocus(e) {
        const tsb = findParents(e.target, 'twitter-search_box')
        const border = tsb.querySelector('.twitter-search_box-border')
        const icon = tsb.querySelector('.twitter-search_box-icon')
        const input = tsb.querySelector('.twitter-search_box-input')
        const close = tsb.querySelector('.twitter-search_box-close')

        border.style.borderColor = '#1da1f2'
        icon.style.color = '#1da1f2'
        if (input.value !== '') {
            close.style.display = 'flex'
        }
    }

    document.addEventListener(
        'blur',
        e => {
            if (e.target.classList.contains('twitter-search_box-input')) {
                twitterSearachBoxInputBlur(e)
            }
        },
        true
    )

    function twitterSearachBoxInputBlur(e) {
        const tsb = findParents(e.target, 'twitter-search_box')
        const border = tsb.querySelector('.twitter-search_box-border')
        const icon = tsb.querySelector('.twitter-search_box-icon')
        const input = tsb.querySelector('.twitter-search_box-input')
        const close = tsb.querySelector('.twitter-search_box-close')

        border.style.borderColor = ''
        icon.style.color = '#657786'
        close.style.display = 'none'

        if (input.dataset['cleared'] === 'true') {
            input.focus()
            input.dataset['cleared'] = false
        }
    }

    document.addEventListener('mousedown', e => {
        if (findParents(e.target, 'twitter-search_box-close')) {
            twitterSearchBoxCloseMousedown(e)
        }
    })

    function twitterSearchBoxCloseMousedown(e) {
        const tsb = findParents(e.target, 'twitter-search_box')
        const input = tsb.querySelector('.twitter-search_box-input')
        const close = tsb.querySelector('.twitter-search_box-close')

        input.value = ''
        input.dataset['cleared'] = true
        close.style.display = 'none'
    }

    document.addEventListener('input', e => {
        if (e.target.classList.contains('twitter-search_box-input')) {
            twitterSearchBoxInputInput(e)
        }
    })

    function twitterSearchBoxInputInput(e) {
        const tsb = findParents(e.target, 'twitter-search_box')
        const input = tsb.querySelector('.twitter-search_box-input')
        const close = tsb.querySelector('.twitter-search_box-close')

        if (input.value !== '') {
            close.style.display = 'flex'
        } else {
            close.style.display = 'none'
        }
    }

    document.addEventListener('keydown', e => {
        const keyCode = e.keyCode
        if (keyCode !== 13) return
        if (utils.locationMatch('/twitter')) {
            e.target.value !== '' &&
                e.target.classList.contains('twitter-search_box-input') &&
                twitterSearchBoxInputKeydown(e)
        }
    })

    function twitterSearchBoxInputKeydown(e) {
        const query = e.target.value
        const href = `/twitter/search?q=${query}`
        twitterUserProfileTimelineNavigationPushState(href)
        twitterSearchLoader()
        window.scrollTo(0, 0)
        twitterUserProfileTimelineNavigationFetch(href)
        document.querySelector('.twitter-search_box-input').blur()
        document.querySelector('.twitter_title-home-text').innerHTML = query
    }

    function twitterSearchLoader() {
        const twitterUser = document.querySelector('#twitter_user')
        twitterUser !== null && twitterUser.remove()

        const tweets = document.querySelectorAll('.tweet')
        for (let index = 0; index < tweets.length; index++) {
            tweets[index].remove()
        }

        const formatTimeline = document.querySelector('.format_timeline')
        const loader = document.createElement('div')
        loader.classList.add('loader')
        formatTimeline.appendChild(loader)
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'twitter_title-home-search')) {
            twitterTitleHomeSearchClick(e)
        }
    })

    function twitterTitleHomeSearchClick(e) {
        const tthb = findParents(e.target, 'twitter_title-home-block')
        const tthbChildren = tthb.children
        const titleSearchBox = tthb.querySelector('.twitter-search_box')
        const titleSearchBoxInput = tthb.querySelector(
            '.twitter-search_box-input'
        )

        tthb.style.grid = 'auto / auto'
        tthb.style.padding = '0'
        Array.from(tthbChildren).forEach(
            element => (element.style.display = 'none')
        )
        titleSearchBox.style.display = ''
        titleSearchBoxInput.value = ''
        titleSearchBoxInput.focus()
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'twitter-search_box-back')) {
            twitterSearchBoxBackClick(e)
        }
    })

    function twitterSearchBoxBackClick(e) {
        const tthb = findParents(e.target, 'twitter_title-home-block')
        const tthbChildren = tthb.children
        const titleSearchBox = tthb.querySelector('.twitter-search_box')

        tthb.style.grid =
            location.pathname === '/twitter'
                ? 'auto auto / 1fr 3rem 3rem 3rem'
                : 'auto auto / 3rem 1fr 3rem 3rem 3rem'
        tthb.style.padding = '0.3rem'
        Array.from(tthbChildren).forEach(
            element => (element.style.display = '')
        )
        titleSearchBox.style.display = 'none'
        titleSearchBox.blur()
    }

    document.addEventListener(
        'blur',
        e => {
            if (e.target.classList.contains('twitter-search_box-input')) {
                if (findParents(e.target, 'twitter_title-home-block')) {
                    twitterSearchBoxInputBlur(e)
                }
            }
        },
        true
    )

    function twitterSearchBoxInputBlur(e) {
        const className = 'twitter_title-home-block'
        const twitterTitleHome = findParents(e.target, className)
        twitterTitleHome.querySelector('.twitter-search_box-back').click()
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'twitter_title-home-twitter-profile')) {
            twitterTitleHomeTwitterProfileClick()
        }
    })

    async function twitterTitleHomeTwitterProfileClick() {
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')
        const href = '/twitter/profile'
        const selectors = '.twitter-profile'
        const twitterProfileArea = document.querySelector(selectors)

        if (window.AquaProjectsCache[href]) {
            utils.repaintNode(href, selectors)
        } else {
            await refreshtwitterProfile(href)
        }

        twitterProfileArea.querySelector('a').click()
        ajaxProgressBar.style.width = '80%'
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'twitter-back')) {
            twitterBackClick(e)
        }
    })

    function twitterBackClick() {
        const targetPage = '/twitter'
        const currentPage = utils.getCurrentPage()
        if (history.state['currentPage'] === currentPage) {
            history.pushState({ targetPage, currentPage }, null, targetPage)
            changeContent(targetPage)
        } else {
            history.back()
        }
    }

    function averageColorByImage(src) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => {
                canvas.height = img.height
                canvas.width = img.width
                const scale = '0.05'
                const dWidth = img.width * scale
                const dHeight = img.height * scale
                ctx.drawImage(
                    img,
                    0,
                    0,
                    img.width,
                    img.height,
                    0,
                    0,
                    dWidth,
                    dHeight
                )
                const imageData = ctx.getImageData(0, 0, dWidth, dHeight)

                const worker = new Worker('/webworker.js')
                worker.addEventListener('message', e => {
                    switch (e.data['name']) {
                        case 'averageColor': {
                            const rgb = e.data['msg']
                            resolve(rgb)
                            break
                        }
                        default: {
                            error(e)
                        }
                    }
                    worker.terminate()
                })
                worker.postMessage({
                    cmd: 'averageColor',
                    msg: [imageData, dWidth, dHeight],
                })
            }
            img.onerror = e => reject(e)
            img.src = src
        })
    }

    function rgb2hsl(rgb) {
        const r = rgb[0] / 255
        const g = rgb[1] / 255
        const b = rgb[2] / 255

        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const diff = max - min

        const h = calculateH()
        const l = ((max + min) / 2) * 100
        const s = (diff / (1 - Math.abs(max + min - 1))) * 100
        return [h, s, l]

        function calculateH() {
            switch (min) {
                case max:
                    return 0
                case r:
                    return (60 * (b - g)) / diff + 180
                case g:
                    return 60 + (r - b) / diff + 300
                case b:
                    return (60 * (g - r)) / diff + 60
            }
        }
    }

    function showError() {
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')
        ajaxProgressBar.classList.add('bg-danger')
        ajaxProgressBar.style.width = '100%'
        error('fail. something happen.')
        const e = document.createElement('div')
        e.innerText = 'Looks like you lost your connection. '
        e.innerText += 'Please check it and try again.'
        const i = document.createElement('i')
        i.classList.add('fas', 'fa-exclamation-circle')
        document.querySelector('#main').innerHTML =
            '<div style="word-break: break-all; margin: 8px auto auto;"><div style="margin: 0px auto; width: fit-content;"><div style="width: fit-content; margin: 0px auto;"><i class="fas fa-exclamation-circle"></i></div>Looks like you lost your connection. Please check it and try again.</div></div>'
    }
})()
