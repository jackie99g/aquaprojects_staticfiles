(() => {
    window.addEventListener('aquaprojects_popstate', () => {
        if (`/${location.pathname.replace(location.origin, '').split('/')[1]}` === '/weather') {
            drawWeather()
            adjustWeatherContentSize()
            changeTheme()
        }
    })

    if (`/${location.pathname.replace(location.origin, '').split('/')[1]}` === '/weather') {
        window.dispatchEvent(new Event('aquaprojects_popstate'));
    }

    // daily-weather-left-btn
    document.addEventListener('click', e => {
        if (findParents(e.target, 'daily-weather-left-btn')) {
            const weatherDay = document.querySelector('.weather-day')
            scrollContentLeft(
                document.querySelectorAll('.daily-weather')[0],
                -weatherDay.clientWidth - weatherDay.offsetWidth,
                200
            )
        }
    })

    // daily-weather-right-btn
    document.addEventListener('click', e => {
        if (findParents(e.target, 'daily-weather-right-btn')) {
            const weatherDay = document.querySelector('.weather-day')
            scrollContentLeft(
                document.querySelectorAll('.daily-weather')[0],
                weatherDay.clientWidth + weatherDay.offsetWidth,
                200
            )
        }
    })

    // hourly-weather-left-btn
    document.addEventListener('click', e => {
        if (findParents(e.target, 'hourly-weather-left-btn')) {
            const weatherHourly = document.querySelector('.weather-hourly')
            scrollContentLeft(
                document.querySelectorAll('.hourly-weather')[0],
                -weatherHourly.clientWidth - weatherHourly.offsetWidth,
                200
            )
            scrollContentLeft(
                document.querySelectorAll('.hourly-weather-chart-block')[0],
                -weatherHourly.clientWidth - weatherHourly.offsetWidth,
                200
            )
        }
    })

    // hourly-weather-right-btn
    document.addEventListener('click', e => {
        if (findParents(e.target, 'hourly-weather-right-btn')) {
            const weatherHourly = document.querySelector('.weather-hourly')
            scrollContentLeft(
                document.querySelectorAll('.hourly-weather')[0],
                weatherHourly.clientWidth + weatherHourly.offsetWidth,
                200
            )
            scrollContentLeft(
                document.querySelectorAll('.hourly-weather-chart-block')[0],
                weatherHourly.clientWidth + weatherHourly.offsetWidth,
                200
            )
        }
    })


    function drawWeather() {
        var hourlyWeather = document.getElementsByClassName('weather-temp-hourly')
        var hourlyWeatherDate = document.getElementsByClassName('weather-date-hourly')
        var hourlyWeatherlist = []
        var hourlyWeatherDatelist = []
        var hourlyWeatherWidth = 100
        Array.prototype.forEach.call(hourlyWeather, function (element) {
            var weatherTemp = parseFloat(element.innerText.replace('℃', ''))
            hourlyWeatherlist.push(weatherTemp)
        })
        Array.prototype.forEach.call(hourlyWeatherDate, function (element) {
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

    window.addEventListener('resize', () => {
        if ('/' + location.pathname.replace(location.origin, '').split('/')[1] === '/weather') {
            adjustWeatherContentSize()
        }
    })

    function adjustWeatherContentSize() {
        var windowWidth = window.innerWidth;
        var dailyWeather = document.querySelector('.daily-weather')
        var hourlyWeather = document.querySelector('.hourly-weather')
        var hourlyWeatherChartBlock = document.querySelector('.hourly-weather-chart-block')
        if (windowWidth < 768) {
            dailyWeather.style.overflowX = 'auto'
            hourlyWeather.style.overflowX = 'auto'
            hourlyWeatherChartBlock.overflowX = 'auto'
        } else {
            dailyWeather.style.overflowX = 'hidden'
            hourlyWeather.style.overflowX = 'hidden'
            hourlyWeatherChartBlock.overflowX = 'hidden'
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

    function changeTheme() {
        const body = document.querySelector('body')
        const logo = document.querySelectorAll('.header .logo img')
        const changeStyles = ['border', 'background', 'background-skelton', 'color-sub']

        if (localStorage.getItem('ap-theme-dark')) {
            body.style.backgroundColor = 'rgb(21, 32, 43)'
            body.style.color = 'rgb(255, 255, 255)'
            Array.from(logo).forEach(item => item.style.filter = 'brightness(0) invert(1)')
            changeThemeNode('white', 'dark')
        } else if (localStorage.getItem('ap-theme-dark') === null) {
            body.style.backgroundColor = 'rgb(255, 255, 255)'
            body.style.color = ''
            Array.from(logo).forEach(item => item.style.filter = '')
            changeThemeNode('dark', 'white')
        }

        function changeThemeNode(beforeTheme, afterTheme) {
            for (let index = 0; index < changeStyles.length; index++) {
                const element = changeStyles[index];
                changeThemeClass(
                    document.querySelectorAll(`.ap_theme-${beforeTheme}-${element}`),
                    beforeTheme, afterTheme
                )
            }
        }

        function changeThemeClass(nodeList, beforeTheme, afterTheme) {
            for (let index = 0; index < nodeList.length; index++) {
                const element = nodeList[index];
                const changedClassName = element.className.replaceAll(
                    `ap_theme-${beforeTheme}`, `ap_theme-${afterTheme}`
                )
                element.className = changedClassName
            }
        }
    }

    function findParents(target, className) {
        if (target === document) return false
        if (target.className.length !== 0 && target.classList.contains(className)) {
            return target
        }
        var currentNode = target.parentNode
        if (currentNode === document || currentNode === null) {
            return false
        } else if (currentNode.className.length !== 0 && currentNode.classList.contains(className)) {
            return currentNode
        } else {
            return findParents(currentNode, className)
        }
    }
})()