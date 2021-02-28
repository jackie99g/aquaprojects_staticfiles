import { findParents } from './utils.js'
import * as utils from './utils.js'
!(() => {
    window.addEventListener('aquaprojects_popstate', () => {
        if (utils.locationMatch('/settings')) {
            initTwitterSliderItem()
        }
    })
    if (utils.locationMatch('/settings')) {
        window.dispatchEvent(new Event('aquaprojects_popstate'))
    }

    function initTwitterSliderItem() {
        const selectors = '.twitter-slider-item'
        const twitterSliderItem = document.querySelectorAll(selectors)
        for (let index = 0; index < twitterSliderItem.length; index++) {
            const element = twitterSliderItem[index]
            let percentage = 50
            if (localStorage.getItem('font-size')) {
                percentage = localStorage.getItem('font-size')
            }
            const fontSize = document.querySelector('.display-font_size-show')
            fontSize.innerHTML = `${percentage}%`
            const slider = document.querySelector('.twitter-slider-line-fill')
            slider.style.width = `${percentage}%`
            const elementPercentage = parseInt(element.dataset['value'])
            element.style.background = '#8ED0F9'
            if (elementPercentage <= percentage) {
                element.style.background = '#1DA1F2'
            }
        }
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'twitter-slider-item')) {
            twitterSliderItemClick(e)
        }
    })

    function twitterSliderItemClick(e) {
        const target = findParents(e.target, 'twitter-slider-item')
        let percentage = parseInt(target.dataset['value'])
        localStorage.setItem('font-size', percentage)
        const fontSize = document.querySelector('.display-font_size-show')
        fontSize.innerHTML = `${percentage}%`
        const slider = document.querySelector('.twitter-slider-line-fill')
        slider.style.width = `${percentage}%`
        const selectors = '.twitter-slider-item'
        const twitterSliderItem = document.querySelectorAll(selectors)
        for (let index = 0; index < twitterSliderItem.length; index++) {
            const element = twitterSliderItem[index]
            const elementPercentage = parseInt(element.dataset['value'])
            element.style.background = '#8ED0F9'
            if (elementPercentage <= percentage) {
                element.style.background = '#1DA1F2'
            }
        }

        const currentDate = new Date()
        currentDate.setFullYear(currentDate.getFullYear() + 1)
        const expires = currentDate.toUTCString()
        document.cookie = `ap_font_size=${percentage}; path=/; expires=${expires}`

        let htmlFontSize = 0
        switch (percentage) {
            case 0: {
                htmlFontSize = 13
                break
            }
            case 25: {
                htmlFontSize = 14
                break
            }
            case 50: {
                htmlFontSize = 15
                break
            }
            case 75: {
                htmlFontSize = 16
                break
            }
            case 100: {
                htmlFontSize = 18
                break
            }
            default: {
                htmlFontSize = 15
                break
            }
        }
        document.querySelector('html').style.fontSize = `${htmlFontSize}px`
    }
})()
