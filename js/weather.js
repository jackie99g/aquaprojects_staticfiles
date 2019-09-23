$(function () {
    $(document).ready(function() {
        $.ajax({
            url: '/userinfo?q=' + 'user_metadata--background_image',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        }).done(function(data) {
            $('.weather-bg').css({
                'background': 'url(' + data + ')'
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
        $('.daily-weather').scrollLeft(wdwidth - wdoutwidth - dwwidth)
    })
    $('.daily-weather-right-btn').on("click", function () {
        wdwidth = $('.weather-day').width()
        wdoutwidth = $('.weather-day').outerWidth()
        dwwidth = $('.daily-weather').scrollLeft()
        $('.daily-weather').scrollLeft(wdwidth + wdoutwidth + dwwidth)
    })
    $('.hourly-weather-left-btn').on("click", function () {
        whwidth = $('.weather-hourly').width()
        whoutwidth = $('.weather-hourly').outerWidth()
        hwwidth = $('.hourly-weather').scrollLeft()
        $('.hourly-weather').scrollLeft(hwwidth - whoutwidth - whwidth)
    })
    $('.hourly-weather-right-btn').on("click", function () {
        whwidth = $('.weather-hourly').width()
        whoutwidth = $('.weather-hourly').outerWidth()
        hwwidth = $('.hourly-weather').scrollLeft()
        $('.hourly-weather').scrollLeft(hwwidth + whoutwidth + whwidth)
    })
    // Experiment code..
    $("#bg-select").on("click", function () {
        url = $('#bg-url').val();
        $('.weather-bg').css({
            'background': 'url(' + url + ')'
        })
    })
})