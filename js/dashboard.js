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
        changeContent(targetPage);
        return false;
    })
    $('.contents_anchor').on('click', function () {
        var targetPage = $(this).attr('href');
        targetPage = targetPage.split('/')
        targetPage = targetPage[targetPage.length - 1]
        var currentPage = location.href;
        currentPage = currentPage.split('/')
        currentPage = currentPage[currentPage.length - 1]
        state = {
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#category_contents'
        };
        history.pushState(state, null, targetPage);
        document.title = 'Aqua Project - ' + targetPage
        changeContent(targetPage);
        return false;
    })
    $(window).on('popstate', function (e) {
        var pageState = e.originalEvent.state
        if (state) {
            var beforePage = pageState['targetPage'];
            if (pageState['targetPage'] == null) {
                document.title = 'Aqua Project'
            } else {
                document.title = 'Aqua Project - ' + pageState['targetPage']
            }
            changeContent(beforePage);
        }
    })
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
})