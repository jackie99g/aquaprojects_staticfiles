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
        'btn',
        'backdrop',
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
        className !== '' &&
        target.classList &&
        target.classList.contains(className) === false
    ) {
        target.classList.add(className)
    }
}

export function removeClass(target, className) {
    if (
        target &&
        typeof className === 'string' &&
        className !== '' &&
        target.classList &&
        target.classList.contains(className)
    ) {
        target.classList.remove(className)
    }
}

export function toggleClass(target, className) {
    if (target.classList && target.classList.contains(className)) {
        removeClass(target, className)
    } else if (target.classList && !target.classList.contains(className)) {
        addClass(target, className)
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

const storageItem = ['ap_font_size', 'ap_time_zone', 'ap_language', 'ap_region']

export function getStorageItem(keyName) {
    return {
        localStorage: {
            [keyName]: localStorage.getItem(keyName),
        },
        cookie: {
            [keyName]: getCookie(keyName),
        },
    }
}

export function setStorageItem(keyName, keyValue, syncCookie) {
    localStorage.setItem(keyName, keyValue)
    if (syncCookie) {
        const now = new Date()
        now.setFullYear(now.getFullYear() + 1)
        const expires = now.toUTCString()
        document.cookie = `${keyName}=${keyValue}; path=/; expires=${expires}`
    }
    return getStorageItem(keyName)
}

export function removeStorageItem(keyName, syncCookie) {
    localStorage.removeItem(keyName)
    if (syncCookie) {
        const expires = new Date().toUTCString()
        document.cookie = `${keyName}=; path=/; expires=${expires}`
    }
    return undefined
}

export function clearStorageItem(syncCookie) {
    localStorage.clear()
    if (syncCookie) {
        const expires = new Date().toUTCString()
        document.cookie.split(';').forEach(c => {
            document.cookie = c
                .replace(/^ +/, '')
                .replace(/=.*/, `=; path=/; expires=${expires}`)
        })
    }
}

export function listStorageItem() {
    const localStorages = {}
    Array.from({ length: localStorage.length }, (x, i) => i).forEach(i => {
        localStorages[localStorage.key(i)] = localStorage.getItem(
            localStorage.key(i)
        )
    })
    const cookies = document.cookie.split(';').reduce((cookies, cookie) => {
        const [name, value] = cookie.split('=').map(c => c.trim())
        cookies[name] = value
        return cookies
    }, {})
    return {
        localStorage: localStorages,
        cookie: cookies,
    }
}

export function getObjectValue(obj, keyName, defaultValue) {
    return obj[keyName] === undefined || obj[keyName] === null
        ? defaultValue
        : obj[keyName]
}

export function getLocalDateByUTC(utcUnixTimeSecond) {
    const apTimeZone = getObjectValue(
        getStorageItem(storageItem[1])['localStorage'],
        storageItem[1],
        'UTC+09:00'
    )
    const timeZoneData = apTimeZone
    const timeZoneOffsetHours = parseInt(timeZoneData.slice(3, 6))
    const timeZoneOffsetMinutes = parseInt(timeZoneData.slice(7, 9))
    const timeZoneOffsetSeconds =
        timeZoneOffsetHours * 3600 + timeZoneOffsetMinutes * 60
    const localDate = new Date(
        (utcUnixTimeSecond + timeZoneOffsetSeconds) * 1000
    )
    return localDate
}
