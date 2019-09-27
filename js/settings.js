$(function () {
    $(".save-button").on("click", function () {
        background_url = $(".background-url").val()
        $(".status").text('sending...')
        var jsondata = {
            user_metadata: {
                background_image: background_url
            }
        }
        $.ajax({
            url: "/settings/save",
            data: {
                body: JSON.stringify(jsondata)
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        }).done(function (data) {
            $(".status").text('success!: ' + data)
        }).fail(function (data) {
            $(".status").text('fail...: ' + data)
        })
    })
    $('.connect-google').on('click', function () {
        $('.google-status').addClass('loader')
        $('.google-status-message').text('Running...')
        $.ajax({
            url: '/settings/connect/google',
            timeout: 60000,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        }).done(function (data) {
            $('.google-status').removeClass('loader')
            $('.google-status-message').text('')
            $('.google-status').text('succeed!' + data)
        }).fail(function (data) {
            $('.google-status').removeClass('loader')
            $('.google-status-message').text('')
            $('.google-status').text('fail...' + data)
        })
    })
    $('.disconnect-google').on('click', function () {
        $('.google-status').addClass('loader')
        $('.google-status-message').text('Running...')
        $.ajax({
            url: '/settings/disconnect/google',
            timeout: 60000,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        }).done(function (data) {
            $('.google-status').removeClass('loader')
            $('.google-status-message').text('')
            $('.google-status').text('succeed!' + data)
        }).fail(function (data) {
            $('.google-status-message').text('')
            $('.google-status').removeClass('loader')
            $('.google-status').text('fail...' + data)
        })
    })
})