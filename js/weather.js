$(function () {
    $(document).ready(function () {
        $.ajax({
            url: '/userinfo?q=' + 'user_metadata--background_image',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        }).done(function(data) {
            $('.weather-bg').css({
                'background-image': 'url(' + data + ')'
            })
        })
    })
    $('#rbtn').on("click", function () {
        wdwidth = $('.weather-day').width()
        wdoutwidth = $('.weather-day').outerWidth()
        dwwidth = $('.daily-weather').scrollLeft()
        whwidth = $('.weather-hourly').width()
        whoutwidth = $('.weather-hourly').outerWidth()
        hwwidth = $('.hourly-weather').width()
        $('.daily-weather').scrollLeft(wdwidth + wdoutwidth + dwwidth)
        $('.hourly-weather').scrollLeft(whwidth + whoutwidth + hwwidth)
    })
    $('.daily-weather-left-btn').on("click", function () {
        wdwidth = $('.weather-day').width()
        wdoutwidth = $('.weather-day').outerWidth()
        dwwidth = $('.daily-weather').scrollLeft()
        $('.daily-weather').animate({
            scrollLeft: dwwidth - wdoutwidth - wdwidth
        }, {duration: 200})
    })
    $('.daily-weather-right-btn').on("click", function () {
        wdwidth = $('.weather-day').width()
        wdoutwidth = $('.weather-day').outerWidth()
        dwwidth = $('.daily-weather').scrollLeft()
        $('.daily-weather').animate({
            scrollLeft: dwwidth + wdwidth + wdoutwidth
        }, {duration: 200})
    })
    $('.hourly-weather-left-btn').on("click", function () {
        whwidth = $('.weather-hourly').width()
        whoutwidth = $('.weather-hourly').outerWidth()
        hwwidth = $('.hourly-weather').scrollLeft()
        $('.hourly-weather').animate({
            scrollLeft: hwwidth - whoutwidth - whwidth
        }, {duration: 200})
    })
    $('.hourly-weather-right-btn').on("click", function () {
        whwidth = $('.weather-hourly').width()
        whoutwidth = $('.weather-hourly').outerWidth()
        hwwidth = $('.hourly-weather').scrollLeft()
        $('.hourly-weather').animate({
            scrollLeft: hwwidth + whoutwidth + whwidth
        }, {duration: 200})
    })
})