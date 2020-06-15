$(function() {
    // seamless configuration component
    $(document).on('click', '.seamless_configuration-view', function() {
        AquaProjectCache[location.href.replace(location.origin, '')] = $('html').html()
        var targetPage = $(this).attr('href').replace(location.origin, '');
        var currentPage = location.href.replace(location.origin, '');
        easyPushState(targetPage, currentPage)

        $(this).css('display', 'none')
        $(this).siblings().css('display', 'block')
        $(this).parents('.seamless_configuration').siblings().css('display', 'none')
        AquaProjectCache[targetPage] = $('html').html()

        document.title = 'Aqua Projects - ' + history.state['targetPage']

        return false;
    })

    $(document).on('click', '.seamless_configuration-back_button', function() {
        AquaProjectCache[location.href.replace(location.origin, '')] = $('html').html()
        var targetPage = '/settings'
        var currentPage = location.href.replace(location.origin, '');
        if (history.state['currentPage'] === targetPage) history.back()
        else easyPushState(targetPage, currentPage)

        let edit = $(this).parents('.seamless_configuration-edit')
        edit.css('display', 'none')
        edit.siblings().css('display', 'flex')
        edit.parents('.seamless_configuration').siblings().css('display', 'block')

        document.title = 'Aqua Projects - ' + history.state['targetPage']
    })

    function easyPushState(targetPage, currentPage, changeLocation = '#main') {
        var state = {
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': changeLocation
        }
        history.pushState(state, null, targetPage)
    }

    $(document).on('click', '.connect-google', function() {
        $('.google-status').addClass('loader')
        $('.google-status-message').text('Running...')
        fetch(
            '/settings/connect/google', {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
            }
        ).then(response => {
            if (response.ok) {
                return response.text()
            } else {
                console.error(response)
                $('.google-status').removeClass('loader')
                $('.google-status-message').text('')
                $('.google-status').text('fail...')
            }
        }).then(data => {
            $('.google-status').removeClass('loader')
            $('.google-status-message').text('')
            $('.google-status').text('succeed!' + data)
        }).catch(err => {
            console.error(err)
        })
    })

    $(document).on('click', '.disconnect-google', function() {
        $('.google-status').addClass('loader')
        $('.google-status-message').text('Running...')
        fetch(
            '/settings/disconnect/google', {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
            }
        ).then(response => {
            if (response.ok) {
                return response.text()
            } else {
                console.error(response)
                $('.google-status-message').text('')
                $('.google-status').removeClass('loader')
                $('.google-status').text('fail...')
            }
        }).then(data => {
            $('.google-status').removeClass('loader')
            $('.google-status-message').text('')
            $('.google-status').text('succeed!' + data)
        }).catch(err => {
            console.error(err)
        })
    })

    $(document).on('click', '.settings-delete_account', () => {
        fetch(
            '/settings/delete/user', {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
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
            console.log(data)
            location.href = '/logout'
        }).catch(err => {
            console.error(err)
        })
    })

    $(document).on('click', '.seamless_configuration-save_button', function() {
        var configuration_input_text =
            $(this)
            .parents('.seamless_configuration')
            .find('.seamless_configuration-input').val()
        if (configuration_input_text === undefined) configuration_input_text = ''

        $('.status').text('Sending...')

        var jsondata = {
            user_metadata: {
                timeline_background: configuration_input_text
            }
        }
        var category = location.pathname.split('/')[2]
        if (category !== 'background') {
            jsondata = {
                [category]: configuration_input_text
            }
        }

        fetch(
            location.pathname, {
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
            $('.status').text('Success!: ' + data)
            AquaProjectCache[location.href.replace(location.origin, '')] = $('html').html()
        }).catch(err => {
            console.log(err)
            $('.status').text('Fail...: ' + data)
        })
    })

    document.addEventListener('click', e => {
        if (findParents(e.target, 'sidebar_position')) {
            var sidebarPositionElement = findParents(e.target, 'sidebar_position')
            var checked = sidebarPositionElement.querySelector('input').checked
            var SIDEBAR_POSITION = 0
            if (checked) {
                SIDEBAR_POSITION = 1
                sidebarPositionElement.querySelector('input').checked = 'checked'
            } else {
                sidebarPositionElement.querySelector('input').checked = ''
            }
            sidebarPosition(SIDEBAR_POSITION)
            var currentDate = new Date()
            currentDate.setFullYear(currentDate.getFullYear() + 1)
            var expires = currentDate.toUTCString()
            document.cookie = `ap_sidebar_position=${SIDEBAR_POSITION}; path=/; expires=${expires}`
        }

        function sidebarPosition(sidebarPositionNumber) {
            var customSidePannelSm = document.querySelector('.dashboard_pannel .custom_side_pannel_sm')
            var customSidePannelSmParent = customSidePannelSm.parentNode
            var dashboardAnchorGroup = customSidePannelSmParent.querySelector('.dashboard_anchor_group')
            if (sidebarPositionNumber === 0) {
                customSidePannelSmParent.style.width = '100%'
                dashboardAnchorGroup.classList.remove('flex_box_sm')
                dashboardAnchorGroup.classList.add('flex_box_sm_0')
            } else {
                customSidePannelSmParent.style.width = ''
                dashboardAnchorGroup.classList.remove('flex_box_sm_0')
                dashboardAnchorGroup.classList.add('flex_box_sm')
            }
        }
    })

    function findParents(target, className) {
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

    function getCookie(name) {
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
})