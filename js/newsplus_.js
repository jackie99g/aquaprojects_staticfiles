(() => {
    $(window).on('aquaprojects_popstate', function() {
        if ('/' + location.pathname.replace(location.origin, '').split('/')[1] === '/newsplus_') {
            drawNewsplusAll('initialize')
        }
    })
    if ('/' + location.pathname.replace(location.origin, '').split('/')[1] === '/newsplus_') {
        window.dispatchEvent(new Event('aquaprojects_popstate'));
    }

    function drawNewsplusAll(mode) {
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
        var delaycss = document.createElement('link');
        delaycss.rel = 'stylesheet';
        delaycss.href = 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.5.1/css/swiper.min.css';
        document.head.appendChild(delaycss);
        getScript('https://unpkg.com/swiper/js/swiper.min.js').then(() => drawNewsplus(mode))
    }

    function drawNewsplus(mode) {
        var galleryMenu = new Swiper('.gallery-menu', {
            slidesPerView: 3,
            freeMode: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            breakpoints: {
                768: {
                    slidesPerView: 7,
                }
            }
        })
        var galleryContents = new Swiper('.gallery-contents', {
            navigation: {
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next'
            },
            thumbs: {
                swiper: galleryMenu
            }
        })
        galleryContents.on('slideChangeTransitionStart', function() {
            slideChange()
        })
        $('.contents_anchor').on('click', function() {
            return false;
        })

        if (mode === 'initialize') {
            console.log('newsplus initialize.')
            startNewsplus()
        }

        function slideChange() {
            scrollPageTop()
            var url_list = []
            var url_query_list = []
            var contents_list = []
            var contents_query_Now_list = []
            var contents_query_Prev_list = []
            var contents_active_slide = ''
            var reObj = new RegExp('swiper_contents_')
            $('.contents_anchor').each(function() {
                url_list.push($(this).attr('href'))
                url_query_list.push($(this).attr('href').split('q=')[1])
            })
            $('.swiper_contents').each(function() {
                contents_list.push($(this).attr('class'))
            })
            // Now
            contents_query_Now_list.push(contents_list[galleryContents.realIndex].split(' '))
            contents_query_Now_list = contents_query_Now_list[0]
            for (let index = 0; index < contents_query_Now_list.length; index++) {
                if (reObj.test(contents_query_Now_list[index]) == true) {
                    contents_active_slide = contents_query_Now_list[index]
                }
            }
            // Prev
            contents_query_Prev_list.push(contents_list[galleryContents.previousIndex].split(' '))
            contents_query_Prev_list = contents_query_Prev_list[0]
            for (let index = 0; index < contents_query_Prev_list.length; index++) {
                if (reObj.test(contents_query_Prev_list[index]) == true) {
                    contents_prev_active_slide = contents_query_Prev_list[index]
                }
            }
            var targetPage = url_list[galleryContents.realIndex]
            var currentPage = url_list[galleryContents.previousIndex]
            var changeLocation = '.' + contents_active_slide
            var contentsLocation = changeLocation
            var state = {
                'thisisexperiment': true,
                'targetPage': targetPage,
                'currentPage': currentPage,
                'changeLocation': changeLocation
            };
            if (history.state == null) {
                history.pushState(state, null, targetPage);
            } else if (history.state['is_experiment_pushState'] != true) {
                // When flag is false, it runs. the time when not run 'popState'.
                history.pushState(state, null, targetPage);
            } else {
                history.replaceState(state, null, targetPage)
                document.title = 'Aqua Projects - ' + targetPage
                return false
            }
            document.title = 'Aqua Projects - ' + targetPage
            changeContentInExperiment(targetPage, contentsLocation, changeLocation)
        }

        function changeContentInExperiment(uri, contentsLocation, changeLocation) {
            $(changeLocation).html('<div class="loader" style="font-size: 2px; margin: 8px auto auto;"></div>');
            $('#ajax-progress-bar').removeClass('bg-danger');
            $('#ajax-progress-bar').css({
                'visibility': 'visible'
            });
            $('#ajax-progress-bar').css({
                'width': '80%'
            });
            // Cache exsists.
            if (AquaProjectCache[uri]) {
                $(changeLocation).html($(AquaProjectCache[uri]).find(history.state['changeLocation']).html());
                $('#ajax-progress-bar').css({
                    'width': '100%'
                });
            }
            fetch(
                uri, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include'
                }
            ).then(response => {
                if (response.ok) {
                    return response.text()
                } else {
                    console.error(response)
                    $('#ajax-progress-bar').addClass('bg-danger');
                    $('#ajax-progress-bar').css({
                        'width': '100%'
                    });
                    $(changeLocation).html('<div style="word-break: break-all; margin: 8px auto auto;"><div style="margin: 0px auto; width: fit-content;"><div style="width: fit-content; margin: 0px auto;"><i class="fas fa-exclamation-circle"></i></div>Looks like you lost your connection. Please check it and try again.</div></div>')
                }
            }).then(data => {
                // Save Cache.
                AquaProjectCache[uri] = data
                var mc = $(data).find(contentsLocation).html();
                $(changeLocation).html(mc);
                $('#ajax-progress-bar').css({
                    'width': '100%',
                    'transition': 'width 0.1s ease 0s',
                });

                function wait(sec) {
                    var objDef = new $.Deferred;
                    setTimeout(function() {
                        objDef.resolve(sec);
                    }, sec * 1000);
                    return objDef.promise();
                }
                wait(0.2).done(function() {
                    $('#ajax-progress-bar').css({
                        'visibility': 'hidden',
                        'width': '0%',
                        'transition': 'width 0.6s ease 0s',
                    });
                });
            }).catch(err => {
                console.error(err)
            })
        }

        function startNewsplus() {
            var slideNumber = 0
            var currentPage = location.href;
            currentPage = currentPage.split('/')
            currentPage = currentPage[currentPage.length - 1]
            if (location.search == '') {
                slideNumber = 0
            } else {
                var contents_list = []
                var contents_query_Now_list = []
                $('.swiper_contents').each(function() {
                    contents_list.push($(this).attr('class'))
                })
                for (let index = 0; index < contents_list.length; index++) {
                    contents_query_Now_list.push(contents_list[index].split(' '))
                }
                for (let index = 0; index < contents_query_Now_list.length; index++) {
                    for (let inner_index = 0; inner_index < contents_query_Now_list[index].length; inner_index++) {
                        if ('swiper_contents_' + location.search.split('q=')[1] == contents_query_Now_list[index][inner_index]) {
                            slideNumber = index
                        }
                    }
                }
            }
            var state = {
                'currentPage': currentPage,
                'targetPage': currentPage,
                'thisisexperiment': true,
            }

            if (history.state != null) {
                if (history.state['drawLocationChanged'] == true) {
                    state['is_experiment_pushState'] = true
                }
                if (history.state['is_experiment_pushState'] == undefined) {
                    state['is_experiment_pushState'] = true
                }
            }
            history.replaceState(state, null, currentPage)
            galleryContents.slideTo(slideNumber)
        }

        $(window).on('popstate', function(e) {
            // experiment
            if (e.originalEvent.state['thisisexperiment'] == true) {
                if (history.state['drawLocationChanged'] != true) { // 領域を変更しないとき
                    var slideNumber = 1
                    var slideNumber = 0
                    if (location.search == '') {
                        slideNumber = 0
                    } else {
                        var contents_list = []
                        var contents_query_Now_list = []
                        $('.swiper_contents').each(function() {
                            contents_list.push($(this).attr('class'))
                        })
                        for (let index = 0; index < contents_list.length; index++) {
                            contents_query_Now_list.push(contents_list[index].split(' '))
                        }
                        for (let index = 0; index < contents_query_Now_list.length; index++) {
                            for (let inner_index = 0; inner_index < contents_query_Now_list[index].length; inner_index++) {
                                if ('swiper_contents_' + location.search.split('q=')[1] == contents_query_Now_list[index][inner_index]) {
                                    slideNumber = index
                                }
                            }
                        }
                    }
                    var state = {
                        'thisisexperiment': true,
                        'targetPage': history.state['targetPage'],
                        'currentPage': history.state['currentPage'],
                        'changeLocation': history.state['changeLocation'],
                        'is_experiment_pushState': true,
                    };
                    history.replaceState(state, null, history.state['targetPage'])
                    galleryContents.slideTo(slideNumber)
                    return false;
                }
            }
        })
    }

    function scrollPageTop() {
        scrollTop(500)

        function scrollTop(n) {
            var t = new Date,
                i = window.pageYOffset,
                r = setInterval(() => {
                    var u = new Date - t;
                    u > n && (clearInterval(r), u = n);
                    window.scrollTo(0, i * (1 - u / n))
                }, 10)
        }
    }
})()