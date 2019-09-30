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
        $('.dashboard_anchor_' + location.pathname.split('/')[1]).addClass('select_active_dashboard')
        // Conditional branch for load reduction. 
        if (location.search.indexOf('') == 0) {
            $('.contents_anchor_' + location.search.split('=')[1]).addClass('select_active')
            
            //  The following code will be deprecated in the future.
            if(location.search.indexOf('Google') >= 0){
                $('#contents_anchor_google').addClass('select_active')
            }
            if(location.search.indexOf('%E3%81%94%E6%B3%A8%E6%96%87%E3%81%AF%E3%81%86%E3%81%95%E3%81%8E%E3%81%A7%E3%81%99%E3%81%8B?') >= 0){
                $('#contents_anchor_gochiusa').addClass('select_active')
            }
        }
        // Because it is selected by default.
        if (location.pathname  + location.search == '/news') {
            if (location.search.indexOf('') == 0) {
                $('.contents_anchor_general').addClass('select_active')
            }
        }
        if (location.pathname  + location.search == '/search') {
            if (location.search.indexOf('') == 0) {
                $('#contents_anchor_gochiusa').addClass('select_active')                
            }
        }
        document.title = 'Aqua Project - ' + currentPage;
        AquaProjectCache[location.href.split('/')[location.href.split('/').length - 1]] = document.documentElement.innerHTML
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
        if (currentPage.indexOf('news') >= 0 && targetPage.indexOf('news') < 0 || currentPage.indexOf('search') >= 0 && targetPage.indexOf('search') < 0) {
            replaceStateData ={
                'currentPage':history.state['currentPage'],
                'targetPage': history.state['targetPage'],
                'changeLocation': history.state['changeLocation'],
                'drawLocationChanged': true,
                'thisisnews': history.state['thisisnews']
            }
            history.replaceState(replaceStateData, null, history['targetPage'])
        }
        history.pushState(state, null, targetPage);
        document.title = 'Aqua Project - ' + targetPage
        $('.dashboard_anchor').removeClass('select_active_dashboard')
        $(this).addClass('select_active_dashboard')
        changeContent(targetPage);
        return false;
    })
    $(window).on('popstate', function (e) {
        // When we access the page at the first time, we don't do nothing.
        if (!e.originalEvent.state) return false;
        // search
        if (e.originalEvent.state['thisissearch'] == true) {
            if (e.originalEvent.state['drawLocationChanged'] == true) {
                e.originalEvent.state['changeLocation'] = '#category_contents'
                $('.dashboard_anchor_group a').removeClass('select_active_dashboard')
                $('.dashboard_anchor_' + location.pathname.split('/')[1]).addClass('select_active_dashboard')
                changeContent(e.originalEvent.state['targetPage'], function() {
                    if (location.search.indexOf('Google') >= 0) { $('#contents_anchor_google').addClass('select_active') }
                    if (location.search.indexOf('%E3%81%94%E6%B3%A8%E6%96%87%E3%81%AF%E3%81%86%E3%81%95%E3%81%8E%E3%81%A7%E3%81%99%E3%81%8B?') >= 0) { $('#contents_anchor_gochiusa').addClass('select_active') }
                    $('.contents_anchor_group a').removeClass('select_active')
                })
                return false;
            } else {
                if (location.search.indexOf('Google') >= 0) { $('#contents_anchor_google').addClass('select_active') }
                if (location.search.indexOf('%E3%81%94%E6%B3%A8%E6%96%87%E3%81%AF%E3%81%86%E3%81%95%E3%81%8E%E3%81%A7%E3%81%99%E3%81%8B?') >= 0) { $('#contents_anchor_gochiusa').addClass('select_active') }
                $('.contents_anchor_group a').removeClass('select_active')
                if (location.pathname + location.search == '/search') {
                    if (location.search.indexOf('') == 0) {
                        $('#contents_anchor_gochiusa').addClass('select_active')
                    }
                }
                e.originalEvent.state['changeLocation'] = '#category_contents'
                changeContent(e.originalEvent.state['targetPage'])
                return false;
            }
        }
        // news
        if (e.originalEvent.state['thisisnews'] == true) {
            if (e.originalEvent.state['drawLocationChanged'] == true) {
                e.originalEvent.state['changeLocation'] = '#category_contents'
                $('.dashboard_anchor_group a').removeClass('select_active_dashboard')
                $('.dashboard_anchor_' + location.pathname.split('/')[1]).addClass('select_active_dashboard')
                changeContent(e.originalEvent.state['targetPage'], function () {
                    $('.contents_anchor_group a').removeClass('select_active')
                    $('.contents_anchor_' + location.search.split('=')[1]).addClass('select_active')
                })
                return false;
            } else {
                $('.contents_anchor_group a').removeClass('select_active')
                $('.contents_anchor_' + location.search.split('=')[1]).addClass('select_active')
                if (location.pathname + location.search == '/news') {
                    if (location.search.indexOf('') == 0) {
                        $('.contents_anchor_general').addClass('select_active')
                    }
                }
                e.originalEvent.state['changeLocation'] = '#category_contents'
                changeContent(e.originalEvent.state['targetPage'])
                return false;
            }
        }
        // dashboard anchor settings.
        $('.dashboard_anchor_group a').removeClass('select_active_dashboard')
        $('.dashboard_anchor_' + location.pathname.split('/')[1]).addClass('select_active_dashboard')
        changeContent(e.originalEvent.state['targetPage']);
        document.title = 'Aqua Project - ' + e.originalEvent.state['targetPage']
        return false;
    })
    function changeContent(href, doneFunc) {
        if (history.state['drawLocationChanged'] == true) {
            $('#main').html('<div class="loader" style="font-size: 2px; margin: 8px auto auto;"></div>');
        } else {
            $(history.state['changeLocation']).html('<div class="loader" style="font-size: 2px; margin: 8px auto auto;"></div>');
        }
        $('#ajax-progress-bar').removeClass('bg-danger');
        $('#ajax-progress-bar').css({ 'visibility': 'visible' });
        $('#ajax-progress-bar').css({ 'width': '80%' });
        // Cache exsists.
        if (AquaProjectCache[href]) {
            if (history.state['drawLocationChanged'] == true) {
                $('#main').html($(AquaProjectCache[href]).find('#main').html());
            } else {
                $(history.state['changeLocation']).html($(AquaProjectCache[href]).find(history.state['changeLocation']).html());
            }
            // Weather controller
            ContentActive()
            // After data added, to do this method.
            if (doneFunc != undefined) { doneFunc() }
            $('#ajax-progress-bar').css({ 'width': '100%' });
        }
        $.ajax({
            url: href,
            timeout: 60000,
            type: 'GET',
            dataType: 'html',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        }).done(function (data) {
            // Save Cache.
            AquaProjectCache[href] = data
            if (history.state['drawLocationChanged'] == true) {
                $('#main').html($(data).find('#main').html());
            } else {
                $(history.state['changeLocation']).html($(data).find(history.state['changeLocation']).html());
            }
            // Weather controller
            ContentActive()
            // After data added, to do this method.
            if (doneFunc != undefined) { doneFunc() }
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
        }).fail(function(data) {
            $('#ajax-progress-bar').addClass('bg-danger');
            $('#ajax-progress-bar').css({ 'width': '100%' });
            $(history.state['changeLocation']).html('<div style="word-break: break-all; margin: 8px auto auto;"><div style="margin: 0px auto; width: fit-content;"><div style="width: fit-content; margin: 0px auto;"><i class="fas fa-exclamation-circle"></i></div>Looks like you lost your connection. Please check it and try again.</div></div>')
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