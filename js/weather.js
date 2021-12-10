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
            'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.6.0/chart.min.js'
        ).then(() =>
            drawChart(
                weatherHourlyChart.parentNode,
                weatherHourlyChart,
                hourlyWeatherDatelist.slice(0, 24),
                hourlyWeatherlist.slice(0, 24)
            )
        )

        function drawChart(
            chartContainer,
            chartCanvas,
            labels,
            dataDatasetsData
        ) {
            const getAspectRatio = () => (window.innerWidth < 768 ? 2 : 4)
            const getbbgcrgba = () => {
                const body = document.querySelector('body')
                const bbgc = body.style.backgroundColor
                    .replaceAll(' ', '')
                    .replace('rgb(', '')
                    .replace(')', '')
                    .split(',')
                const bbgcrgba = `rgba(${bbgc[0]}, ${bbgc[1]}, ${bbgc[2]}, 0)`
                return bbgcrgba
            }
            const ctx = chartCanvas.getContext('2d')
            const chartHeight = chartContainer.offsetWidth / getAspectRatio()

            const gradientStroke = ctx.createLinearGradient(
                0,
                chartHeight,
                0,
                0
            )
            gradientStroke.addColorStop(1, 'rgba(29, 161, 242)')
            gradientStroke.addColorStop(0, 'rgba(29, 161, 242)')

            const gradientFill = ctx.createLinearGradient(0, chartHeight, 0, 0)
            gradientFill.addColorStop(1, 'rgba(29, 161, 242, 0.6)')
            gradientFill.addColorStop(0, getbbgcrgba())

            // Setup
            const data = {
                labels: labels,
                datasets: [
                    {
                        label: 'My First dataset',
                        borderColor: gradientStroke,
                        pointBackgroundColor: gradientStroke,
                        backgroundColor: gradientFill,
                        data: dataDatasetsData,
                        tension: 0.4,
                        fill: true,
                    },
                ],
            }

            // Config
            const config = {
                type: 'line',
                data: data,
                options: {
                    plugins: {
                        legend: false,
                    },
                    scales: {
                        x: {
                            display: true,
                            grid: {
                                display: false,
                                drawBorder: false,
                            },
                        },
                        y: {
                            display: true,
                            grid: {
                                drawBorder: false,
                            },
                        },
                    },
                    aspectRatio: getAspectRatio(),
                },
            }

            // === include 'setup' then 'config' above ===

            /* eslint-disable */
            const chart = new Chart(chartCanvas, config)
            /* eslint-enable */

            window.addEventListener('resize', () => {
                chart.options.aspectRatio = getAspectRatio()
                chart.update()
            })

            const mediaQueryString = '(prefers-color-scheme: dark)'
            const wm = window.matchMedia(mediaQueryString)
            wm.addEventListener('change', () => {
                const gradientFill = ctx.createLinearGradient(
                    0,
                    chartHeight,
                    0,
                    0
                )
                gradientFill.addColorStop(1, 'rgba(29, 161, 242, 0.6)')
                gradientFill.addColorStop(0, getbbgcrgba())
                chart.data.datasets[0].backgroundColor = gradientFill
                chart.update()
            })
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
        if (windowWidth < 768) {
            dailyWeather.style.overflowX = 'auto'
            hourlyWeather.style.overflowX = 'auto'
        } else {
            dailyWeather.style.overflowX = 'hidden'
            hourlyWeather.style.overflowX = 'hidden'
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
