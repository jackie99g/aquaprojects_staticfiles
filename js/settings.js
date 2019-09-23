$(function() {
    $(".save-button").on("click", function() {
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
        }).done(function(data) {
            $(".status").text('success!: ' + data)
        }).fail(function(data) {
            $(".status").text('fail...: ' + data)
        })
    })
})