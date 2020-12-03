(() => {
    let currentSlideNumber = 0

    window.addEventListener('aquaprojects_popstate', () => {
        if (`/${location.pathname.replace(location.origin, '').split('/')[1]}` === '/newsplus') {
            const _currentSlideNumber =
                location.href.replace(location.origin, '') === '/newsplus' ?
                0 : Array.from(document.querySelectorAll('.box_anchor')).findIndex(
                    item =>
                    item.href.replace(location.origin, '') ===
                    location.href.replace(location.origin, '')
                )
            jumpToSlide(_currentSlideNumber)
            activateAnchor(_currentSlideNumber)
            translateAnchors(_currentSlideNumber)
            changeTheme()
        }
    })
    if ('/' + location.pathname.replace(location.origin, '').split('/')[1] === '/newsplus') {
        window.dispatchEvent(new Event('aquaprojects_popstate'));
    }

    window.addEventListener('resize', () => {
        if ('/' + location.pathname.replace(location.origin, '').split('/')[1] === '/newsplus') {
            const _currentSlideNumber =
                location.href.replace(location.origin, '') === '/newsplus' ?
                0 : Array.from(document.querySelectorAll('.box_anchor')).findIndex(
                    item =>
                    item.href.replace(location.origin, '') ===
                    location.href.replace(location.origin, '')
                )
            jumpToSlide(_currentSlideNumber)
            translateAnchors(_currentSlideNumber)
        }
    })

    // box_anchor
    document.addEventListener('click', e => {
        if (findParents(e.target, 'box_anchor')) {
            const target = findParents(e.target, 'box_anchor')
            const boxAnchorContainer = document.querySelector('.box_anchor_container')
            const boxAnchorSibling = boxAnchorContainer.querySelectorAll('.box_anchor')

            const container = document.querySelector('.box_container')
            const elementIndex = Array.from(boxAnchorSibling).findIndex(item => item === target)
            const elementWidth = document.querySelector('.box_element').offsetWidth

            container.addEventListener('transitionend', () =>
                container.style.transition = 'all 0ms ease 0s')
            container.style.transition = 'all 300ms ease 0s'

            container.style.transform =
                `translate3d(${elementIndex * elementWidth * -1}px, 0px, 0px)`

            const targetPage = target.href.replace(location.origin, '')
            const currentPage = location.href.replace(location.origin, '')
            easyPushState(targetPage, currentPage)
            changeContent(targetPage)
            e.preventDefault()
        }
    })

    function changeContent(href) {
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar');

        activateAnchor(
            Array.from(document.querySelectorAll('.box_anchor')).findIndex(
                item =>
                item.href.replace(location.origin, '') === href.replace(location.origin, '')
            )
        )
        translateAnchors(
            Array.from(document.querySelectorAll('.box_anchor')).findIndex(
                item =>
                item.href.replace(location.origin, '') === href.replace(location.origin, '')
            )
        )

        ajaxProgressBar.classList ? ajaxProgressBar.classList.remove('bg-danger') : false
        ajaxProgressBar.parentNode.style.visibility = '';
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
            }
        }).then(data => {
            AquaProjectsCache[href] = document.createRange().createContextualFragment(data)
            if (href !== location.href.replace(location.origin, '')) {
                console.log('It seems that you moved to a different page first.')
                return false
            }
            const changeLocation = document.querySelector('#main')
            while (changeLocation.firstChild) changeLocation.removeChild(changeLocation.firstChild)
            const changeLocationCloneNode =
                AquaProjectsCache[href].cloneNode(true).querySelector('#main')
            Array.from(changeLocationCloneNode.children).forEach(element => {
                changeLocation.appendChild(element)
            })

            window.dispatchEvent(new Event('aquaprojects_popstate'));

            ajaxProgressBar.style.width = '100%';
            ajaxProgressBar.style.transition = 'width 0.1s ease';
            setTimeout(() => {
                ajaxProgressBar.parentNode.style.visibility = 'hidden';
                ajaxProgressBar.style.width = '0%';
                ajaxProgressBar.style.transition = '';
            }, 200);
        }).catch(err => {
            console.error(err)
        })
    }

    function activateAnchor(slideNumber) {
        const boxAnchorSibling = document.querySelectorAll(
            '.box_anchor_container .box_anchor'
        )
        for (let index = 0; index < boxAnchorSibling.length; index++) {
            const element = boxAnchorSibling[index];
            element.style.borderBottom = ''
            element.style.color = ''
            if (index === slideNumber) {
                element.style.borderBottom = '1px solid rgb(29, 161, 242)'
                element.style.color = '#1da1f2'
            }
        }
    }

    function translateAnchors(newsplusAnchorSlideNumber) {
        const container = document.querySelector('.box_anchor_container')
        const windowWidth = window.innerWidth
        if (windowWidth > 768) {
            container.style.transform = 'translate3d(0px, 0px, 0px)'
            return false
        }
        let elementIndex = 0
        const elementWidth = document.querySelector('.box_anchor').offsetWidth

        newsplusAnchorSlideNumber === 0 ||
            newsplusAnchorSlideNumber === document.querySelectorAll('.box_anchor').length ?
            elementIndex = newsplusAnchorSlideNumber :
            elementIndex = newsplusAnchorSlideNumber - 1

        container.style.transform =
            `translate3d(${elementIndex * elementWidth * -1}px, 0px, 0px)`
    }

    // box_container touchstart
    document.addEventListener('touchstart', e => {
        if (findParents(e.target, 'box_container')) {
            const container = findParents(e.target, 'box_container')
            boxContainerTouchStart(e, container)
        }
    })

    // box_container touchmove
    document.addEventListener('touchmove', e => {
        if (findParents(e.target, 'box_container')) {
            const container = findParents(e.target, 'box_container')
            boxContainerTouchMove(e, container)
        }
    })

    // box_container touchend
    document.addEventListener('touchend', e => {
        if (findParents(e.target, 'box_container')) {
            const container = findParents(e.target, 'box_container')
            boxContainerTouchEnd(e, container)
        }
    })

    let touchingPositionPageX = 0
    let touchStartScrollLeft = 0

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
        const elements = document.querySelectorAll('.box_element')
        const elementIndex = Array.from(elements).findIndex(
            item => item === findParents(e.target, 'box_element')
        )
        const elementWidth = elements[0].offsetWidth
        const amountOfMovement = touchingPositionPageX - e.changedTouches[0].pageX

        container.addEventListener('transitionend', () =>
            container.style.transition = 'all 0ms ease 0s')
        container.style.transition = 'all 300ms ease 0s'

        container.style.transform =
            `translate3d(${elementIndex * elementWidth * -1}px, 0px, 0px)`
        touchingPositionPageX = 0
        touchStartScrollLeft = 0

        let havetoChange = true

        if (amountOfMovement > container.offsetWidth / 6) {
            if (elements.length - 1 < currentSlideNumber + 1) return false
            container.style.transform =
                `translate3d(${(elementIndex + 1) * elementWidth * -1}px, 0px, 0px)`
            currentSlideNumber += 1
        } else if (amountOfMovement < -(container.offsetWidth / 6)) {
            if (currentSlideNumber - 1 < 0) return false
            container.style.transform =
                `translate3d(${(elementIndex - 1) * elementWidth * -1}px, 0px, 0px)`
            currentSlideNumber -= 1
        } else {
            havetoChange = false
        }

        havetoChange === true ? (() => {
            const targetPage =
                document.querySelectorAll('.box_anchor')[currentSlideNumber].href
                .replace(location.origin, '')
            const currentPage = location.href.replace(location.origin, '')
            easyPushState(targetPage, currentPage)
            changeContent(targetPage)
        })() : false
    }

    function jumpToSlide(jumpToSlideNumber) {
        const container = document.querySelector('.box_container')
        const elements = document.querySelectorAll(`.box_element`)
        const elementWidth = elements[0].offsetWidth
        const elementIndex = jumpToSlideNumber

        container.style.transition = 'all 0ms ease 0s'

        container.style.transform =
            `translate3d(${elementIndex * elementWidth * -1}px, 0px, 0px)`

        currentSlideNumber = jumpToSlideNumber
    }

    function easyPushState(targetPage, currentPage) {
        const state = {
            'targetPage': targetPage,
            'currentPage': currentPage
        }
        history.pushState(state, null, targetPage)
        document.title = 'Aqua Projects - ' + location.pathname.substring(1)
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
})()