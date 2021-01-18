(() => {
    window.addEventListener('aquaprojects_popstate', () => {
        if (`/${location.pathname.replace(location.origin, '').split('/')[1]}` === '/settings') {
            initReduceAnimation()
            initSelectTheme()
            initSidebarPosition()
            changeTheme()
        }
    })
    if (`/${location.pathname.replace(location.origin, '').split('/')[1]}` === '/settings') {
        window.dispatchEvent(new Event('aquaprojects_popstate'));
    }

    // seamless_configuration-view
    document.addEventListener('click', e => {
        if (findParents(e.target, 'seamless_configuration-view')) {
            const target = findParents(e.target, 'seamless_configuration-view')
            const seamlessConfiguration = findParents(e.target, 'seamless_configuration')
            if (!seamlessConfiguration.className.includes('seamless_configuration-not_tracking')) {
                const targetPage = target.href.replace(location.origin, '')
                const currentPage = location.href.replace(location.origin, '')
                easyPushState(targetPage, currentPage)
            }

            const configurationGroup = findParents(target, 'seamless_configuration-group')

            const configurationSiblings = configurationGroup.children
            const configuration = findParents(target, 'seamless_configuration')

            const configurationViewSiblings = configuration.children
            const configurationView = findParents(target, 'seamless_configuration-view')

            // Switch from viewing to editing.
            for (let index = 0; index < configurationViewSiblings.length; index++) {
                const element = configurationViewSiblings[index];
                element.style.display = ''
            }
            configurationView.style.display = 'none'

            // All view change into display none.
            for (let index = 0; index < configurationSiblings.length; index++) {
                const element = configurationSiblings[index];
                const elementView = element.querySelector('.seamless_configuration-view')
                elementView.style.display = 'none'
            }

            if (!seamlessConfiguration.className.includes('seamless_configuration-not_tracking')) {
                AquaProjectsCache[location.href.replace(location.origin, '')] =
                    document.cloneNode(true)
            }

            document.title = 'Aqua Projects - ' + location.pathname.substring(1)
            e.preventDefault()
        }
    })

    // seamless_configuration-back_button
    document.addEventListener('click', e => {
        if (findParents(e.target, 'seamless_configuration-back_button')) {
            const target = findParents(e.target, 'seamless_configuration-back_button')
            const seamlessConfiguration = findParents(e.target, 'seamless_configuration')
            if (!seamlessConfiguration.className.includes('seamless_configuration-not_tracking')) {
                const targetPage = '/settings'
                const currentPage = location.href.replace(location.origin, '')
                history.state['currentPage'] === targetPage ?
                    history.back() : easyPushState(targetPage, currentPage)
            }

            const configurationGroup = findParents(target, 'seamless_configuration-group')

            const configurationSiblings = configurationGroup.children
            const configuration = findParents(target, 'seamless_configuration')

            const configurationEditSiblings = configuration.children
            const configurationEdit = findParents(target, 'seamless_configuration-edit')

            // Switch from editing to view.
            for (let index = 0; index < configurationEditSiblings.length; index++) {
                const element = configurationEditSiblings[index];
                element.style.display = 'flex'
            }
            configurationEdit.style.display = 'none'

            // All view change into display flex.
            for (let index = 0; index < configurationSiblings.length; index++) {
                const element = configurationSiblings[index];
                const elementView = element.querySelector('.seamless_configuration-view')
                elementView.style.display = 'flex'
            }

            document.title = 'Aqua Projects - ' + location.pathname.substring(1)
        }
    })

    // seamless_configuration-save_button
    document.addEventListener('click', e => {
        if (findParents(e.target, 'seamless_configuration-save_button')) {
            const configuration = findParents(e.target, 'seamless_configuration')
            const configurationInput = configuration.querySelector('input')
            const configurationInputText = configurationInput.value
            configurationInputText === undefined ? '' : configurationInputText

            configuration.querySelector('.status').innerHTML = 'Sending...'

            let jsondata = {
                user_metadata: {
                    timeline_background: configurationInputText
                }
            }
            const category = location.href.replace(location.origin, '').split('/')[2]
            if (category !== 'background') {
                jsondata = {
                    [category]: configurationInputText
                }
            }

            const href = location.href.replace(location.origin, '')
            fetch(
                href, {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'include',
                    body: JSON.stringify(jsondata),
                    headers: {
                        "X-CSRFToken": getCookie('csrftoken')
                    },
                }
            ).then(response => {
                if (response.ok) {
                    return response.text()
                } else {
                    console.error(response)
                }
            }).then(data => {
                configuration.querySelector('.status').innerHTML = `Success!: ${data}`
            }).catch(err => {
                console.error(err)
                configuration.querySelector('.status').innerHTML = `Fail...: ${err}`
            })
        }
    })


    // seamless_configuration-form-radio
    document.addEventListener('click', e => {
        if (findParents(e.target, 'seamless_configuration-form-radio')) {
            const target = findParents(e.target, 'seamless_configuration-form-radio')
            target.querySelector('input').click()
        }
    })

    // connect-google
    document.addEventListener('click', e => {
        if (findParents(e.target, 'connect-google')) {
            const googleStatus = e.target.parentNode.querySelector('.google-status')
            const googleStatusMessage = e.target.parentNode.querySelector('.google-status-message')
            const href = '/settings/connect/google'

            googleStatus.classList.add('loader')
            googleStatusMessage.innerHTML = 'Running...'

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
                    googleStatus.classList.remove('loader')
                    googleStatusMessage.innerHTML = ''
                    googleStatus.innerHTML = 'failed...'
                }
            }).then(data => {
                googleStatus.classList.remove('loader')
                googleStatusMessage.innerHTML = ''
                googleStatus.innerHTML = `Succeed! ${data}`
            }).catch(err => {
                console.error(err)
            })
        }
    })

    // disconnect-google
    document.addEventListener('click', e => {
        if (findParents(e.target, 'disconnect-google')) {
            const googleStatus = e.target.parentNode.querySelector('.google-status')
            const googleStatusMessage = e.target.parentNode.querySelector('.google-status-message')
            const href = '/settings/disconnect/google'

            googleStatus.classList.add('loader')
            googleStatusMessage.innerHTML = 'Running...'

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
                    googleStatus.classList.remove('loader')
                    googleStatusMessage.innerHTML = ''
                    googleStatus.innerHTML = 'failed...'
                }
            }).then(data => {
                googleStatus.classList.remove('loader')
                googleStatusMessage.innerHTML = ''
                googleStatus.innerHTML = `Succeed! ${data}`
            }).catch(err => {
                console.error(err)
            })
        }
    })

    // settings-delete_account
    document.addEventListener('click', e => {
        if (findParents(e.target, 'settings-delete_account')) {
            const href = '/settings/delete/user'

            fetch(
                href, {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'include',
                    headers: {
                        "X-CSRFToken": getCookie('csrftoken')
                    }
                }
            ).then(response => {
                if (response.ok) {
                    return response.text()
                } else {
                    console.error(response)
                }
            }).then(data => {
                console.log(data)
                location.href = '/logout'
            }).catch(err => {
                console.error(err)
            })
        }
    })

    // sidebar_position changes
    document.addEventListener('change', e => {
        if (findParents(e.target, 'sidebar_position')) {
            const target = findParents(e.target, 'seamless_configuration-form-radio')
            const seamlessConfigurationFormRadio =
                target.parentNode.querySelectorAll('.seamless_configuration-form-radio')
            const radioIndex = Array.from(seamlessConfigurationFormRadio).findIndex(
                item => item === target
            )
            let sidebar_position = 'top'
            switch (radioIndex) {
                case 1:
                    localStorage.setItem('ap_sidebar_position', 'bottom')
                    sidebar_position = 'bottom'
                    break
                case 2:
                    localStorage.setItem('ap_sidebar_position', 'off')
                    sidebar_position = 'off'
                    break
                default:
                    localStorage.removeItem('ap_sidebar_position')
                    const expires = new Date().toUTCString()
                    document.cookie = `ap_sidebar_position=; path=/; expires=${expires}`
                    return sidebarPosition()
            }
            sidebarPosition(sidebar_position)
            const currentDate = new Date()
            currentDate.setFullYear(currentDate.getFullYear() + 1)
            const expires = currentDate.toUTCString()
            document.cookie = `ap_sidebar_position=${sidebar_position}; path=/; expires=${expires}`
        }

        function sidebarPosition(sidebarPositionNumber) {
            const dashboardPannel =
                document.querySelector('.dashboard_pannel') !== null ?
                document.querySelector('.dashboard_pannel') :
                document.querySelector('.dashboard_pannel_0')
            var customSidePannelSm = dashboardPannel.querySelector('.custom_side_pannel_sm')
            var customSidePannelSmParent = customSidePannelSm.parentNode
            var dashboardAnchorGroup = customSidePannelSmParent.querySelector('.dashboard_anchor_group')
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
    })

    // reduce_animation changes
    document.addEventListener('change', e => {
        if (findParents(e.target, 'reduce_animation')) {
            findParents(e.target, 'reduce_animation').querySelector('input').checked ?
                localStorage.setItem('twitter-reduce_animation', true) :
                localStorage.removeItem('twitter-reduce_animation')
        }
    })

    function initReduceAnimation() {
        const reduceAnimationElement = document.querySelector('.reduce_animation')
        reduceAnimationElement.style.display = ''
        localStorage.getItem('twitter-reduce_animation') ?
            reduceAnimationElement.querySelector('input').checked = 'chekced' :
            reduceAnimationElement.querySelector('input').checked = ''
    }

    // .seamless_configuration-form.select_theme
    document.addEventListener('click', e => {
        if (findParents(e.target, 'select_theme')) {
            const target = findParents(e.target, 'seamless_configuration-form-radio')
            const seamlessConfigurationFormRadio =
                target.parentNode.querySelectorAll('.seamless_configuration-form-radio')
            const radioIndex = Array.from(seamlessConfigurationFormRadio).findIndex(
                item => item === target
            )
            switch (radioIndex) {
                case 1:
                    localStorage.setItem('ap-theme', 'dark')
                    break
                case 2:
                    localStorage.setItem('ap-theme', 'light')
                    break
                default:
                    localStorage.removeItem('ap-theme')
                    const expires = new Date().toUTCString()
                    document.cookie = `ap_theme=; path=/; expires=${expires}`
                    return changeTheme()
                    break
            }
            const APTHEME = localStorage.getItem('ap-theme') === 'dark' ? 'dark' : 'light'
            const currentDate = new Date()
            currentDate.setFullYear(currentDate.getFullYear() + 1)
            const expires = currentDate.toUTCString()
            document.cookie = `ap_theme=${APTHEME}; path=/; expires=${expires}`

            changeTheme()
        }
    })

    function initSelectTheme() {
        const selectTheme = document.querySelector('.seamless_configuration-form.select_theme')
        selectTheme.style.display = ''
        const seamlessConfigurationFormRadio =
            selectTheme.querySelectorAll('.seamless_configuration-form-radio')
        switch (localStorage.getItem('ap-theme')) {
            case 'dark':
                seamlessConfigurationFormRadio[1].querySelector('input').click()
                break
            case 'light':
                seamlessConfigurationFormRadio[2].querySelector('input').click()
                break
            default:
                seamlessConfigurationFormRadio[0].querySelector('input').click()
                break
        }
    }

    function initSidebarPosition() {
        const sidebarPosition = document.querySelector('.seamless_configuration-form.sidebar_position')
        sidebarPosition.style.display = ''
        const seamlessConfigurationFormRadio =
            sidebarPosition.querySelectorAll('.seamless_configuration-form-radio')
        switch (localStorage.getItem('ap_sidebar_position')) {
            case 'bottom':
                seamlessConfigurationFormRadio[1].querySelector('input').click()
                break
            case 'off':
                seamlessConfigurationFormRadio[2].querySelector('input').click()
                break
            default:
                seamlessConfigurationFormRadio[0].querySelector('input').click()
                break
        }
    }

    function easyPushState(targetPage, currentPage) {
        const state = {
            'targetPage': targetPage,
            'currentPage': currentPage
        }
        history.pushState(state, null, targetPage)
    }
})()