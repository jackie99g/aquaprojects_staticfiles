$(document).ready(function () {
    var socket = io.connect();

    socket.on('connect', function () {
        socket.emit('my_event', { data: 'I\'m connected!' });
    });
    socket.on('disconnect', function () {
        $('#log').append('<br>Disconnected');
    });
    socket.on('my_response', function (msg) {
        $('#log').append('<br>Received: ' + msg.data);
    });

    // event handler for server sent data
    // the data is displayed in the "Received" section of the page
    // handlers for the different forms in the page
    // these send data to the server in a variety of ways
    $('form#emit').submit(function (event) {
        socket.emit('my_event', { data: $('#emit_data').val() });
        return false;
    });
    $('form#broadcast').submit(function (event) {
        socket.emit('my_broadcast_event', { data: $('#broadcast_data').val() });
        return false;
    });
    $('form#join').submit(function (event) {
        socket.emit('join', { room: $('#join_room').val() });
        return false;
    });
    $('form#leave').submit(function (event) {
        socket.emit('leave', { room: $('#leave_room').val() });
        return false;
    });
    $('form#send_room').submit(function (event) {
        socket.emit('my_room_event', { room: $('#room_name').val(), data: $('#room_data').val() });
        return false;
    });
    $('form#close').submit(function (event) {
        socket.emit('close_room', { room: $('#close_room').val() });
        return false;
    });
    $('form#disconnect').submit(function (event) {
        socket.emit('disconnect_request');
        return false;
    });
});