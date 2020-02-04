$(function() {
    $(document).on('click', '.save-button', function() {
        background_url = $('.background-url').val()
        $('.status').text('sending...')
        var jsondata = {
            user_metadata: {
                timeline_background: background_url
            }
        }
        fetch(
            '/settings/save', {
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
            $('.status').text('success!: ' + data)
        }).catch(err => {
            console.log(err)
            $('.status').text('fail...: ' + data)
        })
    })
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