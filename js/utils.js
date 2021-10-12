export function changeTheme() {
    const body = document.querySelector('body')
    const changeStyles = [
        'border',
        'background',
        'background-skelton',
        'color-sub',
        'ripple',
        'logo',
        'svg-icon',
    ]

    if (localStorage.getItem('ap-theme') === 'dark') {
        document.head.children['theme-color'].content = '#15202b'
        body.style.backgroundColor = 'rgb(21, 32, 43)'
        body.style.color = 'rgb(255, 255, 255)'
        changeThemeNode(detectPreviousTheme('dark'), 'dark')
    } else if (localStorage.getItem('ap-theme') === 'light') {
        document.head.children['theme-color'].content = '#ffffff'
        body.style.backgroundColor = 'rgb(255, 255, 255)'
        body.style.color = 'rgb(33, 37, 41)'
        changeThemeNode(detectPreviousTheme('light'), 'light')
    } else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.head.children['theme-color'].content = '#15202b'
            body.style.backgroundColor = 'rgb(21, 32, 43)'
            body.style.color = 'rgb(255, 255, 255)'
            changeThemeNode(detectPreviousTheme('default'), 'default')
        } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.head.children['theme-color'].content = '#ffffff'
            body.style.backgroundColor = 'rgb(255, 255, 255)'
            body.style.color = 'rgb(33, 37, 41)'
            changeThemeNode(detectPreviousTheme('default'), 'default')
        }
    }

    function detectPreviousTheme(currentTheme) {
        const themes = ['light', 'dark', 'default']
        themes.splice(
            themes.findIndex(item => item === currentTheme),
            1
        )
        for (let index = 0; index < changeStyles.length; index++) {
            const element = changeStyles[index]
            for (let index = 0; index < themes.length; index++) {
                const theme = themes[index]
                if (
                    document.querySelectorAll(`.ap_theme-${theme}-${element}`)
                        .length
                ) {
                    return theme
                }
            }
        }
    }

    function changeThemeNode(beforeTheme, afterTheme) {
        for (let index = 0; index < changeStyles.length; index++) {
            const element = changeStyles[index]
            changeThemeClass(
                document.querySelectorAll(
                    `.ap_theme-${beforeTheme}-${element}`
                ),
                beforeTheme,
                afterTheme
            )
        }
    }

    function changeThemeClass(nodeList, beforeTheme, afterTheme) {
        for (let index = 0; index < nodeList.length; index++) {
            const element = nodeList[index]
            if (element.tagName === 'svg') {
                element.setAttribute(
                    'class',
                    element
                        .getAttribute('class')
                        .replaceAll(
                            `ap_theme-${beforeTheme}`,
                            `ap_theme-${afterTheme}`
                        )
                )
                continue
            }
            const changedClassName = element.className.replaceAll(
                `ap_theme-${beforeTheme}`,
                `ap_theme-${afterTheme}`
            )
            element.className = changedClassName
        }
    }
}

export function findParents(target, className) {
    if (target === document) return false
    if (target.className.length !== 0 && target.classList.contains(className)) {
        return target
    }
    var currentNode = target.parentNode
    if (currentNode === document || currentNode === null) {
        return false
    } else if (
        currentNode.className.length !== 0 &&
        currentNode.classList.contains(className)
    ) {
        return currentNode
    } else {
        return findParents(currentNode, className)
    }
}

export function getCookie(name) {
    var cookieValue = null
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';')
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim()
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === name + '=') {
                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                )
                break
            }
        }
    }
    return cookieValue
}

const DEBUG = false

export function log(obj) {
    if (DEBUG === true) {
        console.log(obj)
    }
}

export function error(obj) {
    if (DEBUG === true) {
        console.error(obj)
    }
}

export function locationMatch(target) {
    const pathname = location.pathname.replace(location.origin, '')
    const firstDirectory = `/${pathname.split('/')[1]}`
    return firstDirectory === target
}

export function getApTheme() {
    switch (localStorage.getItem('ap-theme')) {
        case 'dark': {
            return 'dark'
        }
        case 'light': {
            return 'light'
        }
        default: {
            return 'default'
        }
    }
}

export function getCurrentPage() {
    return location.href.replace(location.origin, '')
}

export function repaintNode(cacheName, selectors, useCacheDirectly) {
    const targetElement = document.querySelector(selectors)
    while (targetElement.firstChild) {
        targetElement.removeChild(targetElement.firstChild)
    }
    const cache = window.AquaProjectsCache[cacheName]
    const cloneCacheElement = useCacheDirectly
        ? cache.querySelector(selectors)
        : cache.querySelector(selectors).cloneNode(true)
    Array.from(cloneCacheElement.children).forEach(element => {
        targetElement.appendChild(element)
    })
}

export function saveApCache(cacheName, data) {
    window.AquaProjectsCache[
        cacheName
    ] = document.createRange().createContextualFragment(data)
}

export function getApCacheNode(cacheName, selectors) {
    return window.AquaProjectsCache[cacheName].querySelector(selectors)
}

export function getApCache(cacheName) {
    return window.AquaProjectsCache[cacheName]
}

export function addClass(target, className) {
    if (
        target &&
        typeof className === 'string' &&
        target.classList &&
        target.classList.contains(className) === false
    ) {
        target.classList.add(className)
    }
}

export function removeClass(target, className) {
    if (target.classList && target.classList.contains(className)) {
        target.classList.remove(className)
    }
}

export function toggleClass(target, className) {
    if (target.classList && target.classList.contains(className)) {
        target.classList.remove(className)
    } else if (target.classList && !target.classList.contains(className)) {
        target.classList.add(className)
    }
}

export function emptyNode(target) {
    while (target.firstChild) {
        target.removeChild(target.firstChild)
    }
}

export function updateDocumentTitle() {
    if (location.pathname == '/') {
        document.title = 'Aqua Projects'
    } else {
        document.title = 'Aqua Projects - ' + location.pathname.substring(1)
    }
}
