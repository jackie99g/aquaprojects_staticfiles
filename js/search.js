$(function() {
    $(document).on('click', '.contents_anchor', function() {
        if ('/' + location.pathname.replace(location.origin, '').split('/')[1] === '/search') {
            var targetPage = $(this).attr('href').split('/')[1]
            var currentPage = location.href.split('/')[location.href.split('/').length - 1]
            state = {
                'thisissearch': true,
                'targetPage': targetPage,
                'currentPage': currentPage,
                'changeLocation': '#category_contents'
            };
            history.pushState(state, null, targetPage);
            document.title = 'Aqua Projects - ' + targetPage
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
                    'visibility': 'hidden',
                    'width': '0%',
                    'transition': 'width 0.6s ease 0s',
                });
            });
        }).catch(err => {
            console.error(err)
            $('#ajax-progress-bar').addClass('bg-danger');
            $('#ajax-progress-bar').css({
                'width': '100%'
            });
            $(changeLocation).html('<div style="word-break: break-all; margin: 8px auto auto;"><div style="margin: 0px auto; width: fit-content;"><div style="width: fit-content; margin: 0px auto;"><i class="fas fa-exclamation-circle"></i></div>Looks like you lost your connection. Please check it and try again.</div></div>')
        })
    }
})