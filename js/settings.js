import { changeTheme, findParents, getCookie, error } from './utils.js'
import * as utils from './utils.js'
!(() => {
    window.addEventListener('aquaprojects_popstate', () => {
        if (utils.locationMatch('/settings')) {
            initReduceAnimation()
            initSelectTheme()
            initSidebarPosition()
            changeTheme()
        }
    })
    if (utils.locationMatch('/settings')) {
        window.dispatchEvent(new Event('aquaprojects_popstate'))
    }

    // seamless_configuration-view
    document.addEventListener('click', e => {
        if (findParents(e.target, 'seamless_configuration-view')) {
            seamlessConfigurationViewClick(e)
        }
    })

    function seamlessConfigurationViewClick(e) {
        const target = findParents(e.target, 'seamless_configuration-view')
        const sc = findParents(e.target, 'seamless_configuration')
        if (!sc.className.includes('seamless_configuration-not_tracking')) {
            const targetPage = target.href.replace(location.origin, '')
            const currentPage = location.href.replace(location.origin, '')
            history.pushState({ targetPage, currentPage }, null, targetPage)
        }

        const cg = findParents(target, 'seamless_configuration-group')

        const cgChildren = cg.children
        const configuration = findParents(target, 'seamless_configuration')

        const configurationViewSiblings = configuration.children
        const cv = findParents(target, 'seamless_configuration-view')

        // Switch from viewing to editing.
        for (let index = 0; index < configurationViewSiblings.length; index++) {
            const element = configurationViewSiblings[index]
            element.style.display = ''
        }
        cv.style.display = 'none'

        // All view change into display none.
        for (let index = 0; index < cgChildren.length; index++) {
            const element = cgChildren[index]
            const view = element.querySelector('.seamless_configuration-view')
            view.style.display = 'none'
        }

        if (!sc.className.includes('seamless_configuration-not_tracking')) {
            const cacheName = location.href.replace(location.origin, '')
            window.AquaProjectsCache[cacheName] = document.cloneNode(true)
        }

        utils.updateDocumentTitle()
        e.preventDefault()
    }

    // seamless_configuration-back_button
    document.addEventListener('click', e => {
        if (findParents(e.target, 'seamless_configuration-back_button')) {
            semalessConfigurationBackButtonClick(e)
        }
    })

    function semalessConfigurationBackButtonClick(e) {
        const target = findParents(
            e.target,
            'seamless_configuration-back_button'
        )
        const sc = findParents(e.target, 'seamless_configuration')
        if (!sc.className.includes('seamless_configuration-not_tracking')) {
            const targetPage = '/settings'
            const currentPage = location.href.replace(location.origin, '')
            const data = { targetPage, currentPage }
            history.state['currentPage'] === targetPage
                ? history.back()
                : history.pushState(data, null, targetPage)
        }

        const cg = findParents(target, 'seamless_configuration-group')

        const cgChildren = cg.children
        const configuration = findParents(target, 'seamless_configuration')

        const configurationEditSiblings = configuration.children
        const ce = findParents(target, 'seamless_configuration-edit')

        // Switch from editing to view.
        for (let index = 0; index < configurationEditSiblings.length; index++) {
            const element = configurationEditSiblings[index]
            element.style.display = 'flex'
        }
        ce.style.display = 'none'

        // All view change into display flex.
        for (let index = 0; index < cgChildren.length; index++) {
            const element = cgChildren[index]
            const view = element.querySelector('.seamless_configuration-view')
            view.style.display = 'flex'
        }

        utils.updateDocumentTitle()
    }

    // seamless_configuration-save_button
    document.addEventListener('click', e => {
        if (findParents(e.target, 'seamless_configuration-save_button')) {
            seamlessConfigurationSaveButtonClick(e)
        }
    })

    async function seamlessConfigurationSaveButtonClick(e) {
        const configuration = findParents(e.target, 'seamless_configuration')
        const configurationInput = configuration.querySelector('input')
        const configurationInputText = configurationInput.value
        configurationInputText === undefined ? '' : configurationInputText

        const cStatus = configuration.querySelector('.status')
        cStatus.innerHTML = 'Sending...'

        let jsondata = {
            user_metadata: {
                timeline_background: configurationInputText,
            },
        }
        const category = utils.getCurrentPage().split('/')[2]
        if (category !== 'background') {
            jsondata = {
                [category]: configurationInputText,
            }
        }

        const href = location.href.replace(location.origin, '')

        try {
            const fetching = fetch(href, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(jsondata),
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })

            const response = await fetching
            if (response.ok === false) {
                error(response)
                return
            }
            const data = await response.text()

            cStatus.innerHTML = `Success!: ${data}`
        } catch (err) {
            error(err)
            cStatus.innerHTML = `Fail...: ${err}`
        }
    }

    // seamless_configuration-form-radio
    document.addEventListener('click', e => {
        if (findParents(e.target, 'seamless_configuration-form-radio')) {
            seamlessConfigurationformRadioClick(e)
        }
    })

    function seamlessConfigurationformRadioClick(e) {
        const target = findParents(
            e.target,
            'seamless_configuration-form-radio'
        )
        target.querySelector('input').click()
    }

    // connect-google
    document.addEventListener('click', e => {
        if (findParents(e.target, 'connect-google')) {
            connectGoogleClick(e)
        }
    })

    async function connectGoogleClick(e) {
        const gs = e.target.parentNode.querySelector('.google-status')
        const gsm = e.target.parentNode.querySelector('.google-status-message')
        const href = '/settings/connect/google'

        gs.classList.add('loader')
        gsm.innerHTML = 'Running...'

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

            gs.classList.remove('loader')
            gsm.innerHTML = ''
            gs.innerHTML = `Succeed! ${data}`
        } catch (err) {
            error(err)
            gs.classList.remove('loader')
            gsm.innerHTML = ''
            gs.innerHTML = 'failed...'
        }
    }

    // disconnect-google
    document.addEventListener('click', e => {
        if (findParents(e.target, 'disconnect-google')) {
            disconnectGoogleClick(e)
        }
    })

    async function disconnectGoogleClick(e) {
        const gs = e.target.parentNode.querySelector('.google-status')
        const gsm = e.target.parentNode.querySelector('.google-status-message')
        const href = '/settings/disconnect/google'

        gs.classList.add('loader')
        gsm.innerHTML = 'Running...'

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

            gs.classList.remove('loader')
            gsm.innerHTML = ''
            gs.innerHTML = `Succeed! ${data}`
        } catch (err) {
            error(err)
            gs.classList.remove('loader')
            gsm.innerHTML = ''
            gs.innerHTML = 'failed...'
        }
    }

    // settings-delete_account
    document.addEventListener('click', e => {
        if (findParents(e.target, 'settings-delete_account')) {
            settingsDeleteAccountClick()
        }
    })

    async function settingsDeleteAccountClick() {
        const href = '/settings/delete/user'

        try {
            const fetching = fetch(href, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })

            const response = await fetching
            if (response.ok === false) {
                error(response)
                return
            }
            await response.text()

            location.href = '/logout'
        } catch (err) {
            error(err)
        }
    }

    function sidebarPositionChange(e) {
        const target = findParents(
            e.target,
            'seamless_configuration-form-radio'
        )
        const seamlessConfigurationFormRadio = target.parentNode.querySelectorAll(
            '.seamless_configuration-form-radio'
        )
        const radioIndex = Array.from(seamlessConfigurationFormRadio).findIndex(
            item => item === target
        )
        let sidebar_position = 'top'
        switch (radioIndex) {
            case 1: {
                localStorage.setItem('ap_sidebar_position', 'bottom')
                sidebar_position = 'bottom'
                break
            }
            case 2: {
                localStorage.setItem('ap_sidebar_position', 'off')
                sidebar_position = 'off'
                break
            }
            default: {
                localStorage.removeItem('ap_sidebar_position')
                const expires = new Date().toUTCString()
                document.cookie = `ap_sidebar_position=; path=/; expires=${expires}`
                return sidebarPosition()
            }
        }
        sidebarPosition(sidebar_position)
        const currentDate = new Date()
        currentDate.setFullYear(currentDate.getFullYear() + 1)
        const expires = currentDate.toUTCString()
        document.cookie = `ap_sidebar_position=${sidebar_position}; path=/; expires=${expires}`

        function sidebarPosition(sidebarPositionNumber) {
            const dashboardPannel =
                document.querySelector('.dashboard_pannel') !== null
                    ? document.querySelector('.dashboard_pannel')
                    : document.querySelector('.dashboard_pannel_0')
            const customSidePannelSm = dashboardPannel.querySelector(
                '.custom_side_pannel_sm'
            )
            const customSidePannelSmParent = customSidePannelSm.parentNode
            const dashboardAnchorGroup = customSidePannelSmParent.querySelector(
                '.dashboard_anchor_group'
            )
            if (sidebarPositionNumber === undefined) {
                customSidePannelSmParent.style.display = ''
                customSidePannelSmParent.style.width = '100%'
                dashboardAnchorGroup.classList.remove('flex_box_sm')
                dashboardAnchorGroup.classList.add('flex_box_sm_0')
                dashboardPannel.classList.remove('dashboard_pannel_0')
                dashboardPannel.classList.add('dashboard_pannel')
            } else if (sidebarPositionNumber === 'off') {
                customSidePannelSmParent.style.display = 'none'
                customSidePannelSmParent.style.width = ''
                dashboardAnchorGroup.classList.remove('flex_box_sm_0')
                dashboardAnchorGroup.classList.add('flex_box_sm')
                dashboardPannel.classList.remove('dashboard_pannel')
                dashboardPannel.classList.add('dashboard_pannel_0')
            } else if (sidebarPositionNumber === 'bottom') {
                customSidePannelSmParent.style.display = ''
                customSidePannelSmParent.style.width = ''
                dashboardAnchorGroup.classList.remove('flex_box_sm_0')
                dashboardAnchorGroup.classList.add('flex_box_sm')
                dashboardPannel.classList.remove('dashboard_pannel')
                dashboardPannel.classList.add('dashboard_pannel_0')
            }
        }
    }
    // sidebar_position changes
    document.addEventListener('change', e => {
        if (findParents(e.target, 'sidebar_position')) {
            sidebarPositionChange(e)
        }
    })

    // reduce_animation changes
    document.addEventListener('change', e => {
        if (findParents(e.target, 'reduce_animation')) {
            reduceAnimationChange(e)
        }
    })

    function reduceAnimationChange(e) {
        const target = findParents(e.target, 'reduce_animation')
        if (target.querySelector('input').checked) {
            localStorage.setItem('twitter-reduce_animation', true)
        } else {
            localStorage.removeItem('twitter-reduce_animation')
        }
    }

    function initReduceAnimation() {
        const reduceAnimation = document.querySelector('.reduce_animation')
        reduceAnimation.style.display = ''
        const input = reduceAnimation.querySelector('input')
        const tra = localStorage.getItem('twitter-reduce_animation')
        input.checked = tra ? 'chekced' : ''
    }

    // .seamless_configuration-form.select_theme
    document.addEventListener('click', e => {
        if (findParents(e.target, 'select_theme')) {
            selectThemeClick(e)
        }
    })

    function selectThemeClick(e) {
        const target = findParents(
            e.target,
            'seamless_configuration-form-radio'
        )
        const seamlessConfigurationFormRadio = target.parentNode.querySelectorAll(
            '.seamless_configuration-form-radio'
        )
        const radioIndex = Array.from(seamlessConfigurationFormRadio).findIndex(
            item => item === target
        )
        switch (radioIndex) {
            case 1: {
                localStorage.setItem('ap-theme', 'dark')
                break
            }
            case 2: {
                localStorage.setItem('ap-theme', 'light')
                break
            }
            default: {
                localStorage.removeItem('ap-theme')
                const expires = new Date().toUTCString()
                document.cookie = `ap_theme=; path=/; expires=${expires}`
                return changeTheme()
            }
        }
        const APTHEME = utils.getApTheme()
        const currentDate = new Date()
        currentDate.setFullYear(currentDate.getFullYear() + 1)
        const expires = currentDate.toUTCString()
        document.cookie = `ap_theme=${APTHEME}; path=/; expires=${expires}`

        changeTheme()
    }

    function initSelectTheme() {
        const selectTheme = document.querySelector(
            '.seamless_configuration-form.select_theme'
        )
        selectTheme.style.display = ''
        const seamlessConfigurationFormRadio = selectTheme.querySelectorAll(
            '.seamless_configuration-form-radio'
        )
        switch (utils.getApTheme()) {
            case 'dark': {
                seamlessConfigurationFormRadio[1].querySelector('input').click()
                break
            }
            case 'light': {
                seamlessConfigurationFormRadio[2].querySelector('input').click()
                break
            }
            default: {
                seamlessConfigurationFormRadio[0].querySelector('input').click()
                break
            }
        }
    }

    function initSidebarPosition() {
        const sidebarPosition = document.querySelector(
            '.seamless_configuration-form.sidebar_position'
        )
        sidebarPosition.style.display = ''
        const seamlessConfigurationFormRadio = sidebarPosition.querySelectorAll(
            '.seamless_configuration-form-radio'
        )
        switch (localStorage.getItem('ap_sidebar_position')) {
            case 'bottom': {
                seamlessConfigurationFormRadio[1].querySelector('input').click()
                break
            }
            case 'off': {
                seamlessConfigurationFormRadio[2].querySelector('input').click()
                break
            }
            default: {
                seamlessConfigurationFormRadio[0].querySelector('input').click()
                break
            }
        }
    }
})()
