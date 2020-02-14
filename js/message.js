$(function() {
    $(window).on('aquaproject_popstate', function() {
        if (location.pathname.replace(location.origin, '') === '/message') {
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
            getScript('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.slim.js').then(() => startMessage())
        }
    })
    if (location.pathname.replace(location.origin, '') === '/message') {
        window.dispatchEvent( new Event('aquaproject_popstate'));
    }

    function startMessage() {
        var socket = io.connect();
        socket.on('connect', function() {
            socket.emit('my_event', {
                data: 'I\'m connected!'
            });
        });
        socket.on('disconnect', function() {
            $('#log').append('<br>Disconnected');
        });
        socket.on('my_response', function(msg) {
            $('#log').append('<br>Received: ' + msg.data);
        });

        // event handler for server sent data
        // the data is displayed in the "Received" section of the page
        // handlers for the different forms in the page
        // these send data to the server in a variety of ways
        $('form#emit').submit(function() {
            socket.emit('my_event', {
                data: $('#emit_data').val()
            });
            return false;
        });
        $('form#broadcast').submit(function() {
            socket.emit('my_broadcast_event', {
                data: $('#broadcast_data').val()
            });
            return false;
        });
        $('form#join').submit(function() {
            socket.emit('join', {
                room: $('#join_room').val()
            });
            return false;
        });
        $('form#leave').submit(function() {
            socket.emit('leave', {
                room: $('#leave_room').val()
            });
            return false;
        });
        $('form#send_room').submit(function() {
            socket.emit('my_room_event', {
                room: $('#room_name').val(),
                data: $('#room_data').val()
            });
            return false;
        });
        $('form#close').submit(function() {
            socket.emit('close_room', {
                room: $('#close_room').val()
            });
            return false;
        });
        $('form#disconnect').submit(function() {
            socket.emit('disconnect_request');
            return false;
        });
    }
});