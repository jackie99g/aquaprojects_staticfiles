import { findParents } from './utils.js'
import * as utils from './utils.js'
!(() => {
    let startPos = 0
    const headerContent = document.querySelector('.header_contents')
    const headerContentHeight = headerContent.offsetHeight
    let headerContentScrollLevel = headerContent.offsetHeight
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY
        const windowWidth = window.innerWidth
        if (
            windowWidth < 768 &&
            document.querySelector('.ap_header_not_tracking') &&
            scrollY > headerContentHeight + Math.abs(scrollY - startPos)
        ) {
            return
        }

        if (scrollY > startPos) {
            headerContentScrollLevel -= scrollY - startPos
            if (headerContentScrollLevel > 0) {
                const top = headerContentHeight - headerContentScrollLevel
                headerContent.style.top = `${-top}px`
            } else {
                headerContentScrollLevel = 0
                headerContent.style.top = `${-headerContentHeight}px`
            }
        } else {
            headerContentScrollLevel += startPos - scrollY
            if (headerContentHeight > headerContentScrollLevel) {
                const top = headerContentHeight - headerContentScrollLevel
                headerContent.style.top = `${-top}px`
            } else {
                headerContentScrollLevel = headerContentHeight
                headerContent.style.top = '0'
            }
        }
        startPos = scrollY
    })

    document.addEventListener('change', e => {
        if (findParents(e.target, 'load_pictures')) {
            const prop = document
                .querySelector('.load_pictures')
                .querySelector('input').checked
            if (prop) {
                localStorage.setItem('twitter-view_pictures', true)
            } else {
                localStorage.removeItem('twitter-view_pictures')
                twitterHiddenPictures()
            }
        }
    })

    function twitterHiddenPictures() {
        const tweetTwitterPicture = document.querySelectorAll(
            '.tweet-twitter_picture'
        )
        for (let index = 0; index < tweetTwitterPicture.length; index++) {
            tweetTwitterPicture[index].src =
                'https://jackie99g.github.io/aquaprojects_staticfiles/images/icon.svg'
        }
    }

    document.addEventListener('change', e => {
        if (findParents(e.target, 'load_clear_icon')) {
            loadClearIconChange()
        }
    })

    function loadClearIconChange() {
        const prop = document
            .querySelector('.load_clear_icon')
            .querySelector('input').checked
        if (prop) {
            twitterViewClearIcon()
        } else {
            twitterHideClearIcon()
        }
    }

    function twitterViewClearIcon() {
        localStorage.setItem('twitter-view_clear_icon', true)
        const tweetTwitterIconImg = document.querySelectorAll(
            '.tweet-twitter_icon img'
        )
        for (let index = 0; index < tweetTwitterIconImg.length; index++) {
            const element = tweetTwitterIconImg[index]
            const imgSrc = element.src
            element.src = imgSrc.replace('_normal', '_400x400')
        }
        const twitterUserTwitterIconImg = document.querySelector(
            '.twitter_user-twitter_icon img'
        )
        if (!twitterUserTwitterIconImg) {
            return
        }
        const iconImgSrc = twitterUserTwitterIconImg.src
        twitterUserTwitterIconImg.src = iconImgSrc.replace(
            '_normal',
            '_400x400'
        )
    }

    function twitterHideClearIcon() {
        localStorage.removeItem('twitter-view_clear_icon')
        const tweetTwitterIconImg = document.querySelectorAll(
            '.tweet-twitter_icon img'
        )
        for (let index = 0; index < tweetTwitterIconImg.length; index++) {
            const element = tweetTwitterIconImg[index]
            const imgSrc = element.src
            element.src = imgSrc.replace('_400x400', '_normal')
        }
        const twitterUserTwitterIconImg = document.querySelector(
            '.twitter_user-twitter_icon img'
        )
        if (!twitterUserTwitterIconImg) {
            return
        }
        const iconImgSrc = twitterUserTwitterIconImg.src
        twitterUserTwitterIconImg.src = iconImgSrc.replace(
            '_400x400',
            '_normal'
        )
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'header-summarize_button')) {
            headerSummaryButton()
        }
    })

    document.addEventListener('change', e => {
        if (findParents(e.target, 'show_left_sidebar')) {
            const prop = document
                .querySelector('.show_left_sidebar')
                .querySelector('input').checked
            if (prop) {
                showLeftSidebar()
            } else {
                hideLeftSidebar()
            }
        }
    })

    function showLeftSidebar() {
        localStorage.setItem('show_left_sidebar', true)
        const customSidePannelLg = document.querySelector(
            '.custom_side_pannel_lg'
        ).parentNode
        utils.removeClass(customSidePannelLg, 'col-md-1')
        customSidePannelLg.classList.add('col-md-2')
        customSidePannelLg.style.visibility = 'visible'

        const customSidePannelMd = document.querySelector(
            '.custom_side_pannel_md'
        ).parentNode
        utils.removeClass(customSidePannelMd, 'col-md-1')
        customSidePannelMd.classList.add('col-md-2')
        customSidePannelMd.style.visibility = 'visible'
    }

    function hideLeftSidebar() {
        localStorage.removeItem('show_left_sidebar')

        const customSidePannelLg = document.querySelector(
            '.custom_side_pannel_lg'
        ).parentNode
        utils.removeClass(customSidePannelLg, 'col-md-2')
        customSidePannelLg.classList.add('col-md-1')
        customSidePannelLg.style.visibility = 'hidden'

        const customSidePannelMd = document.querySelector(
            '.custom_side_pannel_md'
        ).parentNode
        utils.removeClass(customSidePannelMd, 'col-md-2')
        customSidePannelMd.classList.add('col-md-1')
        customSidePannelMd.style.visibility = 'hidden'
    }

    function headerSummaryButton() {
        const customSidePannelLg = document.querySelector(
            '.custom_side_pannel_lg'
        ).parentNode
        utils.toggleClass(customSidePannelLg, 'col-md-1')
        utils.toggleClass(customSidePannelLg, 'col-md-2')
        if (customSidePannelLg.style.visibility === 'visible') {
            customSidePannelLg.style.visibility = 'hidden'
            localStorage.removeItem('show_left_sidebar')
        } else {
            customSidePannelLg.style.visibility = 'visible'
            localStorage.setItem('show_left_sidebar', true)
        }

        const customSidePannelMd = document.querySelector(
            '.custom_side_pannel_md'
        ).parentNode
        utils.toggleClass(customSidePannelMd, 'col-md-1')
        utils.toggleClass(customSidePannelMd, 'col-md-2')
        if (customSidePannelMd.style.visibility === 'visible') {
            customSidePannelMd.style.visibility = 'hidden'
            localStorage.removeItem('show_left_sidebar')
        } else {
            customSidePannelMd.style.visibility = 'visible'
            localStorage.setItem('show_left_sidebar', true)
        }
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'user_picture')) {
            userPictureClick(e)
        }
    })

    function userPictureClick(e) {
        const userPicture = findParents(e.target, 'user_picture')
        const account = document.querySelector('.account')
        const visibleState = account.style.visibility
            ? account.style.visibility
            : 'hidden'
        if (visibleState === 'hidden') {
            account.classList.add('animated', 'fadeInUpSmall', 'faster')
            userPicture.style.background = 'rgba(95,99,104,0.24)'
        } else {
            const removeClasses = ['animated', 'fadeInUpSmall', 'faster']
            for (let index = 0; index < removeClasses.length; index++) {
                const element = removeClasses[index]
                utils.removeClass(account, element)
            }
            userPicture.style.background = ''
        }
        account.scrollTo(0, 0)
        const apSidebarPosition = localStorage.getItem('ap_sidebar_position')
        const needsPadding = apSidebarPosition === 'bottom'
        const reduceHeight =
            needsPadding === true ? '(3.2rem + 1px + 57px)' : '57px'
        const windowWidth = window.innerWidth
        if (windowWidth < 768) {
            if (visibleState === 'hidden') {
                account.style.visibility = 'visible'
                account.style.height = `calc(100% - ${reduceHeight})`
                account.style.width = '100%'
                account.style.right = ''
                account.style.boxShadow = ''
                account.style.borderRadius = ''
                account.style.overflow = 'auto'
                document.querySelector('#main').style.display = 'none'
            } else {
                account.style.visibility = 'hidden'
                account.style.height = ''
                account.style.width = '300px'
                account.style.right = ''
                account.style.boxShadow = ''
                account.style.borderRadius = '10px'
                account.style.overflow = ''
                document.querySelector('#main').style.display = ''
            }
        } else {
            if (visibleState === 'hidden') {
                account.style.visibility = 'visible'
                account.style.height = '600px'
                account.style.width = '300px'
                account.style.right = '5px'
                account.style.boxShadow = '0px 8px 16px #00000026'
                account.style.borderRadius = '10px'
                account.style.overflow = 'auto'
                document.querySelector('#main').style.display = ''
            } else {
                account.style.visibility = 'hidden'
                account.style.height = 'auto'
                account.style.width = '300px'
                account.style.right = '5px'
                account.style.boxShadow = ''
                account.style.borderRadius = '10px'
                account.style.overflow = ''
                document.querySelector('#main').style.display = ''
            }
        }

        const isShowRightSidebar = localStorage.getItem('show_right_sidebar')
        const isTwitterViewPictures = localStorage.getItem(
            'twitter-view_pictures'
        )
        const isTwitterViewClearIcon = localStorage.getItem(
            'twitter-view_clear_icon'
        )
        const isShowLeftSidebar = localStorage.getItem('show_left_sidebar')
        document
            .querySelector('.show_right_sidebar')
            .querySelector('input').checked = isShowRightSidebar === 'true'
        document
            .querySelector('.load_pictures')
            .querySelector('input').checked = isTwitterViewPictures === 'true'
        document
            .querySelector('.load_clear_icon')
            .querySelector('input').checked = isTwitterViewClearIcon === 'true'
        document
            .querySelector('.show_left_sidebar')
            .querySelector('input').checked = isShowLeftSidebar === 'true'
    }

    document.addEventListener('click', e => {
        if (
            !findParents(e.target, 'account') &&
            !findParents(e.target, 'username')
        ) {
            notAccountAndNotUsernameClick()
        }
    })

    function notAccountAndNotUsernameClick() {
        const account = document.querySelector('.account')
        account.style.visibility = 'hidden'
        const removeClasses = ['animated', 'fadeInUpSmall', 'faster']
        for (let index = 0; index < removeClasses.length; index++) {
            const element = removeClasses[index]
            if (account.classList && account.classList.contains(element)) {
                account.classList.remove(element)
            }
        }
        const main = document.querySelector('#main')
        const userPicture = document.querySelector('.user_picture')
        main.style.display = ''
        userPicture.style.background = ''
    }

    document.addEventListener('change', e => {
        if (findParents(e.target, 'show_right_sidebar')) {
            showRightSliderChange()
        }
    })

    function showRightSliderChange() {
        const prop = document
            .querySelector('.show_right_sidebar')
            .querySelector('input').checked
        if (prop) {
            showRightSidebar()
        } else {
            hideRightSidebar()
        }
    }

    function showRightSidebar() {
        const main = document.querySelector('#main')
        const aside = document.querySelector('#aside')
        utils.removeClass(main, 'col-lg-10')
        main.classList.add('col-lg-8')
        utils.removeClass(aside, 'content_display')
        localStorage.setItem('show_right_sidebar', true)
    }

    function hideRightSidebar() {
        const main = document.querySelector('#main')
        const aside = document.querySelector('#aside')
        utils.removeClass(main, 'col-lg-8')
        main.classList.add('col-lg-10')
        aside.classList.add('content_display')
        localStorage.removeItem('show_right_sidebar')
    }
})()
