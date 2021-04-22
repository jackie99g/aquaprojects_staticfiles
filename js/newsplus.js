import { changeTheme, findParents, log, error } from './utils.js'
import * as utils from './utils.js'
!(() => {
    let currentSlideNumber = 0

    window.addEventListener('aquaprojects_popstate', () => {
        if (utils.locationMatch('/newsplus')) {
            const _currentSlideNumber = getSlideNumber(location.href)
            jumpToSlide(_currentSlideNumber)
            activateAnchor(_currentSlideNumber)
            translateAnchors(_currentSlideNumber)
            changeTheme()
        }
    })
    if (utils.locationMatch('/newsplus')) {
        window.dispatchEvent(new Event('aquaprojects_popstate'))
    }

    window.addEventListener('resize', () => {
        if (utils.locationMatch('/newsplus')) {
            const _currentSlideNumber = getSlideNumber(location.href)
            jumpToSlide(_currentSlideNumber)
            translateAnchors(_currentSlideNumber)
        }
    })

    // box_anchor
    document.addEventListener('click', e => {
        if (findParents(e.target, 'box_anchor')) {
            boxAnchorClick(e)
            e.preventDefault()
        }
    })

    function boxAnchorClick(e) {
        const target = findParents(e.target, 'box_anchor')
        const ac = document.querySelector('.box_anchor_container')
        const anchor = ac.querySelectorAll('.box_anchor')

        const container = document.querySelector('.box_container')
        const elementIndex = Array.from(anchor).findIndex(
            item => item === target
        )
        const element = document.querySelector('.box_element')
        const elementWidth = element.offsetWidth

        container.addEventListener(
            'transitionend',
            () => (container.style.transition = 'all 0ms ease 0s')
        )
        container.style.transition = 'all 300ms ease 0s'

        const tx = `${elementIndex * elementWidth * -1}px`
        const transformFunction = `translate3d(${tx}, 0px, 0px)`
        container.style.transform = transformFunction

        const targetPage = target.href.replace(location.origin, '')
        const currentPage = utils.getCurrentPage()
        history.pushState({ targetPage, currentPage }, null, targetPage)
        utils.updateDocumentTitle()
        changeContent(targetPage)
    }

    async function changeContent(href) {
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')
        const slideNumber = getSlideNumber(href)
        activateAnchor(slideNumber)
        translateAnchors(slideNumber)

        utils.removeClass(ajaxProgressBar, 'bg-danger')
        ajaxProgressBar.parentNode.style.visibility = ''
        ajaxProgressBar.style.width = '80%'

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

    function activateAnchor(slideNumber) {
        const boxAnchorSibling = document.querySelectorAll(
            '.box_anchor_container .box_anchor'
        )
        for (let index = 0; index < boxAnchorSibling.length; index++) {
            const element = boxAnchorSibling[index]
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
            return
        }
        let elementIndex = 0
        const elementWidth = document.querySelector('.box_anchor').offsetWidth

        const sn = newsplusAnchorSlideNumber
        const al = document.querySelectorAll('.box_anchor').length
        sn === 0 || sn === al ? (elementIndex = sn) : (elementIndex = sn - 1)

        const tx = `${elementIndex * elementWidth * -1}px`
        const transformFunction = `translate3d(${tx}, 0px, 0px)`
        container.style.transform = transformFunction
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
        touchStartScrollLeft = container.style.transform
            ? analyzeTransform(container.style.transform)
            : [0, 0, 0]
    }

    function boxContainerTouchMove(e, container) {
        const pageX = e.changedTouches[0].pageX
        const amountOfMovement = touchingPositionPageX - pageX
        const tx = (touchStartScrollLeft[0] * -1 + amountOfMovement) * -1
        container.style.transform = `translate3d(${tx}px, 0px, 0px)`
    }

    function boxContainerTouchEnd(e, container) {
        const elements = document.querySelectorAll('.box_element')
        const elementIndex = Array.from(elements).findIndex(
            item => item === findParents(e.target, 'box_element')
        )
        const pageX = e.changedTouches[0].pageX
        const elementWidth = elements[0].offsetWidth
        const amountOfMovement = touchingPositionPageX - pageX
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

        let havetoChange = true

        if (amountOfMovement > container.offsetWidth / 6) {
            if (elements.length - 1 < currentSlideNumber + 1) {
                return
            }
            const tx = `${(elementIndex + 1) * elementWidth * -1}px`
            const transformFunction = `translate3d(${tx}, 0px, 0px)`
            container.style.transform = transformFunction
            currentSlideNumber += 1
        } else if (amountOfMovement < -(container.offsetWidth / 6)) {
            if (currentSlideNumber - 1 < 0) {
                return
            }
            const tx = `${(elementIndex - 1) * elementWidth * -1}px`
            const transformFunction = `translate3d(${tx}, 0px, 0px)`
            container.style.transform = transformFunction
            currentSlideNumber -= 1
        } else {
            havetoChange = false
        }

        havetoChange === true && havetoChangeContent()

        function havetoChangeContent() {
            const anchor = document.querySelectorAll('.box_anchor')
            const anchorHref = anchor[currentSlideNumber].href
            const targetPage = anchorHref.replace(location.origin, '')
            const currentPage = location.href.replace(location.origin, '')
            history.pushState({ targetPage, currentPage }, null, targetPage)
            utils.updateDocumentTitle()
            changeContent(targetPage)
        }
    }

    function jumpToSlide(jumpToSlideNumber) {
        const container = document.querySelector('.box_container')
        const elements = document.querySelectorAll('.box_element')
        const elementWidth = elements[0].offsetWidth
        const elementIndex = jumpToSlideNumber

        container.style.transition = 'all 0ms ease 0s'

        const tx = `${elementIndex * elementWidth * -1}px`
        const transformFunction = `translate3d(${tx}, 0px, 0px)`
        container.style.transform = transformFunction

        currentSlideNumber = jumpToSlideNumber
    }

    function getSlideNumber(href) {
        if (utils.getCurrentPage() === '/newsplus') {
            return 0
        }

        const anchor = document.querySelectorAll('.box_anchor')
        return Array.from(anchor).findIndex(
            item => removeOrigin(item.href) === removeOrigin(href)
        )
    }

    function removeOrigin(href) {
        return href.replace(location.origin, '')
    }
})()
