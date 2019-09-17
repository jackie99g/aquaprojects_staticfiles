$(function () {
    $(document).ready(function () {
        var currentPage = location.href;
        currentPage = currentPage.split('/')
        currentPage = currentPage[currentPage.length - 1]
        var state = {
            'targetPage': currentPage,
            'currentPage': currentPage,
            'changeLocation': '#main'
        };
        history.replaceState(state, null, currentPage)
        $('.contents_anchor_group a').removeClass('select_active')
        if (location.pathname.indexOf('home') >= 0) {
            $('.dashboard_anchor_home').addClass('select_active_dashboard')
        }
        if (location.pathname.indexOf('news') >= 0) {
            $('.dashboard_anchor_news').addClass('select_active_dashboard')
        }
        if (location.pathname.indexOf('weather') >= 0) {
            $('.dashboard_anchor_weather').addClass('select_active_dashboard')
        }
        if (location.pathname.indexOf('translate') >= 0) {
            $('.dashboard_anchor_translate').addClass('select_active_dashboard')
        }
        if (location.pathname.indexOf('search') >= 0) {
            $('.dashboard_anchor_search').addClass('select_active_dashboard')
        }
        if (location.search.indexOf('') == 0) {
            if (location.search.indexOf('business') >= 0) {
                $('.contents_anchor_business').addClass('select_active')
            }
            if (location.search.indexOf('entertainment') >= 0) {
                $('.contents_anchor_entertainment').addClass('select_active')
            }
            if (location.search.indexOf('general') >= 0) {
                $('.contents_anchor_general').addClass('select_active')
            }
            if (location.search.indexOf('health') >= 0) {
                $('.contents_anchor_health').addClass('select_active')
            }
            if (location.search.indexOf('science') >= 0) {
                $('.contents_anchor_science').addClass('select_active')
            }
            if (location.search.indexOf('sports') >= 0) {
                $('.contents_anchor_sports').addClass('select_active')
            }
            if (location.search.indexOf('technology') >= 0) {
                $('.contents_anchor_technology').addClass('select_active')
            }
            if(location.search.indexOf('Google') >= 0){
                $('#contents_anchor_google').addClass('select_active')
            }
            if(location.search.indexOf('%E3%81%94%E6%B3%A8%E6%96%87%E3%81%AF%E3%81%86%E3%81%95%E3%81%8E%E3%81%A7%E3%81%99%E3%81%8B?') >= 0){
                $('#contents_anchor_gochiusa').addClass('select_active')
            }
        }
        if (location.pathname + location.search == '/news') {
            if (location.search.indexOf('') == 0) {
                $('.contents_anchor_general').addClass('select_active')
            }
        }
        if (location.pathname + location.search == '/search') {
            if (location.search.indexOf('') == 0) {
                $('#contents_anchor_gochiusa').addClass('select_active')                
            }
        }
        document.title = 'Aqua Project - ' + currentPage;
    })
    $('.dashboard_anchor').on('click', function () {
        var targetPage = $(this).attr('href');
        targetPage = targetPage.split('/')
        targetPage = targetPage[targetPage.length - 1]
        var currentPage = location.href;
        currentPage = currentPage.split('/')
        currentPage = currentPage[currentPage.length - 1]
        state = {
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#main'
        };
        history.pushState(state, null, targetPage);
        document.title = 'Aqua Project - ' + targetPage
        $('.dashboard_anchor').removeClass('select_active_dashboard')
        $(this).addClass('select_active_dashboard')
        changeContent(targetPage);
        return false;
    })
    $(window).on('popstate', function (e) {
        if (!e.originalEvent.state) return false;
        if (e.originalEvent.state['thisissearch'] == true) {
            $('.contents_anchor_group a').removeClass('select_active')
            if(location.search.indexOf('Google') >= 0){
                $('#contents_anchor_google').addClass('select_active')
            }
            if(location.search.indexOf('%E3%81%94%E6%B3%A8%E6%96%87%E3%81%AF%E3%81%86%E3%81%95%E3%81%8E%E3%81%A7%E3%81%99%E3%81%8B?') >= 0){
                $('#contents_anchor_gochiusa').addClass('select_active')
            }
            if (location.pathname + location.search == '/search') {
                if (location.search.indexOf('') == 0) {
                    $('#contents_anchor_gochiusa').addClass('select_active')
                }
            }
            changeContentInSearch_(e.originalEvent.state['targetPage'], '#category_contents', '#category_contents')
            return false;
        }
        if (e.originalEvent.state['thisisnews'] == true) {
            $('.contents_anchor_group a').removeClass('select_active')
            if (location.search.indexOf('business') >= 0) {
                $('.contents_anchor_business').addClass('select_active')
            }
            if (location.search.indexOf('entertainment') >= 0) {
                $('.contents_anchor_entertainment').addClass('select_active')
            }
            if (location.search.indexOf('general') >= 0) {
                $('.contents_anchor_general').addClass('select_active')
            }
            if (location.search.indexOf('health') >= 0) {
                $('.contents_anchor_health').addClass('select_active')
            }
            if (location.search.indexOf('science') >= 0) {
                $('.contents_anchor_science').addClass('select_active')
            }
            if (location.search.indexOf('sports') >= 0) {
                $('.contents_anchor_sports').addClass('select_active')
            }
            if (location.search.indexOf('technology') >= 0) {
                $('.contents_anchor_technology').addClass('select_active')
            }
            if (location.pathname + location.search == '/news') {
                if (location.search.indexOf('') == 0) {
                    $('.contents_anchor_general').addClass('select_active')
                }
            }
            changeContentInSearch__(e.originalEvent.state['targetPage'], '#category_contents', '#category_contents')
            return false;
        }
        var pageState = e.originalEvent.state
        number = pageState['targetPage'].indexOf('search')
        console.log(number)
        if (pageState['targetPage'].indexOf('search') <= 0) {
            var beforePage = pageState['targetPage'];
            if (pageState['targetPage'] == null) {
                document.title = 'Aqua Project'
            } else {
                document.title = 'Aqua Project - ' + pageState['targetPage']
            }
            $('.dashboard_anchor_group a').removeClass('select_active_dashboard')            
            if (location.pathname.indexOf('home') >= 0) {
                $('.dashboard_anchor_home').addClass('select_active_dashboard')
            }
            if (location.pathname.indexOf('news') >= 0) {
                $('.dashboard_anchor_news').addClass('select_active_dashboard')
            }
            if (location.pathname.indexOf('weather') >= 0) {
                $('.dashboard_anchor_weather').addClass('select_active_dashboard')
            }
            if (location.pathname.indexOf('translate') >= 0) {
                $('.dashboard_anchor_translate').addClass('select_active_dashboard')
            }
            if (location.pathname.indexOf('search') >= 0) {
                $('.dashboard_anchor_search').addClass('select_active_dashboard')
            }
            changeContent(beforePage);
        }
    })
    function changeContentInSearch__(url, contentsLocation, changeLocation) {
        $('#ajax-progress-bar').css({ 'visibility': 'visible' });
        $('#ajax-progress-bar').css({ 'width': '80%' });
        $.ajax({
            url: url,
            type: "GET",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        }).done(function (data) {
            console.log('done')
            var mc = $(data).find(contentsLocation).html();
            $(changeLocation).html(mc);
            $('#ajax-progress-bar').css({ 'width': '100%' });
            $('#ajax-progress-bar').css({ 'transition': 'width 0.1s ease 0s' });
            function wait(sec) {
                var objDef = new $.Deferred;
                setTimeout(function () {
                    objDef.resolve(sec);
                }, sec * 1000);
                return objDef.promise();
            };
            wait(0.2).done(function () {
                $('#ajax-progress-bar').css({ 'visibility': 'hidden' });
                $('#ajax-progress-bar').css({ 'width': '0%' });
                $('#ajax-progress-bar').css({ 'transition': 'width 0.6s ease 0s' });
            });
        })
    }
    function changeContentInSearch_(url, contentsLocation, changeLocation) {
        $('#ajax_p').text('loading...')
        $('#ajax-progress-bar').css({ 'visibility': 'visible' });
        $('#ajax-progress-bar').css({ 'width': '80%' });
        $.ajax({
            url: url,
            type: "GET",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        }).done(function (data) {
            console.log('done')
            var mc = $(data).find(contentsLocation).html();
            $(changeLocation).html(mc);
            $('#ajax-progress-bar').css({ 'width': '100%' });
            $('#ajax-progress-bar').css({ 'transition': 'width 0.1s ease 0s' });
            function wait(sec) {
                var objDef = new $.Deferred;
                setTimeout(function () {
                    objDef.resolve(sec);
                }, sec * 1000);
                return objDef.promise();
            };
            wait(0.2).done(function () {
                $('#ajax-progress-bar').css({ 'visibility': 'hidden' });
                $('#ajax-progress-bar').css({ 'width': '0%' });
                $('#ajax-progress-bar').css({ 'transition': 'width 0.6s ease 0s' });
            });
            $('#ajax_p').text('done!')
        })
        
    }
    function changeContent(href) {
        $('#ajax-progress-bar').css({ 'visibility': 'visible' });
        $('#ajax-progress-bar').css({ 'width': '80%' });
        $.ajax({
            url: href,
            type: 'GET',
            dataType: 'html',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        }).done(function (data) {
            var mc = $(data).find(history.state['changeLocation']).html();
            $(history.state['changeLocation']).html(mc);
            ContentActive()
            $('#ajax-progress-bar').css({ 'width': '100%' });
            $('#ajax-progress-bar').css({ 'transition': 'width 0.1s ease 0s' });
            function wait(sec) {
                var objDef = new $.Deferred;
                setTimeout(function () {
                    objDef.resolve(sec);
                }, sec * 1000);
                return objDef.promise();
            };
            wait(0.2).done(function () {
                $('#ajax-progress-bar').css({ 'visibility': 'hidden' });
                $('#ajax-progress-bar').css({ 'width': '0%' });
                $('#ajax-progress-bar').css({ 'transition': 'width 0.6s ease 0s' });
            });
        })
    }
    function ContentActive() {
        if (location.pathname.indexOf('weather') >= 0) {
            weatherContentActive()
        }
    }
    function weatherContentActive() {
        var windowWidth = $(window).width();
        if (windowWidth < 768) {
            $('.daily-weather').css({
                'overflow-x': 'auto'
            });
            $('.hourly-weather').css({
                'overflow-x': 'auto'
            });
        }
        if (windowWidth >= 768) {
            $('.daily-weather').css({
                'overflow-x': 'hidden'
            });
            $('.hourly-weather').css({
                'overflow-x': 'hiddent'
            });
        }
    }
})