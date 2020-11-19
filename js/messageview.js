(() => {
    window.addEventListener('aquaprojects_popstate', () => {
        if (`/${location.pathname.replace(location.origin, '').split('/')[1]}` === '/messageview') {
            convertLocalTime()
            changeViewOfConversationOrMessage()
            startWebsocketConnection()
            changeTheme()
        }
    })
    if (`/${location.pathname.replace(location.origin, '').split('/')[1]}` === '/messageview') {
        window.dispatchEvent(new Event('aquaprojects_popstate'));
    }
    window.addEventListener("resize", () => {
        changeViewOfConversationOrMessage()
    })

    document.addEventListener('focus', e => {
        if (e.target.classList.contains('message-view_message-input')) {
            document.querySelector('.message-view_message-border').style.border = '1px solid #1da1f2'
            document.querySelector('.message-view_message-icon').style.color = '#1da1f2'
            if (document.querySelector('.message-view_message-input').value !== '') {
                document.querySelector('.message-view_message-close').style.display = 'flex'
            }
        }
    }, true)

    document.addEventListener('blur', e => {
        if (e.target.classList.contains('message-view_message-input')) {
            document.querySelector('.message-view_message-border').style.border = '1px solid #e6ecf0'
            document.querySelector('.message-view_message-icon').style.color = '#657786'
            document.querySelector('.message-view_message-close').style.display = 'none'
            if (document.querySelector('.message-view_message-input').dataset.cleared === 'true') {
                document.querySelector('.message-view_message-input').focus()
                document.querySelector('.message-view_message-input').dataset.cleared = false
            }
        }
    }, true)

    document.addEventListener('mousedown', e => {
        if (findParents(e.target, 'message-view_message-close')) {
            document.querySelector('.message-view_message-input').value = ''
            document.querySelector('.message-view_message-close').style.display = 'none'
            // Add
            document.querySelector('.message-view_message-send').style.color = '#657786'
            document.querySelector('.message-view_message-input').dataset.cleared = true
        }
    })

    document.addEventListener('input', e => {
        if (e.target.classList.contains('message-view_message-input')) {
            if (document.querySelector('.message-view_message-input').value !== '') {
                document.querySelector('.message-view_message-close').style.display = 'flex'
                // Add
                document.querySelector('.message-view_message-send').style.color = '#1da1f2'
            } else {
                document.querySelector('.message-view_message-close').style.display = 'none'
                // Add
                document.querySelector('.message-view_message-send').style.color = '#657786'
            }
        }
    })

    document.addEventListener('keydown', e => {
        const keyCode = e.keyCode
        if (keyCode !== 13) return false
        if (e.target.classList.contains('message-view_message-input') && e.target.value !== '') {
            var query = document.querySelector('.message-view_message-input').value
            var conversation_id = document.querySelector('.message-view_message-input').dataset.conversation_id
            createMessage(query, conversation_id)
            document.querySelector('.message-view_message-input').value = ''
            document.querySelector('.message-view_message-send').style.color = '#657786'
            document.querySelector('.message-view_message-input').blur()
        }
    })

    document.addEventListener('click', e => {
        if (findParents(e.target, 'message-view_message-send')) {
            var query = document.querySelector('.message-view_message-input').value
            if (query !== '') {
                var conversation_id = document.querySelector('.message-view_message-input').dataset.conversation_id
                createMessage(query, conversation_id)
                document.querySelector('.message-view_message-input').value = ''
                document.querySelector('.message-view_message-send').style.color = '#657786'
                document.querySelector('.message-view_message-input').blur()
            }
        }
    })

    function createMessage(message_text, conversation_id) {
        var href = location.href.replace(location.origin, '')
        var request = '/api/message/message'
        fetch(
            request, {
                method: 'POST',
                mode: "cors",
                credentials: 'include',
                body: JSON.stringify({
                    'message_text': message_text,
                    'conversation_id': conversation_id
                }),
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
            AquaProjectsCache[request] = data
            if (href != location.href.replace(location.origin, '')) {
                console.log('It seems that you moved to a different page first.')
                return false
            }

            var dataNode = document.createRange().createContextualFragment(data)
            var dataJson = JSON.parse(dataNode.querySelector('pre').innerHTML)

            var messageNode =
                createNewMessageCode(dataJson['message_id'], dataJson['created_at'], dataJson['message_text'])

            document.querySelector('.message-view_message-block .message-view_message-list')
                .insertAdjacentHTML('beforeend', messageNode)

            last_message_auto_addition(conversation_id)

            var messageItem =
                createMessageItem(dataJson['message_id'], dataJson['created_at'], dataJson['message_text'], conversation_id)
            var sender_picture =
                document.querySelector('.message-profile-conversation .message-profile-conversation-icon > img').src
            Object.assign(messageItem, {
                'sender_picture': sender_picture
            })

            AutonotifyMessageHasSended(messageItem)

            window.dispatchEvent(new Event('aquaprojects_popstate'));
        })
    }

    function createNewMessageCode(message_id, created_at, message_text) {
        var messageNode =
            `<div class="message-view_message" style="padding: 12px 8px;" data-message_id="${message_id}">
                <div class="message-view_message-timestamp" style="text-align: center; padding: 4px; color: #657786;" data-created_at="${created_at}"></div>
                <div class="message-view_message-user_message" style="display: flex; justify-content: flex-end; padding: 4px;">
                <div class="message-view_message-text" style="padding: 8px 12px; border-radius: 30px; background: #1da1f2; color: white;">${message_text}</div>
                </div>
            </div>`
        return messageNode
    }

    function createNewMessageOthersSendedCode(message_id, created_at, message_text, sender_picture) {
        var messageNode =
            `<div class="message-view_message" style="padding: 12px 8px;" data-message_id="${message_id}">
                <div class="message-view_message-timestamp" style="text-align: center; padding: 4px; color: #657786;" data-created_at="${created_at}"></div>
                <div class="message-view_message-user_message" style="display: flex; align-items: flex-end; padding: 4px;">
                <div class="message-view_message-user" style="margin-right: 8px;">
                    <img src="${sender_picture}" style="width: 40px; height: 40px; border-radius: 50%;">
                </div>
                <div class="message-view_message-text" style="padding: 8px 12px; border-radius: 30px; background: #e6ecf0;">${message_text}</div>
                </div>
            </div>`
        return messageNode
    }

    document.addEventListener('click', e => {
        if (e.target.classList.contains('message-view_message-timestamp')) {
            var message_id = findParents(e.target, 'message-view_message').dataset.message_id
            deleteMessage(message_id)
        }
    })

    function deleteMessage(message_id) {
        var href = location.href.replace(location.origin, '')
        var request = `/api/message/message/${ message_id }`
        fetch(
            request, {
                method: "DELETE",
                mode: "cors",
                credentials: "include",
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
            AquaProjectsCache[request] = data
            if (href != location.href.replace(location.origin, '')) {
                console.log('It seems that you moved to a different page first.')
                return false
            }
            var messageViewMessage = document.querySelectorAll('.message-view_message')
            for (let index = 0; index < messageViewMessage.length; index++) {
                if (messageViewMessage[index].dataset.message_id === message_id) {
                    messageViewMessage[index].remove()
                }
            }

            var conversation_id = document.querySelector('.message-view_message-input').dataset['conversation_id']
            last_message_auto_addition(conversation_id)

            window.dispatchEvent(new Event('aquaprojects_popstate'));
        })
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'message-conversation')) {
            var conversation_id = findParents(e.target, 'message-conversation').dataset.conversation_id
            var conversation_name = findParents(e.target, 'message-conversation')
                .querySelector('.message-conversation-main-name').innerHTML
            var conversation_picture = findParents(e.target, 'message-conversation')
                .querySelector('.message-conversation-icon > img').src
            var conversation_last_activity = findParents(e.target, 'message-conversation')
                .querySelector('.message-conversation-main-last_text').innerHTML
            loadMessage(conversation_id, conversation_name, conversation_picture, conversation_last_activity)
        }
    })

    function loadMessage(conversation_id, conversation_name, conversation_picture, conversation_last_activity) {

        var messageViewMessageBlockChild =
            document.querySelectorAll('.message-view_message-block > div')
        for (let index = 0; index < messageViewMessageBlockChild.length; index++) {
            messageViewMessageBlockChild[index].style.display = 'none'
        }

        document.querySelector('.message-view_message-load_message').style.display = ''

        document.querySelector(
            '.message-view_message-load_message .message-view_message-title-user-icon > img'
        ).src = conversation_picture
        document.querySelector(
            '.message-view_message-load_message .message-view_message-title-user-main-name > div'
        ).innerHTML = conversation_name
        document.querySelector(
            '.message-view_message-load_message .message-view_message-border input'
        ).dataset.conversation_id = conversation_id
        document.querySelector(
            '.message-view_message-load_message .message-view_message-title-user-main-last_activity'
        ).innerHTML = conversation_last_activity

        var href = `/messageview/${ conversation_id }`

        messagePushState(href)

        window.dispatchEvent(new Event('aquaprojects_popstate'));

        processAjaxProgressBar()

        fetch(
            href, {
                method: "GET",
                mode: "cors",
                credentials: "include",
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
            AquaProjectsCache[href] = data
            if (href != location.href.replace(location.origin, '')) {
                console.log('It seems that you moved to a different page first.')
                return false
            }

            var dataNode = document.createRange().createContextualFragment(data)
            document.querySelector('.message-view_message-block').innerHTML =
                dataNode.querySelector('.message-view_message-block').innerHTML

            last_message_auto_addition(conversation_id)

            completeAjaxProgressBar()

            window.dispatchEvent(new Event('aquaprojects_popstate'));
        })

        function processAjaxProgressBar() {
            var ajaxProgressBar = document.querySelector('#ajax-progress-bar');
            ajaxProgressBar.classList ? ajaxProgressBar.classList.remove('bg-danger') : false
            ajaxProgressBar.parentNode.style.visibility = '';
            ajaxProgressBar.style.width = '80%'
        }

        function completeAjaxProgressBar() {
            var ajaxProgressBar = document.querySelector('#ajax-progress-bar');
            ajaxProgressBar.style.width = '100%';
            ajaxProgressBar.style.transition = 'width 0.1s ease';
            setTimeout(() => {
                ajaxProgressBar.parentNode.style.visibility = 'hidden';
                ajaxProgressBar.style.width = '0%';
                ajaxProgressBar.style.transition = '';
            }, 200);
        }
    }

    function messagePushState(href) {
        var targetPage = href
        targetPage = targetPage.replace(location.origin, '')
        var currentPage = location.href;
        currentPage = currentPage.replace(location.origin, '')
        var state = {
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#main'
        };
        var replaceState = Object.assign({}, history.state)
        replaceState['scrollTop'] = window.scrollY
        history.replaceState(replaceState, null, currentPage)
        history.pushState(state, null, targetPage);
    }

    document.addEventListener('focus', e => {
        if (e.target.classList.contains('message-conversation-create-name-input')) {
            document.querySelector('.message-conversation-create-name-border').style.border = '1px solid #1da1f2'
            document.querySelector('.message-conversation-create-name-icon').style.color = '#1da1f2'
            if (document.querySelector('.message-conversation-create-name-input').value !== '') {
                document.querySelector('.message-conversation-create-name-close').style.display = 'flex'
            }
        }
    }, true)

    document.addEventListener('blur', e => {
        if (e.target.classList.contains('message-conversation-create-name-input')) {
            document.querySelector('.message-conversation-create-name-border').style.border = '1px solid #e6ecf0'
            document.querySelector('.message-conversation-create-name-icon').style.color = '#657786'
            document.querySelector('.message-conversation-create-name-close').style.display = 'none'
            if (document.querySelector('.message-conversation-create-name-input').dataset.cleared === 'true') {
                document.querySelector('.message-conversation-create-name-input').focus()
                document.querySelector('.message-conversation-create-name-input').dataset.cleared = false
            }
        }
    }, true)

    document.addEventListener('mousedown', e => {
        if (findParents(e.target, 'message-conversation-create-name-close')) {
            document.querySelector('.message-conversation-create-name-input').value = ''
            document.querySelector('.message-conversation-create-name-close').style.display = 'none'
            document.querySelector('.message-conversation-create-name-input').dataset.cleared = true
        }
    })

    document.addEventListener('input', e => {
        if (e.target.classList.contains('message-conversation-create-name-input')) {
            if (document.querySelector('.message-conversation-create-name-input').value !== '') {
                document.querySelector('.message-conversation-create-name-close').style.display = 'flex'
            } else {
                document.querySelector('.message-conversation-create-name-close').style.display = 'none'
            }
        }
    })

    document.addEventListener('keydown', e => {
        const keyCode = e.keyCode
        if (keyCode !== 13) return false
        if (e.target.classList.contains('message-conversation-create-name-input') && e.target.value !== '') {
            // var query = document.querySelector('.message-conversation-create-name-input').value
            // var conversation_id = document.querySelector('.message-conversation-create-name-input').dataset.conversation_id
            // createMessage(query, conversation_id)
            document.querySelector('.message-conversation-create-name-input').value = ''
            // document.querySelector('.message-conversation-create-name-send').style.color = '#657786'
            document.querySelector('.message-conversation-create-name-input').blur()
        }
    })

    document.addEventListener('focus', e => {
        if (e.target.classList.contains('message-conversation-create-participant-input')) {
            document.querySelector('.message-conversation-create-participant-border').style.border = '1px solid #1da1f2'
            document.querySelector('.message-conversation-create-participant-icon').style.color = '#1da1f2'
            if (document.querySelector('.message-conversation-create-participant-input').value !== '') {
                document.querySelector('.message-conversation-create-participant-close').style.display = 'flex'
            }
        }
    }, true)

    document.addEventListener('blur', e => {
        if (e.target.classList.contains('message-conversation-create-participant-input')) {
            document.querySelector('.message-conversation-create-participant-border').style.border = '1px solid #e6ecf0'
            document.querySelector('.message-conversation-create-participant-icon').style.color = '#657786'
            document.querySelector('.message-conversation-create-participant-close').style.display = 'none'
            if (document.querySelector('.message-conversation-create-participant-input').dataset.cleared === 'true') {
                document.querySelector('.message-conversation-create-participant-input').focus()
                document.querySelector('.message-conversation-create-participant-input').dataset.cleared = false
            }
        }
    }, true)

    document.addEventListener('mousedown', e => {
        if (findParents(e.target, 'message-conversation-create-participant-close')) {
            document.querySelector('.message-conversation-create-participant-input').value = ''
            document.querySelector('.message-conversation-create-participant-close').style.display = 'none'
            document.querySelector('.message-conversation-create-participant-input').dataset.cleared = true
        }
    })

    document.addEventListener('input', e => {
        if (e.target.classList.contains('message-conversation-create-participant-input')) {
            if (document.querySelector('.message-conversation-create-participant-input').value !== '') {
                document.querySelector('.message-conversation-create-participant-close').style.display = 'flex'
            } else {
                document.querySelector('.message-conversation-create-participant-close').style.display = 'none'
            }
        }
    })

    document.addEventListener('keydown', e => {
        const keyCode = e.keyCode
        if (keyCode !== 13) return false
        if (e.target.classList.contains('message-conversation-create-participant-input') && e.target.value !== '') {
            // var query = document.querySelector('.message-conversation-create-participant-input').value
            // var conversation_id = document.querySelector('.message-conversation-create-participant-input').dataset.conversation_id
            // createMessage(query, conversation_id)
            document.querySelector('.message-conversation-create-participant-input').value = ''
            // document.querySelector('.message-conversation-create-participant-send').style.color = '#657786'
            document.querySelector('.message-conversation-create-participant-input').blur()
        }
    })

    document.addEventListener('click', e => {
        if (findParents(e.target, ('message-conversation-title-new_conversation'))) {
            if (document.querySelector('.message-conversation-list').style.display === 'block') {
                document.querySelector('.message-conversation-list').style.display = 'none'
                document.querySelector('.message-conversation-create').style.display = 'block'
            } else {
                document.querySelector('.message-conversation-list').style.display = 'block'
                document.querySelector('.message-conversation-create').style.display = 'none'
            }
        }
    })

    document.addEventListener('click', e => {
        if (e.target.classList.contains('message-conversation-create-decide')) {
            var conversationName = document.querySelector('.message-conversation-create-name-input').value
            var participant_uid = document.querySelector('.message-conversation-create-participant-input').value
            if (conversationName !== '' && participant_uid !== '') {
                createConversation(conversationName, participant_uid)
            }
        }
    })

    function createConversation(conversationName, participant_uid) {
        var href = location.href.replace(location.origin, '')
        var request = '/api/message/conversation'
        fetch(
            request, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                body: JSON.stringify({
                    "conversation_name": conversationName,
                    "participant_uid": participant_uid
                }),
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
            AquaProjectsCache[request] = data
            if (href != location.href.replace(location.origin, '')) {
                console.log('It seems that you moved to a different page first.')
                return false
            }

            var dataNode = document.createRange().createContextualFragment(data)
            var dataJson = JSON.parse(dataNode.querySelector('pre').innerHTML)
            var conversationNode =
                `<div class="message-conversation" data-conversation_id="${ dataJson['conversation_id'] }" style="cursor: pointer;">
                    <div class="message-conversation-icon_main" style="display: flex; padding: 8px;">
                        <div class="message-conversation-icon">
                            <img src="${ dataJson['participant'][0]['picture'] }" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 8px;">
                        </div>
                        <div class="message-conversation-main" style="display: flex; align-items: center; overflow: hidden;">
                            <div class="message-conversation-main-name" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                ${ dataJson['conversation_name'] }
                            </div>
                            <div class="message-conversation-main-last_text" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #657786;">
                            </div>
                        </div>
                    </div>
                </div>`
            document.querySelector('.message-conversation-block .message-conversation-list')
                .insertAdjacentHTML('beforeend', conversationNode)

            document.querySelector('.message-conversation-list').style.display = 'block'
            document.querySelector('.message-conversation-create').style.display = 'none'

            window.dispatchEvent(new Event('aquaprojects_popstate'));
        })
    }

    function last_message_auto_addition(conversation_id) {
        var messageViewMessage = document.querySelectorAll('.message-view_message .message-view_message-text')
        if (messageViewMessage.length !== 0) {
            var last_message = messageViewMessage[messageViewMessage.length - 1].innerHTML
            document.querySelector('.message-view_message-title-user-main-last_activity').innerHTML = last_message
            var messageConversationList = document.querySelectorAll('.message-conversation-list .message-conversation')
            if (messageConversationList.length !== 0) {
                for (let index = 0; index < messageConversationList.length; index++) {
                    if (messageConversationList[index].dataset['conversation_id'] === conversation_id) {
                        messageConversationList[index].querySelector('.message-conversation-main-last_text').innerHTML = last_message
                    }

                }
            }
        }
    }

    function convertLocalTime() {
        var created_at = document.querySelectorAll('.message-view_message-timestamp')
        if (!created_at.length) return false
        for (let index = 0; index < created_at.length; index++) {
            var createdDateString = created_at[index].dataset['created_at']
            created_at[index].innerHTML = calculateTime(createdDateString)
        }
    }

    function calculateTime(createdDateString) {
        var currentDate = new Date()
        var createdDate = new Date(createdDateString)
        var displayTime = ''
        var month_list = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        var displayCreatedHour = createdDate.getHours()
        var displayCreatedAMPM = 'AM'
        if (displayCreatedHour > 12) {
            displayCreatedHour -= 12
            displayCreatedAMPM = 'PM'
        }
        if (currentDate.getDate() == createdDate.getDate()) {
            displayTime = `${ displayCreatedHour }:${ createdDate.getMinutes() } ${ displayCreatedAMPM }`
        } else {
            displayTime = `${ month_list[createdDate.getMonth()] } ${ createdDate.getDate() }, ${ createdDate.getFullYear() }, ${ displayCreatedHour }:${ createdDate.getMinutes() } ${ displayCreatedAMPM }`
        }

        return displayTime
    }

    function changeViewOfConversationOrMessage() {
        if ('/' + location.pathname.replace(location.origin, '').split('/')[1] !== '/messageview') return false
        var messageConversationBlock = document.querySelector('.message-conversation-block')
        var messageViewMessageBlock = document.querySelector('.message-view_message-block')
        if (window.innerWidth >= 768) {
            if (location.href.replace(location.origin, '').split('/').length === 2) {
                // conversation list page
                messageConversationBlock.classList.add('col-md-3')
                messageConversationBlock.style.width = ''
                messageConversationBlock.style.display = ''
                messageViewMessageBlock.style.display = ''
            } else {
                // message list page
                messageViewMessageBlock.classList.add('col-md-9')
                messageViewMessageBlock.style.width = ''
                messageConversationBlock.style.display = ''
                messageViewMessageBlock.style.display = ''
            }
        } else {
            if (location.href.replace(location.origin, '').split('/').length === 2) {
                // conversation list page
                // messageConversationBlock.classList.add('col-12')
                // messageViewMessageBlock.classList.remove('col-12')
                messageConversationBlock.classList.remove('col-md-3')
                messageConversationBlock.style.width = '100%'
                messageConversationBlock.style.display = ''
                messageViewMessageBlock.style.display = 'none'
            } else {
                // message list page
                // messageConversationBlock.classList.remove('col-12')
                // messageViewMessageBlock.classList.add('col-12')
                messageViewMessageBlock.classList.remove('col-md-9')
                messageViewMessageBlock.style.width = '100%'
                messageConversationBlock.style.display = 'none'
                messageViewMessageBlock.style.display = ''
            }
        }
    }

    var socket = null

    function startWebsocketConnection() {
        if (socket) return false
        const getScript = (n, t, i = false, r = false, p = "text/javascript") => new Promise((u, f) => {
            function s(n, t) {
                (t || !e.readyState || /loaded|complete/.test(e.readyState)) && (e.onload = null, e.onreadystatechange = null, e = undefined, t ? f() : u())
            }
            let e = document.createElement("script");
            const o = t || document.getElementsByTagName("script")[0];
            e.type = p;
            e.async = i;
            e.defer = r;
            e.onload = s;
            e.onreadystatechange = s;
            e.src = n;
            o.parentNode.insertBefore(e, o.nextSibling);
        })
        getScript('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.slim.js').then(() => {
            socket = io.connect();
            socket.on('connect', () => {
                socket.emit('get_sid', {})
            })
            socket.on('get_sid', (msg) => {
                var sid = msg['sid']
                notifyWebsocketConnectionHasStarted(sid)
            })
            socket.on('mail_event', (msg) => {
                var message_id = msg['data']['message_id']
                var created_at = msg['data']['created_at']
                var message_text = msg['data']['message_text']
                var conversation_id = msg['data']['conversation_id']
                var sender_picture = msg['data']['sender_picture']
                var profileIcon = document.querySelector('.message-profile-conversation .message-profile-conversation-icon > img').src
                if (sender_picture === profileIcon) return false
                var messageNode =
                    createNewMessageOthersSendedCode(message_id, created_at, message_text, sender_picture)

                document.querySelector('.message-view_message-block .message-view_message-list')
                    .insertAdjacentHTML('beforeend', messageNode)

                last_message_auto_addition(conversation_id)

                window.dispatchEvent(new Event('aquaprojects_popstate'));
            })
        })
    }

    function chooseMessageConversationSids(data) {
        var dataNode = document.createRange().createContextualFragment(data)
        var dataJson = JSON.parse(dataNode.querySelector('pre').innerHTML)

        var participant = dataJson['participant']
        var participant_user_metadata_sid = []
        for (let index = 0; index < participant.length; index++) {
            var user_metadata = JSON.parse(participant[index]['user_metadata'])
            if (user_metadata['message_websocket_sid'] && user_metadata['message_websocket']) {
                if (user_metadata['message_websocket'] !== 'active') continue
                participant_user_metadata_sid.push(user_metadata['message_websocket_sid'])
            }
        }
        return participant_user_metadata_sid
    }

    function notifyMessageHasSended(sids, messageItem) {
        if (socket === null) return false
        for (let index = 0; index < sids.length; index++) {
            socket.emit('mail_event', {
                'sid': sids[index],
                'data': messageItem,
            })
        }
    }

    function createMessageItem(message_id, created_at, message_text, conversation_id) {
        var messageItem = {
            'message_id': message_id,
            'created_at': created_at,
            'message_text': message_text,
            'conversation_id': conversation_id
        }
        return messageItem
    }

    function AutonotifyMessageHasSended(messageItem) {
        var request = `/api/messageapi/conversation/${messageItem['conversation_id']}`
        return fetch(
            request, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
            }
        ).then(response => {
            if (response.ok) {
                return response.text()
            } else {
                console.error(response)
            }
        }).then(data => {
            AquaProjectsCache[request] = data
            var sids_list = chooseMessageConversationSids(data)
            notifyMessageHasSended(sids_list, messageItem)
        })
    }

    function notifyWebsocketConnectionHasStarted(sid) {
        var request = '/api/message/account/state'
        fetch(
            request, {
                method: 'POST',
                mode: "cors",
                credentials: 'include',
                body: JSON.stringify({
                    'message_websocket': 'active',
                    'message_websocket_sid': `${sid}`
                }),
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
            AquaProjectsCache[request] = data
        })
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'message-profile-conversation')) {
            if (socket === null) return false
            socket.emit('get_my_sid', {})
            socket.on('get_my_sid', (msg) => {
                var sid = msg['sid']
                document.querySelector('.message-conversation-get_sid').innerHTML = `sid: ${sid}`
            })
        }
    })

    document.addEventListener('click', e => {
        if (findParents(e.target, 'message-view_message-title-information')) {
            if (!location.pathname.split('/')[2]) return false
            var conversation_id = location.pathname.split('/')[2]
            var request = `/api/messageapi/conversation/${conversation_id}`
            fetch(
                request, {
                    method: 'DELETE',
                    mode: "cors",
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
            })
        }
    })

    function changeTheme() {
        const body = document.querySelector('body')
        const logo = document.querySelectorAll('.header .logo img')
        const changeStyles = ['border', 'background', 'background-skelton', 'color-sub']

        if (localStorage.getItem('ap-theme') === 'dark') {
            document.head.children["theme-color"].content = '#15202b'
            body.style.backgroundColor = 'rgb(21, 32, 43)'
            body.style.color = 'rgb(255, 255, 255)'
            Array.from(logo).forEach(item => item.style.filter = 'brightness(0) invert(1)')
            changeThemeNode(detectPreviousTheme('dark'), 'dark')
        } else if (localStorage.getItem('ap-theme') === 'light') {
            document.head.children["theme-color"].content = '#ffffff'
            body.style.backgroundColor = 'rgb(255, 255, 255)'
            body.style.color = ''
            Array.from(logo).forEach(item => item.style.filter = '')
            changeThemeNode(detectPreviousTheme('light'), 'light')
        } else {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.head.children["theme-color"].content = '#15202b'
                body.style.backgroundColor = 'rgb(21, 32, 43)'
                body.style.color = 'rgb(255, 255, 255)'
                Array.from(logo).forEach(item => item.style.filter = 'brightness(0) invert(1)')
                changeThemeNode(detectPreviousTheme('default'), 'default')
            } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                document.head.children["theme-color"].content = '#ffffff'
                body.style.backgroundColor = 'rgb(255, 255, 255)'
                body.style.color = ''
                Array.from(logo).forEach(item => item.style.filter = '')
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
                const changedClassName = element.className.replaceAll(
                    `ap_theme-${beforeTheme}`, `ap_theme-${afterTheme}`
                )
                element.className = changedClassName
            }
        }
    }

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
})()