$(function() {
    $(document).ready(function() {
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
    $('#rbtn').on("click", function() {
        wdwidth = $('.weather-day').width()
        wdoutwidth = $('.weather-day').outerWidth()
        dwwidth = $('.daily-weather').scrollLeft()
        whwidth = $('.weather-hourly').width()
        whoutwidth = $('.weather-hourly').outerWidth()
        hwwidth = $('.hourly-weather').width()
        $('.daily-weather').scrollLeft(wdwidth + wdoutwidth + dwwidth)
        $('.hourly-weather').scrollLeft(whwidth + whoutwidth + hwwidth)
    })
    $('.daily-weather-left-btn').on("click", function() {
        wdwidth = $('.weather-day').width()
        wdoutwidth = $('.weather-day').outerWidth()
        dwwidth = $('.daily-weather').scrollLeft()
        $('.daily-weather').animate({
            scrollLeft: dwwidth - wdoutwidth - wdwidth
        }, {
            duration: 200
        })
    })
    $('.daily-weather-right-btn').on("click", function() {
        wdwidth = $('.weather-day').width()
        wdoutwidth = $('.weather-day').outerWidth()
        dwwidth = $('.daily-weather').scrollLeft()
        $('.daily-weather').animate({
            scrollLeft: dwwidth + wdwidth + wdoutwidth
        }, {
            duration: 200
        })
    })
    $('.hourly-weather-left-btn').on("click", function() {
        whwidth = $('.weather-hourly').width()
        whoutwidth = $('.weather-hourly').outerWidth()
        hwwidth = $('.hourly-weather').scrollLeft()
        $('.hourly-weather').animate({
            scrollLeft: hwwidth - whoutwidth - whwidth
        }, {
            duration: 200
        })
        $('.hourly-weather-chart-block').animate({
            scrollLeft: hwwidth - whoutwidth - whwidth
        }, {
            duration: 200
        })
    })
    $('.hourly-weather-right-btn').on("click", function() {
        whwidth = $('.weather-hourly').width()
        whoutwidth = $('.weather-hourly').outerWidth()
        hwwidth = $('.hourly-weather').scrollLeft()
        $('.hourly-weather').animate({
            scrollLeft: hwwidth + whoutwidth + whwidth
        }, {
            duration: 200
        })
        $('.hourly-weather-chart-block').animate({
            scrollLeft: hwwidth + whoutwidth + whwidth
        }, {
            duration: 200
        })
    })
    $('.hourly-weather-chart-block').scroll(function() {
        $('.hourly-weather').scrollLeft($(this).scrollLeft())
    })
    $('.hourly-weather').scroll(function() {
        $('.hourly-weather-chart-block').scrollLeft($(this).scrollLeft())
    })
    var hourlyWeather = document.getElementsByClassName('weather-temp-hourly')
    var hourlyWeatherDate = document.getElementsByClassName('weather-date-hourly')
    var hourlyWeatherlist = []
    var hourlyWeatherDatelist = []
    var hourlyWeatherWidth = 100
    Array.prototype.forEach.call(hourlyWeather, function(element) {
        var weatherTemp = parseFloat(element.innerText.replace('℃', ''))
        hourlyWeatherlist.push(weatherTemp)
    })
    Array.prototype.forEach.call(hourlyWeatherDate, function(element) {
        var weatherDate = element.innerText.split(' ')[1] + ' ' + element.innerText.split(' ')[2]
        hourlyWeatherDatelist.push(weatherDate)
    })
    var ctx = document.getElementById('weather-hourly-chart').getContext('2d')
    ctx.canvas.height = 100
    ctx.canvas.width = hourlyWeatherlist.length * hourlyWeatherWidth
    $.cachedScript = function(url, options) {
        options = $.extend(options || {}, {
            dataType: "script",
            cache: true,
            url: url
        });
        return jQuery.ajax(options);
    };
    $.cachedScript("https://cdn.jsdelivr.net/npm/chart.js@2.8.0").done(function() {
        drawChart()
    });

    function drawChart() {
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: hourlyWeatherDatelist,
                datasets: [{
                    data: hourlyWeatherlist,
                    backgroundColor: 'rgba(29, 161, 242, 0.2)',
                    borderColor: 'rgba(29, 161, 242, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    display: false,
                },
                responsive: false,
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            display: false,
                        },
                        gridLines: {
                            display: false,
                        }
                    }],
                }
            }
        })
    }
})