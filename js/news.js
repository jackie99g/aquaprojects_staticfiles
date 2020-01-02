$(function() {
    $('.contents_anchor').on('click', function() {
        if ('/' + location.pathname.replace(location.origin, '').split('/')[1] === '/news') {
            var targetPage = $(this).attr('href').split('/')[1]
            var currentPage = location.href.split('/')[location.href.split('/').length - 1]
            state = {
                'thisisnews': true,
                'targetPage': targetPage,
                'currentPage': currentPage,
                'changeLocation': '#category_contents'
            };
            history.pushState(state, null, targetPage);
            document.title = 'Aqua Project - ' + targetPage
            $('.contents_anchor_group a').removeClass('select_active')
            $(this).addClass('select_active')
            if ($(this).attr('id').indexOf('sm') >= 0) {
                changeContentInSearch(targetPage, '#category_contents_sm', '#category_contents_sm')
            } else {
                changeContentInSearch(targetPage, '#category_contents', '#category_contents')
            }
            return false;
        }
    })

    function changeContentInSearch(uri, contentsLocation, changeLocation) {
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
        $.ajax({
            url: uri,
            timeout: 30000,
            type: "GET",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        }).done(function(data) {
            // Save Cache.
            AquaProjectCache[uri] = data
            var mc = $(data).find(contentsLocation).html();
            $(changeLocation).html(mc);
            $('#ajax-progress-bar').css({
                'width': '100%'
            });
            $('#ajax-progress-bar').css({
                'transition': 'width 0.1s ease 0s'
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
                    'visibility': 'hidden'
                });
                $('#ajax-progress-bar').css({
                    'width': '0%'
                });
                $('#ajax-progress-bar').css({
                    'transition': 'width 0.6s ease 0s'
                });
            });
        }).fail(function() {
            $('#ajax-progress-bar').addClass('bg-danger');
            $('#ajax-progress-bar').css({
                'width': '100%'
            });
            $(changeLocation).html('<div style="word-break: break-all; margin: 8px auto auto;"><div style="margin: 0px auto; width: fit-content;"><div style="width: fit-content; margin: 0px auto;"><i class="fas fa-exclamation-circle"></i></div>Looks like you lost your connection. Please check it and try again.</div></div>')
        })
    }
})