(() => {
    $(document).ready(() => {
        document.dispatchEvent(new Event('DOMContentLoaded'))
    })
    document.addEventListener('DOMContentLoaded', () => {
        AquaProjectsCache[location.href.replace(location.origin, '')] = document.cloneNode(true)
        var currentPage = location.href.replace(location.origin, '')
        if (location.pathname !== '/') document.title = 'Aqua Projects - ' + location.pathname.substring(1)
        else document.title = 'Aqua Projects'
        var state = {
            'targetPage': currentPage,
            'currentPage': currentPage,
        }
        history.replaceState(state, null, currentPage)
        const da = document.querySelector(`.dashboard_anchor_${location.pathname.split('/')[1]}`)
        if (da) da.classList.add('select_active_dashboard')
    })

    document.addEventListener('click', e => {
        if (findParents(e.target, 'dashboard_anchor')) {
            const da = findParents(e.target, 'dashboard_anchor')
            scrollPageTop()
            var targetPage = da.getAttribute('href')
            targetPage = targetPage.replace(location.origin, '')
            var currentPage = location.href.replace(location.origin, '')
            state = {
                'targetPage': targetPage,
                'currentPage': currentPage,
            }
            history.pushState(state, null, targetPage)
            document.title = 'Aqua Projects - ' + location.pathname.substring(1)

            resetDashboardAnchorGroup()
            changeContent(targetPage)
            e.preventDefault()
        }
    })

    window.addEventListener('popstate', () => {
        // When we access the page at the first time, we don't do nothing.
        if (!history.state) return false
        // dashboard anchor settings.
        resetDashboardAnchorGroup()
        const da = document.querySelector(`.dashboard_anchor_${location.pathname.split('/')[1]}`)
        da.classList.add('select_active_dashboard')
        const body = document.querySelector('body')
        body.style.marginRight = ''
        body.style.overflowY = ''
        if (`/${location.pathname.replace(location.origin, '').split('/')[1]}` === '/twitter') {
            changeTwitterContentOptimized(history.state['targetPage'])
        } else if (`/${location.pathname.replace(location.origin, '').split('/')[1]}` === '/settings') {
            changeTwitterContent(history.state['targetPage'])
        } else if (`/${location.pathname.replace(location.origin, '').split('/')[1]}` === '/newsplus') {
            changeTwitterContent(history.state['targetPage'])
        } else {
            changeContent(history.state['targetPage'])
        }
        document.title = 'Aqua Projects - ' + location.pathname.substring(1)
        return false
    })

    function changeTwitterContentOptimized(href) {
        closeAccountInformation()

        var ajaxProgressBar = document.querySelector('#ajax-progress-bar')
        if (!AquaProjectsCache[href]) {
            var changeContentArea = document.querySelector('#main')
            ajaxProgressBar.classList.add('bg-danger')
            ajaxProgressBar.style.width = '100%'
            changeContentArea.innerHTML = '<div style="word-break: break-all; margin: 8px auto auto;"><div style="margin: 0px auto; width: fit-content;"><div style="width: fit-content; margin: 0px auto;"><i class="fas fa-exclamation-circle"></i></div>Looks like you lost your connection. Please check it and try again.</div></div>'
        }
        if (href != location.href.replace(location.origin, '')) {
            console.log('It seems that you moved to a different page first.')
            return false
        }

        var cacheNode = AquaProjectsCache[href]
        if (cacheNode) {
            try {
                calculateSpaceToDisplay(cacheNode)
            } catch (error) {
                var changeLocation = document.querySelector('#main')
                while (changeLocation.firstChild) changeLocation.removeChild(changeLocation.firstChild)
                var changeLocationCloneNode = AquaProjectsCache[href].cloneNode(true).querySelector('#main')
                Array.from(changeLocationCloneNode.children).forEach(element => {
                    changeLocation.appendChild(element)
                });
                console.error(error)
            }
            window.dispatchEvent(new Event('aquaprojects_popstate'));
        } else {
            var changeContentArea = document.querySelector('#main')
            changeContentArea.innerHTML = '<div style="word-break: break-all; margin: 8px auto auto;"><div style="margin: 0px auto; width: fit-content;"><div style="width: fit-content; margin: 0px auto;"><i class="fas fa-exclamation-circle"></i></div>Looks like you lost your connection. Please check it and try again.</div></div>'
        }

        ajaxProgressBar.style.width = '100%'
        ajaxProgressBar.style.transition = 'width 0.1s ease 0s'

        setTimeout(() => {
            ajaxProgressBar.style.visibility = 'hidden'
            ajaxProgressBar.style.width = '0%'
            ajaxProgressBar.style.transition = ''
        }, 200)

        function calculateSpaceToDisplay(cacheNodeNoCopy) {
            const formatTimelineHeight = history.state['format_timeline_height']
            const mainCacheNode = cacheNodeNoCopy.querySelector('#main').cloneNode(true)
            const mainArea = document.querySelector('#main')
            while (mainArea.firstChild) mainArea.removeChild(mainArea.firstChild)
            while (mainCacheNode.firstChild) mainArea.appendChild(mainCacheNode.firstChild)
            const ft = document.querySelector('.format_timeline')
            while (ft.firstChild) ft.removeChild(ft.firstChild)
            // Add twitter_new_tweets_of_no_content
            var newTweetOfNoContent = document.createElement('div')
            newTweetOfNoContent.className = 'twitter_new_tweets_of_no_content'
            newTweetOfNoContent.style.height = `${formatTimelineHeight}px`
            ft.appendChild(newTweetOfNoContent)
        }
    }

    function changeTwitterContent(href) {
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')

        var changeContentArea = document.querySelector('#main')
        changeContentArea.innerHTML = '<div class="loader" style="font-size: 2px; margin: 8px auto auto;"></div>'

        const removeClass = 'bg-danger'
        if (ajaxProgressBar.classList && ajaxProgressBar.classList.contains(removeClass)) {
            ajaxProgressBar.classList.remove(removeClass)
        }
        ajaxProgressBar.style.visibility = 'visible'
        ajaxProgressBar.style.width = '80%'

        closeAccountInformation()

        // Cache exsists.
        if (AquaProjectsCache[href]) {
            var changeLocation = document.querySelector('#main')
            while (changeLocation.firstChild) changeLocation.removeChild(changeLocation.firstChild)
            var changeLocationCloneNode = AquaProjectsCache[href].cloneNode(true).querySelector('#main')
            Array.from(changeLocationCloneNode.children).forEach(element => {
                changeLocation.appendChild(element)
            });

            ajaxProgressBar.style.width = '100%'
            if (href != location.href.replace(location.origin, '')) {
                console.log('It seems that you moved to a different page first.')
                return false
            }
            if (history.state['scrollTop']) {
                window.scroll(0, history.state['scrollTop'])
            }
            window.dispatchEvent(new Event('aquaprojects_popstate'));

            ajaxProgressBar.style.width = '100%'
            ajaxProgressBar.style.transition = 'width 0.1s ease 0s'

            setTimeout(() => {
                ajaxProgressBar.style.visibility = 'hidden'
                ajaxProgressBar.style.width = '0%'
                ajaxProgressBar.style.transition = ''
            }, 200)
        } else {
            ajaxProgressBar.classList.add('bg-danger')
            ajaxProgressBar.style.width = '100%'
            changeContentArea.innerHTML = '<div style="word-break: break-all; margin: 8px auto auto;"><div style="margin: 0px auto; width: fit-content;"><div style="width: fit-content; margin: 0px auto;"><i class="fas fa-exclamation-circle"></i></div>Looks like you lost your connection. Please check it and try again.</div></div>'
        }
    }

    function changeContent(href) {
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')

        var changeContentArea = document.querySelector('#main')
        changeContentArea.innerHTML = '<div class="loader" style="font-size: 2px; margin: 8px auto auto;"></div>'

        const removeClass = 'bg-danger'
        if (ajaxProgressBar.classList && ajaxProgressBar.classList.contains(removeClass)) {
            ajaxProgressBar.classList.remove(removeClass)
        }
        ajaxProgressBar.style.visibility = 'visible'
        ajaxProgressBar.style.width = '80%'

        closeAccountInformation()

        // Cache exsists.
        if (AquaProjectsCache[href]) {
            var changeLocation = document.querySelector('#main')
            while (changeLocation.firstChild) changeLocation.removeChild(changeLocation.firstChild)
            var changeLocationCloneNode = AquaProjectsCache[href].cloneNode(true).querySelector('#main')
            Array.from(changeLocationCloneNode.children).forEach(element => {
                changeLocation.appendChild(element)
            });

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
        })
    }

    function resetDashboardAnchorGroup() {
        const daga = document.querySelectorAll('.dashboard_anchor_group a')
        const removeClass = 'select_active_dashboard'
        for (let index = 0; index < daga.length; index++) {
            const element = daga[index];
            if (element.classList && element.classList.contains(removeClass)) {
                element.classList.remove(removeClass)
            }
        }
        const userPicture = document.querySelector('.user_picture')
        userPicture.style.background = ''
    }

    function closeAccountInformation() {
        const account = document.querySelector('.account')
        const main = document.querySelector('#main')
        const removeClasses = ['animated fadeInUp faster']
        account.style.visibility = 'hidden'
        if (account.classList & account.classList.contains(removeClasses)) {
            account.classList.remove(removeClasses)
        }
        main.style.display = ''
    }

    function findParents(target, className) {
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
})()