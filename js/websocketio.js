$(function() {
    window.addEventListener('aquaproject_popstate', () => {
        if ('/' + location.pathname.replace(location.origin, '').split('/')[1] === '/websocketio') {
            initializeWebsocketio()
        }
    })

    if ('/' + location.pathname.replace(location.origin, '').split('/')[1] === '/websocketio') {
        window.dispatchEvent(new Event('aquaproject_popstate'));
    }

    function initializeWebsocketio() {
        var logArea = document.querySelector('#log')
        var logPing = document.querySelector('#log_ping')
        var socket = io.connect();

        socket.on('connect', () => {
            logArea.innerHTML += `${new Date()}: websocket was connected.\n`
            startPing()
        })

        socket.on('websocketio', (msg) => {
            logArea.innerHTML += `${new Date()}: ${msg.data}\n`
        })

        socket.on('ping', (timestamp) => {
            var latency = new Date().getTime() / 1000 - timestamp
            logPing.innerHTML = `Ping: ${latency * 1000}ms\n`
        })

        var isFirst = false
        var pingSettimeoutClear = false
        var currentUnixtime = 0

        function startPing() {
            var pingFunction = () => {
                currentUnixtime = new Date().getTime() / 1000
                socket.emit('ping_pong', {})
                if (pingSettimeoutClear) clearTimeout(pingFunction)
                console.log('PING fired.')
                setTimeout(pingFunction, 1000)
            }
            if (isFirst) return false
            pingFunction()
            isFirst = true
        }

        socket.on('ping_pong', (status) => {
            var latency = new Date().getTime() / 1000 - currentUnixtime
            logPing.innerHTML = `Ping: ${latency * 1000}ms\n`
        })
    }
})