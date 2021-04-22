import { findParents, log, error } from './utils.js'
import * as utils from './utils.js'
!(() => {
    !(() => {
        const cacheName = location.href.replace(location.origin, '')
        window.AquaProjectsCache[cacheName] = document.cloneNode(true)
        const currentPage = utils.getCurrentPage()
        utils.updateDocumentTitle()
        const state = {
            targetPage: currentPage,
            currentPage,
        }
        history.replaceState(state, null, currentPage)
        markDashboardAnchorGroup()
        updateFilesToCache()
    })()

    document.addEventListener('click', e => {
        if (findParents(e.target, 'dashboard_anchor')) {
            dashboardAnchorClick(e)
        }
    })

    function dashboardAnchorClick(e) {
        const da = findParents(e.target, 'dashboard_anchor')
        const targetPage = da.getAttribute('href').replace(location.origin, '')
        const currentPage = utils.getCurrentPage()
        history.pushState({ targetPage, currentPage }, null, targetPage)
        utils.updateDocumentTitle()
        currentPage === targetPage ? scrollPageTop() : window.scrollTo(0, 0)

        resetDashboardAnchorGroup()
        markDashboardAnchorGroup()
        changeContent(targetPage)
        e.preventDefault()
    }

    window.addEventListener('popstate', () => {
        // When we access the page at the first time, we don't do nothing.
        if (!history.state) return
        // dashboard anchor settings.
        resetDashboardAnchorGroup()
        const selectors = `.dashboard_anchor_${location.pathname.split('/')[1]}`
        const da = document.querySelector(selectors)
        da && da.classList.add('select_active_dashboard')
        const body = document.querySelector('body')
        body.style.marginRight = ''
        body.style.overflowY = ''
        resetDashboardAnchorGroup()
        markDashboardAnchorGroup()
        if (utils.locationMatch('/twitter')) {
            changeTwitterContentOptimized(history.state['targetPage'])
        } else if (utils.locationMatch('/newsplus')) {
            changeTwitterContent(history.state['targetPage'])
        } else {
            changeContentWithPopstate(history.state['targetPage'])
        }
        utils.updateDocumentTitle()
        return
    })

    function changeTwitterContentOptimized(href) {
        closeAccountInformation()

        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')
        if (!window.AquaProjectsCache[href]) {
            const changeContentArea = document.querySelector('#main')
            ajaxProgressBar.classList.add('bg-danger')
            ajaxProgressBar.style.width = '100%'
            changeContentArea.innerHTML =
                '<div style="word-break: break-all; margin: 8px auto auto;"><div style="margin: 0px auto; width: fit-content;"><div style="width: fit-content; margin: 0px auto;"><i class="fas fa-exclamation-circle"></i></div>Looks like you lost your connection. Please check it and try again.</div></div>'
        }
        if (href != location.href.replace(location.origin, '')) {
            console.log('It seems that you moved to a different page first.')
            return
        }

        const cacheNode = window.AquaProjectsCache[href]
        if (cacheNode) {
            try {
                calculateSpaceToDisplay(cacheNode)
            } catch (error) {
                utils.repaintNode(href, '#main')
                console.error(error)
            }
            window.dispatchEvent(new Event('aquaprojects_popstate'))
        } else {
            const changeContentArea = document.querySelector('#main')
            changeContentArea.innerHTML =
                '<div style="word-break: break-all; margin: 8px auto auto;"><div style="margin: 0px auto; width: fit-content;"><div style="width: fit-content; margin: 0px auto;"><i class="fas fa-exclamation-circle"></i></div>Looks like you lost your connection. Please check it and try again.</div></div>'
        }

        ajaxProgressBar.style.width = '100%'
        ajaxProgressBar.style.transition = 'width 0.1s ease 0s'

        setTimeout(() => {
            ajaxProgressBar.parentNode.style.visibility = 'hidden'
            ajaxProgressBar.style.width = '0%'
            ajaxProgressBar.style.transition = ''
        }, 200)

        function calculateSpaceToDisplay(cacheNodeNoCopy) {
            const formatTimelineHeight = history.state['format_timeline_height']

            const df = document.createDocumentFragment()

            let saveElement = null
            const mainAreaWithoutFormatTimeline = createDocWithoutById(
                cacheNodeNoCopy.querySelector('.format_timeline'),
                'main'
            )
            Array.from(mainAreaWithoutFormatTimeline.children).forEach(
                element => {
                    df.appendChild(element)
                }
            )

            const main = document.querySelector('#main')
            utils.emptyNode(main)
            while (df.firstChild) main.appendChild(df.firstChild)

            // Add twitter_new_tweets_of_no_content
            const newTweetOfNoContent = document.createElement('div')
            newTweetOfNoContent.className = 'twitter_new_tweets_of_no_content'
            newTweetOfNoContent.style.height = `${formatTimelineHeight}px`
            const ft = document.querySelector('.format_timeline')
            ft.appendChild(newTweetOfNoContent)

            function absolutePath(element, elementPath) {
                const currentTagName = element.tagName
                const elementParent = element.parentNode
                const elementParentChildren = Array.from(elementParent.children)
                let elementPanretIndex = 0
                for (
                    let index = 0;
                    index < elementParentChildren.length;
                    index++
                ) {
                    const epc = elementParentChildren[index]
                    if (epc === element) {
                        elementPanretIndex = index + 1
                    }
                }
                if (elementPath === '') {
                    elementPath = `${currentTagName}:nth-child(${elementPanretIndex})`
                } else {
                    elementPath =
                        `${currentTagName}:nth-child(${elementPanretIndex}) > ` +
                        elementPath
                }
                if (elementParent.id !== '') {
                    const resultPath = `#${elementParent.id} > ${elementPath}`
                    elementPath = ''
                    return resultPath
                }
                return absolutePath(elementParent, elementPath)
            }

            function createDocWithoutById(
                removeElement,
                targetElementId,
                currentElement
            ) {
                const _parentElement = removeElement
                    ? removeElement.parentNode
                    : currentElement.parentNode
                const parentElementClone = document.createElement(
                    _parentElement.tagName
                )
                parentElementClone.id = _parentElement.id
                parentElementClone.className = _parentElement.className
                parentElementClone.style = _parentElement.style.cssText
                Object.keys(_parentElement.dataset).forEach(
                    key =>
                        (parentElementClone.dataset[key] =
                            _parentElement.dataset[key])
                )
                const currentCloseElements = Array.from(_parentElement.children)
                for (
                    let index = 0;
                    index < currentCloseElements.length;
                    index++
                ) {
                    const element = currentCloseElements[index]
                    // Not duplicate the method specified element.
                    if (element === removeElement) {
                        const _removeElement = document.createElement(
                            removeElement.tagName
                        )
                        _removeElement.id = removeElement.id
                        _removeElement.className = removeElement.className
                        _removeElement.style = removeElement.style.cssText
                        Object.keys(removeElement.dataset).forEach(
                            key =>
                                (_removeElement.dataset[key] =
                                    removeElement.dataset[key])
                        )
                        parentElementClone.appendChild(_removeElement)
                        continue
                    }

                    // Not duplicate elements specified recursively.
                    if (currentElement) {
                        if (
                            absolutePath(element) ===
                            absolutePath(currentElement)
                        ) {
                            continue
                        }
                    }

                    parentElementClone.appendChild(element.cloneNode(true))
                }
                if (saveElement) parentElementClone.appendChild(saveElement)
                saveElement = parentElementClone
                if (saveElement.id === targetElementId) {
                    return parentElementClone
                }
                return createDocWithoutById(
                    undefined,
                    targetElementId,
                    _parentElement
                )
            }
        }
    }

    function changeTwitterContent(href) {
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')

        const main = document.querySelector('#main')
        utils.emptyNode(main)
        const loader = document.createElement('div')
        loader.classList.add('loader')
        main.appendChild(loader)

        utils.removeClass(ajaxProgressBar, 'bg-danger')
        ajaxProgressBar.parentNode.style.visibility = ''
        ajaxProgressBar.style.width = '80%'

        closeAccountInformation()

        // Cache exsists.
        if (window.AquaProjectsCache[href]) {
            utils.repaintNode(href, '#main')

            ajaxProgressBar.style.width = '100%'
            if (href != location.href.replace(location.origin, '')) {
                log('It seems that you moved to a different page first.')
                return
            }
            if (history.state['scrollTop']) {
                window.scroll(0, history.state['scrollTop'])
            }
            window.dispatchEvent(new Event('aquaprojects_popstate'))

            ajaxProgressBar.style.width = '100%'
            ajaxProgressBar.style.transition = 'width 0.1s ease 0s'

            setTimeout(() => {
                ajaxProgressBar.parentNode.style.visibility = 'hidden'
                ajaxProgressBar.style.width = '0%'
                ajaxProgressBar.style.transition = ''
            }, 200)
        } else {
            ajaxProgressBar.classList.add('bg-danger')
            ajaxProgressBar.style.width = '100%'
            main.innerHTML =
                '<div style="word-break: break-all; margin: 8px auto auto;"><div style="margin: 0px auto; width: fit-content;"><div style="width: fit-content; margin: 0px auto;"><i class="fas fa-exclamation-circle"></i></div>Looks like you lost your connection. Please check it and try again.</div></div>'
        }
    }

    async function changeContentWithPopstate(href) {
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')

        if (window.AquaProjectsCache[href]) {
            const main = document.querySelector('#main')
            utils.emptyNode(main)
            utils.repaintNode(href, '#main')
            return
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
        }
    }

    async function changeContent(href) {
        const startTime = new Date().getTime()
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')

        try {
            const fetching = fetch(href, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
            })

            const response = fetching
            response
                .then(async response => {
                    const total = Number.parseInt(
                        response.headers.get('content-length')
                    )
                    const reader = response.body.getReader()
                    let data = undefined
                    return await processText(await reader.read())

                    function processText({ done, value }) {
                        if (data === undefined) {
                            // First loading
                            data = value
                        } else if (value === undefined) {
                            // Completed loading
                            // data = data
                        } else {
                            // From Second loading to last loading
                            data = uint8ArrayCombine(data, value)
                        }
                        console.log(
                            `${value ? value.length : data.length} / ${total}`
                        )
                        if (done) {
                            console.log('Stream complete.')
                            return new Promise(resolve => resolve(data))
                        }
                        return reader.read().then(processText)
                    }
                })
                .then(data => {
                    // Save Cache.
                    utils.saveApCache(
                        href,
                        new TextDecoder('utf-8').decode(data)
                    )
                    if (href !== location.href.replace(location.origin, '')) {
                        log(
                            'It seems that you moved to a different page first.'
                        )
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
                    console.log(
                        `Calculate time: ${new Date().getTime() - startTime}ms`
                    )
                })
        } catch (err) {
            error(err)
        }

        utils.removeClass(ajaxProgressBar, 'bg-danger')

        ajaxProgressBar.parentNode.style.visibility = ''
        ajaxProgressBar.style.width = '80%'

        closeAccountInformation()

        const hs = history.state
        if (hs['currentPage'] === hs['targetPage']) return false

        const main = document.querySelector('#main')
        utils.emptyNode(main)
        const loader = document.createElement('div')
        loader.classList.add('loader')
        main.appendChild(loader)

        // Cache exsists.
        if (window.AquaProjectsCache[href]) {
            setTimeout(() => {
                utils.repaintNode(href, '#main', true)

                ajaxProgressBar.style.width = '100%'
                window.dispatchEvent(new Event('aquaprojects_popstate'))
            }, 0)
        }

        function uint8ArrayCombine(u1, u2) {
            const len1 = u1.length
            const len2 = u2.length
            let newArray = new Uint8Array(len1 + len2)

            for (let i = 0; i < len1; i++) {
                newArray[i] = u1[i]
            }

            for (let i = 0; i < len2; i++) {
                newArray[i + len1] = u2[i]
            }

            return newArray
        }
    }

    const mediaQueryString = '(prefers-color-scheme: dark)'
    window.matchMedia(mediaQueryString).addEventListener('change', e => {
        const body = document.querySelector('body')
        if (e.matches) {
            document.head.children['theme-color'].content = '#15202b'
            body.style.backgroundColor = 'rgb(21, 32, 43)'
            body.style.color = 'rgb(255, 255, 255)'
        } else {
            document.head.children['theme-color'].content = '#ffffff'
            body.style.backgroundColor = 'rgb(255, 255, 255)'
            body.style.color = ''
        }
    })

    function resetDashboardAnchorGroup() {
        const daga = document.querySelectorAll('.dashboard_anchor_group a')
        for (let index = 0; index < daga.length; index++) {
            const element = daga[index]
            utils.removeClass(element, 'select_active_dashboard')
        }
        const userPicture = document.querySelector('.user_picture')
        userPicture.style.background = ''
        const account = document.querySelector('.account')
        account.style.visibility = 'hidden'
        const removeClasses = ['animated', 'fadeInUpSmall', 'faster']
        for (let index = 0; index < removeClasses.length; index++) {
            const element = removeClasses[index]
            if (account.classList && account.classList.contains(element)) {
                account.classList.remove(element)
            }
        }
    }

    function markDashboardAnchorGroup() {
        const selectors = `.dashboard_anchor_${location.pathname.split('/')[1]}`
        const da = document.querySelectorAll(selectors)
        if (da) {
            Array.from(da).forEach(element =>
                element.classList.add('select_active_dashboard')
            )
        }
    }

    function closeAccountInformation() {
        const account = document.querySelector('.account')
        const main = document.querySelector('#main')
        const removeClasses = ['animated fadeInUp faster']
        account.style.visibility = 'hidden'
        for (let index = 0; index < removeClasses.length; index++) {
            const element = removeClasses[index]
            utils.removeClass(account, element)
        }
        main.style.display = ''
    }

    function updateFilesToCache() {
        // Add cache when caches don't exist and location is not logout and login.
        const CACHE_NAME = 'static-cache-v1'
        const startUrl = '/?utm_source=homescreen'
        const offlineUrl = '/offline'

        const cacheExists = async request => {
            const response = await caches.match(request)
            return response !== undefined
        }
        if (
            location.href.replace(location.origin, '') !== '/logout' &&
            location.pathname.replace(location.origin, '') !== '/login/auth0'
        ) {
            const offline = async () => {
                log(`precache offline html --- ${location}`)
                const openCache = await caches.open(CACHE_NAME)
                const startRequest = new Request(startUrl)
                const offlineRequest = new Request(offlineUrl)
                await openCache.put(startRequest, await fetch(startRequest))
                await openCache.put(offlineRequest, await fetch(offlineRequest))
            }
            cacheExists(startUrl).then(sres => {
                if (sres === false) {
                    cacheExists(offlineUrl).then(ores => {
                        if (ores === false) {
                            offline().then(() => {
                                log(`${location} -- to add cached.`)
                            })
                        }
                    })
                }
            })
        }
    }

    function scrollPageTop() {
        scrollTop(500)

        function scrollTop(n) {
            const t = new Date(),
                i = window.pageYOffset,
                r = setInterval(() => {
                    let u = new Date() - t
                    u > n && (clearInterval(r), (u = n))
                    window.scrollTo(0, i * (1 - u / n))
                }, 10)
        }
    }
})()
