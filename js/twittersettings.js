import { findParents } from './utils.js'
(() => {
    window.addEventListener('aquaprojects_popstate', () => {
        if (`/${location.pathname.replace(location.origin, '').split('/')[1]}` === '/settings') {
            const twitterSliderItem = document.querySelectorAll('.twitter-slider-item')
            for (let index = 0; index < twitterSliderItem.length; index++) {
                const element = twitterSliderItem[index];
                let percentage = 50
                if (localStorage.getItem('font-size')) {
                    percentage = localStorage.getItem('font-size')
                }
                document.querySelector('.display-font_size-show').innerHTML = `${percentage}%`
                document.querySelector('.twitter-slider-line-fill').style.width = `${percentage}%`
                const elementPercentage = parseInt(element.dataset['value'])
                element.style.background = '#8ED0F9'
                if (elementPercentage <= percentage) {
                    element.style.background = '#1DA1F2'
                }
            }
        }
    })
    if (`/${location.pathname.replace(location.origin, '').split('/')[1]}` === '/settings') {
        window.dispatchEvent(new Event('aquaprojects_popstate'));
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'twitter-slider-item')) {
            const target = findParents(e.target, 'twitter-slider-item')
            let percentage = parseInt(target.dataset['value'])
            localStorage.setItem('font-size', percentage)
            document.querySelector('.display-font_size-show').innerHTML = `${percentage}%`
            document.querySelector('.twitter-slider-line-fill').style.width = `${percentage}%`
            const twitterSliderItem = document.querySelectorAll('.twitter-slider-item')
            for (let index = 0; index < twitterSliderItem.length; index++) {
                const element = twitterSliderItem[index];
                const elementPercentage = parseInt(element.dataset['value'])
                element.style.background = '#8ED0F9'
                if (elementPercentage <= percentage) {
                    element.style.background = '#1DA1F2'
                }
            }

            let currentDate = new Date()
            currentDate.setFullYear(currentDate.getFullYear() + 1)
            const expires = currentDate.toUTCString()
            document.cookie = `ap_font_size=${percentage}; path=/; expires=${expires}`

            let htmlFontSize = 0
            switch (percentage) {
                case 0:
                    htmlFontSize = 13
                    break
                case 25:
                    htmlFontSize = 14
                    break
                case 50:
                    htmlFontSize = 15
                    break
                case 75:
                    htmlFontSize = 16
                    break
                case 100:
                    htmlFontSize = 18
                    break
                default:
                    htmlFontSize = 15
                    break;
            }
            document.querySelector('html').style.fontSize = `${htmlFontSize}px`
        }
    })

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