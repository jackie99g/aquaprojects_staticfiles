import { changeTheme, findParents, getCookie, log, error } from './utils.js'
import * as utils from './utils.js'
!(() => {
    window.addEventListener('aquaprojects_popstate', () => {
        if (utils.locationMatch('/messenger')) {
            convertLocalTime()
            changeTheme()
        }
    })
    if (utils.locationMatch('/messenger')) {
        window.dispatchEvent(new Event('aquaprojects_popstate'))
    }

    const wsProtocol = location.protocol === 'https:' ? 'wss://' : 'ws://'
    const websocketUrl = `${wsProtocol}${location.host}/ws/messenger/`
    const websocket = new WebSocket(websocketUrl)
    websocket.addEventListener('message', websocketMessage)

    document.addEventListener('click', e => {
        if (findParents(e.target, 'messenger-message-form-send')) {
            messengerMessageInputSendClick()
        }
    })

    async function messengerMessageInputSendClick() {
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')

        try {
            const q = (target, selector) => target.querySelector(selector)
            const form = document.querySelector('.messenger-message-form')
            const input = q(form, '.messenger-message-form-input')
            const messageText = input.value
            const cData = JSON.parse(await getConversationData())
            cData['conversation_id'] = cData['conversation_id_str']
            const avcData = JSON.parse(await getAccountVerifyCredentials())
            const sender = cData['participant'].find(
                participant => participant['uid'] === avcData['uid']
            )
            const receiver = cData['participant'].filter(
                participant => participant['uid'] !== avcData['uid']
            )
            const messageData = {
                message_text: messageText,
                sender,
                receiver,
                conversation: cData,
                state_description: null,
            }

            const href = '/api/messageitem/'
            const fetching = fetch(href, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(messageData),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })

            const response = await fetching
            if (response.ok === false) {
                error(response)
                return
            }
            const data = await response.text()

            // Save Cache.
            utils.saveApCache(href, data)

            websocketSend(
                `conversation_${
                    JSON.parse(data)['conversation']['conversation_id_str']
                }`,
                data
            )

            window.dispatchEvent(new Event('aquaprojects_popstate'))

            ajaxProgressBar.style.width = '100%'
            ajaxProgressBar.style.transition = 'width 0.1s ease 0s'

            setTimeout(() => {
                ajaxProgressBar.parentNode.style.visibility = 'hidden'
                ajaxProgressBar.style.width = '0%'
                ajaxProgressBar.style.transition = ''
            }, 200)
        } catch (err) {
            error(err)
        }
    }

    async function addMessageToMessagelist(message) {
        const q = (target, selector) => target.querySelector(selector)
        const message_list = q(document, '.messenger-message-list')
        const messenger_message = document.createElement('div')
        const avcData = JSON.parse(await getAccountVerifyCredentials())
        const isSender = message['sender']['uid'] === avcData['uid']
        isSender
            ? messenger_message.classList.add('messenger-message-sender')
            : messenger_message.classList.add('messenger-message-receiver')
        messenger_message.dataset['message_id'] = message['message_id_str']
        messenger_message.innerText = message['message_text']
        message_list.appendChild(messenger_message)
    }

    function websocketSend(group, message) {
        websocket.send(JSON.stringify({ group, message }))
    }

    function websocketMessage(e) {
        const message = JSON.parse(JSON.parse(e.data)['message'])
        addMessageToMessagelist(message)
    }

    async function getConversationData() {
        try {
            const conversationId = location.href
                .replace(location.origin, '')
                .split('/')[2]
            const href = `/api/messageconversation/${conversationId}/`
            const fetching = fetch(href, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const response = await fetching
            if (response.ok === false) {
                error(response)
                return
            }
            return response.text()
        } catch (err) {
            error(err)
        }
    }

    async function getAccountVerifyCredentials() {
        try {
            const href = '/api/account/verify_credentials/'
            const fetching = fetch(href, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const response = await fetching
            if (response.ok === false) {
                error(response)
                return
            }
            return response.text()
        } catch (err) {
            error(err)
        }
    }

    function convertLocalTime() {
        const timestamp = document.querySelectorAll('.messenger-message-time')
        if (!timestamp.length) return false
        Array.from(timestamp).forEach(timestamp => {
            const timestampString = timestamp.innerText
            timestamp.innerText = calculateTime(timestampString)
        })
    }

    function calculateTime(createdDateString) {
        const currentDate = new Date()
        const createdDate = new Date(createdDateString)
        const month_list = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ]
        const displayCreatedHour =
            createdDate.getHours() > 12
                ? createdDate.getHours() - 12
                : createdDate.getHours()
        const displayCreatedAMPM = createdDate.getHours() > 12 ? 'AM' : 'PM'
        const month = month_list[createdDate.getMonth()]
        const d = createdDate.getDate()
        const y = createdDate.getFullYear()
        const h = displayCreatedHour
        const minutes = createdDate.getMinutes()
        const ampm = displayCreatedAMPM
        if (currentDate.getDate() == createdDate.getDate()) {
            return `${h}:${minutes} ${ampm}`
        }
        return `${month} ${d}, ${y}, ${h}:${minutes} ${ampm}`
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'messenger-conversation')) {
            messengerConversationClick(e)
        }
    })

    async function messengerConversationClick(e) {
        const conversation = findParents(e.target, 'messenger-conversation')
        const conversationId = conversation.dataset['conversation_id']

        const href = `/messenger/${conversationId}/`

        const targetPage = href
        const currentPage = utils.getCurrentPage()
        history.pushState({ targetPage, currentPage }, null, targetPage)
        utils.updateDocumentTitle()
        changeContent(href)
    }

    document.addEventListener('click', e => {
        if (findParents(e.target, 'messenger-back')) {
            messengerBack(e)
        }
    })

    function messengerBack() {
        const targetPage = '/messenger/'
        const currentPage = utils.getCurrentPage()
        if (history.state['currentPage'] === currentPage) {
            history.pushState({ targetPage, currentPage }, null, targetPage)
            changeContent(targetPage)
        } else {
            history.back()
        }
    }

    async function changeContent(href) {
        const ajaxProgressBar = document.querySelector('#ajax-progress-bar')

        try {
            utils.removeClass(ajaxProgressBar, 'bg-danger')
            ajaxProgressBar.parentNode.style.visibility = ''
            ajaxProgressBar.style.width = '80%'

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

            // Save Cache.
            utils.saveApCache(href, data)
            if (href != location.href.replace(location.origin, '')) {
                log('It seems that you moved to a different page first.')
                return
            }
            utils.repaintNode(href, '#main')

            window.dispatchEvent(new Event('aquaprojects_popstate'))

            ajaxProgressBar.style.width = '100%'
            ajaxProgressBar.style.transition = 'width 0.1s ease 0s'

            setTimeout(() => {
                ajaxProgressBar.parentNode.style.visibility = 'hidden'
                ajaxProgressBar.style.width = '0%'
                ajaxProgressBar.style.transition = ''
            }, 200)
        } catch (err) {
            error(err)
        }
    }
})()
