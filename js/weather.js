import { changeTheme, findParents } from './utils.js'
import * as utils from './utils.js'
!(() => {
    window.addEventListener('aquaprojects_popstate', () => {
        if (utils.locationMatch('/weather')) {
            drawWeather()
            adjustWeatherContentSize()
            applyTimeZone()
            changeTheme()
        }
    })

    if (utils.locationMatch('/weather')) {
        window.dispatchEvent(new Event('aquaprojects_popstate'))
    }

    // daily-weather-left-btn
    document.addEventListener('click', e => {
        if (findParents(e.target, 'daily-weather-left-btn')) {
            dailyWeatherLeftBtnClick()
        }
    })

    function dailyWeatherLeftBtnClick() {
        const weatherDay = document.querySelector('.weather-day')
        scrollContentLeft(
            document.querySelectorAll('.daily-weather')[0],
            -weatherDay.clientWidth - weatherDay.offsetWidth,
            200
        )
    }

    // daily-weather-right-btn
    document.addEventListener('click', e => {
        if (findParents(e.target, 'daily-weather-right-btn')) {
            dailyWeatherRightBtnClick()
        }
    })

    function dailyWeatherRightBtnClick() {
        const weatherDay = document.querySelector('.weather-day')
        scrollContentLeft(
            document.querySelectorAll('.daily-weather')[0],
            weatherDay.clientWidth + weatherDay.offsetWidth,
            200
        )
    }

    // hourly-weather-left-btn
    document.addEventListener('click', e => {
        if (findParents(e.target, 'hourly-weather-left-btn')) {
            hourlyWeatherLeftBtnClick()
        }
    })

    function hourlyWeatherLeftBtnClick() {
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

    // hourly-weather-right-btn
    document.addEventListener('click', e => {
        if (findParents(e.target, 'hourly-weather-right-btn')) {
            hourlyWeatherRightBtnClick()
        }
    })

    function hourlyWeatherRightBtnClick() {
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

    function drawWeather() {
        const hourlyWeather = document.querySelectorAll('.weather-temp-hourly')
        const hourlyWeatherDate = document.querySelectorAll(
            '.weather-date-hourly'
        )
        const hourlyWeatherlist = []
        const hourlyWeatherDatelist = []
        const hourlyWeatherWidth = 100
        Array.from(hourlyWeather).forEach(element => {
            const weatherTemp = parseFloat(element.innerText.replace('℃', ''))
            hourlyWeatherlist.push(weatherTemp)
        })
        Array.from(hourlyWeatherDate).forEach(element => {
            hourlyWeatherDatelist.push(
                utils
                    .getLocalDateByUTC(parseInt(element.innerText))
                    .getUTCHours()
            )
        })
        const selectors = '.weather-hourly-chart'
        const weatherHourlyChart = document.querySelector(selectors)
        const ctx = weatherHourlyChart.getContext('2d')
        ctx.canvas.height = 100
        ctx.canvas.width = hourlyWeatherlist.length * hourlyWeatherWidth

        function getScript(source) {
            return new Promise((resolve, reject) => {
                let script = document.createElement('script')
                const prior = document.getElementsByTagName('script')[0]
                script.async = 1

                script.onload = script.onreadystatechange = (_, isAbort) => {
                    if (
                        isAbort ||
                        !script.readyState ||
                        /loaded|complete/.test(script.readyState)
                    ) {
                        script.onload = script.onreadystatechange = null
                        script = undefined

                        !isAbort && resolve()
                        isAbort && reject()
                    }
                }

                script.src = source
                prior.parentNode.insertBefore(script, prior)
            })
        }

        getScript(
            'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js'
        ).then(() => drawChart())

        function drawChart() {
            /* eslint-disable */
            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: hourlyWeatherDatelist,
                    datasets: [
                        {
                            data: hourlyWeatherlist,
                            backgroundColor: 'rgba(29, 161, 242, 0.2)',
                            borderColor: 'rgba(29, 161, 242, 1)',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    legend: {
                        display: false,
                    },
                    responsive: false,
                    scales: {
                        xAxes: [
                            {
                                ticks: {
                                    beginAtZero: true,
                                },
                            },
                        ],
                        yAxes: [
                            {
                                ticks: {
                                    display: false,
                                },
                                gridLines: {
                                    display: false,
                                },
                            },
                        ],
                    },
                },
            })
            /* eslint-enable */
        }
    }

    window.addEventListener('resize', () => {
        if (utils.locationMatch('/weather')) {
            adjustWeatherContentSize()
        }
    })

    function adjustWeatherContentSize() {
        const windowWidth = window.innerWidth
        const dailyWeather = document.querySelector('.daily-weather')
        const hourlyWeather = document.querySelector('.hourly-weather')
        const hourlyWeatherChartBlock = document.querySelector(
            '.hourly-weather-chart-block'
        )
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

    function applyTimeZone() {
        const weatherTime = document.querySelector('.weather-time span')
        const dailyWeatherDate = document.querySelectorAll(
            '.daily-weather .weather-date'
        )
        const hourlyWeatherDate = document.querySelectorAll(
            '.hourly-weather .weather-date'
        )
        const detailsSunrise = document.querySelector('.details-sunrise span')
        const detailsSunset = document.querySelector('.details-sunset span')
        const weatherTimeDate = utils.getLocalDateByUTC(
            parseInt(weatherTime.innerText)
        )
        weatherTime.innerText = weatherTimeDate.toISOString()
        dailyWeatherDate.forEach(element => {
            element.innerText = utils
                .getLocalDateByUTC(parseInt(element.innerText))
                .getUTCDate()
        })
        hourlyWeatherDate.forEach(element => {
            element.innerText = utils
                .getLocalDateByUTC(parseInt(element.innerText))
                .getUTCHours()
        })
        detailsSunrise.innerText = utils
            .getLocalDateByUTC(parseInt(detailsSunrise.innerText))
            .toISOString()
        detailsSunset.innerText = utils
            .getLocalDateByUTC(parseInt(detailsSunset.innerText))
            .toISOString()
    }

    function scrollContentLeft(n, t, i) {
        const r = new Date(),
            u = n.scrollLeft,
            f = setInterval(() => {
                let e = new Date() - r
                e > i && (clearInterval(f), (e = i))
                n.scrollLeft = u + t * (e / i)
            }, 10)
    }
})()
