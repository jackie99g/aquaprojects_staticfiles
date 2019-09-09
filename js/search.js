$(function () {
    $('#contents_anchor_google').on('click', function () {
        $('#ajax_p').text('loading...')
        $('#ajax-progress-bar').css({ 'visibility': 'visible' });
        $('#ajax-progress-bar').css({ 'width': '80%' });
        var targetPage = $(this).attr('href');
        targetPage = targetPage.split('/')
        targetPage = targetPage[targetPage.length - 1]
        var currentPage = location.href;
        currentPage = currentPage.split('/')
        currentPage = currentPage[currentPage.length - 1]
        state = {
            'thisissearch': true,
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#category_contents'
        };
        history.pushState(state, null, targetPage);
        document.title = 'Aqua Project - ' + targetPage
        changeContentInSearch(targetPage, '#category_contents', '#category_contents')
        return false;
    })
    $('#contents_anchor_gochiusa').on('click', function () {
        $('#ajax_p').text('loading...')
        $('#ajax-progress-bar').css({ 'visibility': 'visible' });
        $('#ajax-progress-bar').css({ 'width': '80%' });
        var targetPage = $(this).attr('href');
        targetPage = targetPage.split('/')
        targetPage = targetPage[targetPage.length - 1]
        var currentPage = location.href;
        currentPage = currentPage.split('/')
        currentPage = currentPage[currentPage.length - 1]
        state = {
            'thisissearch': true,
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#category_contents'
        };
        history.pushState(state, null, targetPage);
        document.title = 'Aqua Project - ' + targetPage
        changeContentInSearch(targetPage, '#category_contents', '#category_contents')
        return false;
    })
    function changeContentInSearch(url, contentsLocation, changeLocation) {
        $('#ajax_p').text('loading...')
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
})