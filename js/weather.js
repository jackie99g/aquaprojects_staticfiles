$(function() {
    $(window).on('aquaproject_popstate', function() {
        if (location.pathname.replace(location.origin, '') === '/weather') {
            drawWeather()
            $('.hourly-weather-chart-block').scroll(function() {
                $('.hourly-weather').scrollLeft($(this).scrollLeft())
            })

            $('.hourly-weather').scroll(function() {
                $('.hourly-weather-chart-block').scrollLeft($(this).scrollLeft())
            })
        }
    })
    if (location.pathname.replace(location.origin, '') === '/weather') {
        $(window).trigger('aquaproject_popstate');
    }

    $(document).on('click', '.daily-weather-left-btn', function() {
        wdwidth = $('.weather-day').width()
        wdoutwidth = $('.weather-day').outerWidth()
        dwwidth = $('.daily-weather').scrollLeft()
        scrollContentLeft(
            document.getElementsByClassName('daily-weather')[0],
            -wdoutwidth - wdwidth,
            200
        )
    })

    $(document).on('click', '.daily-weather-right-btn', function() {
        wdwidth = $('.weather-day').width()
        wdoutwidth = $('.weather-day').outerWidth()
        dwwidth = $('.daily-weather').scrollLeft()
        scrollContentLeft(
            document.getElementsByClassName('daily-weather')[0],
            wdwidth + wdoutwidth,
            200
        )
    })

    $(document).on('click', '.hourly-weather-left-btn', function() {
        whwidth = $('.weather-hourly').width()
        whoutwidth = $('.weather-hourly').outerWidth()
        hwwidth = $('.hourly-weather').scrollLeft()
        scrollContentLeft(
            document.getElementsByClassName('weather-hourly')[0],
            -whoutwidth - whwidth,
            200
        )
        scrollContentLeft(
            document.getElementsByClassName('hourly-weather-chart-block')[0],
            -whoutwidth - whwidth,
            200
        )
    })

    $(document).on('click', '.hourly-weather-right-btn', function() {
        whwidth = $('.weather-hourly').width()
        whoutwidth = $('.weather-hourly').outerWidth()
        hwwidth = $('.hourly-weather').scrollLeft()

        scrollContentLeft(
            document.getElementsByClassName('weather-hourly')[0],
            whoutwidth + whwidth,
            200
        )
        scrollContentLeft(
            document.getElementsByClassName('hourly-weather-chart-block')[0],
            whoutwidth + whwidth,
            200
        )
    })

    function drawWeather() {
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
        getScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js').then(() => drawChart())

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
    }

    function scrollContentLeft(n, t, i) {
        var r = new Date,
            u = n.scrollLeft,
            f = setInterval(() => {
                var e = new Date - r;
                e > i && (clearInterval(f), e = i);
                n.scrollLeft = u + t * (e / i)
            }, 10)
    }
})