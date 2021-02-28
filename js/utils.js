export function changeTheme() {
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
        body.style.color = 'rgb(33, 37, 41)'
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
            body.style.color = 'rgb(33, 37, 41)'
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
            if (element.tagName === 'svg') {
                element.setAttribute('class', element.getAttribute('class').replaceAll(
                    `ap_theme-${beforeTheme}`, `ap_theme-${afterTheme}`
                ))
                continue
            }
            const changedClassName = element.className.replaceAll(
                `ap_theme-${beforeTheme}`, `ap_theme-${afterTheme}`
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
    } else if (currentNode.className.length !== 0 && currentNode.classList.contains(className)) {
        return currentNode
    } else {
        return findParents(currentNode, className)
    }
}

export function getCookie(name) {
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
