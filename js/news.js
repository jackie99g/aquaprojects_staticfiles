$(function () {
    $('#contents_anchor_md_business').on('click', function () {
        $('#ajax-progress-bar').css({ 'visibility': 'visible' });
        $('#ajax-progress-bar').css({ 'width': '80%' });
        var targetPage = $(this).attr('href');
        targetPage = targetPage.split('/')
        targetPage = targetPage[targetPage.length - 1]
        var currentPage = location.href;
        currentPage = currentPage.split('/')
        currentPage = currentPage[currentPage.length - 1]
        state = {
            'thisisnews': true,
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#category_contents'
        };
        history.pushState(state, null, targetPage);
        document.title = 'Aqua Project - ' + targetPage
        changeContentInSearch(targetPage, '#category_contents', '#category_contents')
        return false;
    })
    $('#contents_anchor_md_entertainment').on('click', function () {
        $('#ajax-progress-bar').css({ 'visibility': 'visible' });
        $('#ajax-progress-bar').css({ 'width': '80%' });
        var targetPage = $(this).attr('href');
        targetPage = targetPage.split('/')
        targetPage = targetPage[targetPage.length - 1]
        var currentPage = location.href;
        currentPage = currentPage.split('/')
        currentPage = currentPage[currentPage.length - 1]
        state = {
            'thisisnews': true,
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#category_contents'
        };
        history.pushState(state, null, targetPage);
        document.title = 'Aqua Project - ' + targetPage
        changeContentInSearch(targetPage, '#category_contents', '#category_contents')
        return false;
    })
    $('#contents_anchor_md_general').on('click', function () {
        $('#ajax-progress-bar').css({ 'visibility': 'visible' });
        $('#ajax-progress-bar').css({ 'width': '80%' });
        var targetPage = $(this).attr('href');
        targetPage = targetPage.split('/')
        targetPage = targetPage[targetPage.length - 1]
        var currentPage = location.href;
        currentPage = currentPage.split('/')
        currentPage = currentPage[currentPage.length - 1]
        state = {
            'thisisnews': true,
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#category_contents'
        };
        history.pushState(state, null, targetPage);
        document.title = 'Aqua Project - ' + targetPage
        changeContentInSearch(targetPage, '#category_contents', '#category_contents')
        return false;
    })
    $('#contents_anchor_md_health').on('click', function () {
        $('#ajax-progress-bar').css({ 'visibility': 'visible' });
        $('#ajax-progress-bar').css({ 'width': '80%' });
        var targetPage = $(this).attr('href');
        targetPage = targetPage.split('/')
        targetPage = targetPage[targetPage.length - 1]
        var currentPage = location.href;
        currentPage = currentPage.split('/')
        currentPage = currentPage[currentPage.length - 1]
        state = {
            'thisisnews': true,
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#category_contents'
        };
        history.pushState(state, null, targetPage);
        document.title = 'Aqua Project - ' + targetPage
        changeContentInSearch(targetPage, '#category_contents', '#category_contents')
        return false;
    })
    $('#contents_anchor_md_science').on('click', function () {
        $('#ajax-progress-bar').css({ 'visibility': 'visible' });
        $('#ajax-progress-bar').css({ 'width': '80%' });
        var targetPage = $(this).attr('href');
        targetPage = targetPage.split('/')
        targetPage = targetPage[targetPage.length - 1]
        var currentPage = location.href;
        currentPage = currentPage.split('/')
        currentPage = currentPage[currentPage.length - 1]
        state = {
            'thisisnews': true,
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#category_contents'
        };
        history.pushState(state, null, targetPage);
        document.title = 'Aqua Project - ' + targetPage
        changeContentInSearch(targetPage, '#category_contents', '#category_contents')
        return false;
    })
    $('#contents_anchor_md_sports').on('click', function () {
        $('#ajax-progress-bar').css({ 'visibility': 'visible' });
        $('#ajax-progress-bar').css({ 'width': '80%' });
        var targetPage = $(this).attr('href');
        targetPage = targetPage.split('/')
        targetPage = targetPage[targetPage.length - 1]
        var currentPage = location.href;
        currentPage = currentPage.split('/')
        currentPage = currentPage[currentPage.length - 1]
        state = {
            'thisisnews': true,
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#category_contents'
        };
        history.pushState(state, null, targetPage);
        document.title = 'Aqua Project - ' + targetPage
        changeContentInSearch(targetPage, '#category_contents', '#category_contents')
        return false;
    })
    $('#contents_anchor_md_technology').on('click', function () {
        $('#ajax-progress-bar').css({ 'visibility': 'visible' });
        $('#ajax-progress-bar').css({ 'width': '80%' });
        var targetPage = $(this).attr('href');
        targetPage = targetPage.split('/')
        targetPage = targetPage[targetPage.length - 1]
        var currentPage = location.href;
        currentPage = currentPage.split('/')
        currentPage = currentPage[currentPage.length - 1]
        state = {
            'thisisnews': true,
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#category_contents'
        };
        history.pushState(state, null, targetPage);
        document.title = 'Aqua Project - ' + targetPage
        changeContentInSearch(targetPage, '#category_contents', '#category_contents')
        return false;
    })
    $('#contents_anchor_sm_business').on('click', function () {
        $('#ajax-progress-bar').css({ 'visibility': 'visible' });
        $('#ajax-progress-bar').css({ 'width': '80%' });
        var targetPage = $(this).attr('href');
        targetPage = targetPage.split('/')
        targetPage = targetPage[targetPage.length - 1]
        var currentPage = location.href;
        currentPage = currentPage.split('/')
        currentPage = currentPage[currentPage.length - 1]
        state = {
            'thisisnews': true,
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#category_contents'
        };
        history.pushState(state, null, targetPage);
        document.title = 'Aqua Project - ' + targetPage
        changeContentInSearch(targetPage, '#category_contents', '#category_contents')
        return false;
    })
    $('#contents_anchor_sm_entertainment').on('click', function () {
        $('#ajax-progress-bar').css({ 'visibility': 'visible' });
        $('#ajax-progress-bar').css({ 'width': '80%' });
        var targetPage = $(this).attr('href');
        targetPage = targetPage.split('/')
        targetPage = targetPage[targetPage.length - 1]
        var currentPage = location.href;
        currentPage = currentPage.split('/')
        currentPage = currentPage[currentPage.length - 1]
        state = {
            'thisisnews': true,
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#category_contents'
        };
        history.pushState(state, null, targetPage);
        document.title = 'Aqua Project - ' + targetPage
        changeContentInSearch(targetPage, '#category_contents', '#category_contents')
        return false;
    })
    $('#contents_anchor_sm_general').on('click', function () {
        $('#ajax-progress-bar').css({ 'visibility': 'visible' });
        $('#ajax-progress-bar').css({ 'width': '80%' });
        var targetPage = $(this).attr('href');
        targetPage = targetPage.split('/')
        targetPage = targetPage[targetPage.length - 1]
        var currentPage = location.href;
        currentPage = currentPage.split('/')
        currentPage = currentPage[currentPage.length - 1]
        state = {
            'thisisnews': true,
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#category_contents'
        };
        history.pushState(state, null, targetPage);
        document.title = 'Aqua Project - ' + targetPage
        changeContentInSearch(targetPage, '#category_contents', '#category_contents')
        return false;
    })
    $('#contents_anchor_sm_health').on('click', function () {
        $('#ajax-progress-bar').css({ 'visibility': 'visible' });
        $('#ajax-progress-bar').css({ 'width': '80%' });
        var targetPage = $(this).attr('href');
        targetPage = targetPage.split('/')
        targetPage = targetPage[targetPage.length - 1]
        var currentPage = location.href;
        currentPage = currentPage.split('/')
        currentPage = currentPage[currentPage.length - 1]
        state = {
            'thisisnews': true,
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#category_contents'
        };
        history.pushState(state, null, targetPage);
        document.title = 'Aqua Project - ' + targetPage
        changeContentInSearch(targetPage, '#category_contents', '#category_contents')
        return false;
    })
    $('#contents_anchor_sm_science').on('click', function () {
        $('#ajax-progress-bar').css({ 'visibility': 'visible' });
        $('#ajax-progress-bar').css({ 'width': '80%' });
        var targetPage = $(this).attr('href');
        targetPage = targetPage.split('/')
        targetPage = targetPage[targetPage.length - 1]
        var currentPage = location.href;
        currentPage = currentPage.split('/')
        currentPage = currentPage[currentPage.length - 1]
        state = {
            'thisisnews': true,
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#category_contents'
        };
        history.pushState(state, null, targetPage);
        document.title = 'Aqua Project - ' + targetPage
        changeContentInSearch(targetPage, '#category_contents', '#category_contents')
        return false;
    })
    $('#contents_anchor_sm_sports').on('click', function () {
        $('#ajax-progress-bar').css({ 'visibility': 'visible' });
        $('#ajax-progress-bar').css({ 'width': '80%' });
        var targetPage = $(this).attr('href');
        targetPage = targetPage.split('/')
        targetPage = targetPage[targetPage.length - 1]
        var currentPage = location.href;
        currentPage = currentPage.split('/')
        currentPage = currentPage[currentPage.length - 1]
        state = {
            'thisisnews': true,
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': '#category_contents'
        };
        history.pushState(state, null, targetPage);
        document.title = 'Aqua Project - ' + targetPage
        changeContentInSearch(targetPage, '#category_contents', '#category_contents')
        return false;
    })
    $('#contents_anchor_sm_technology').on('click', function () {
        $('#ajax-progress-bar').css({ 'visibility': 'visible' });
        $('#ajax-progress-bar').css({ 'width': '80%' });
        var targetPage = $(this).attr('href');
        targetPage = targetPage.split('/')
        targetPage = targetPage[targetPage.length - 1]
        var currentPage = location.href;
        currentPage = currentPage.split('/')
        currentPage = currentPage[currentPage.length - 1]
        state = {
            'thisisnews': true,
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
})