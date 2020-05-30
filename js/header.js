$(function() {
    var win = $(window),
        header = $('.header_contents'),
        hedaerHeight = header.outerHeight() + 10,
        progress = $('.progress'),
        startPos = 0;

    win.on('scroll', function() {
        var value = $(this).scrollTop();
        if (value > startPos && value > hedaerHeight) {
            header.css('top', '-' + hedaerHeight + 'px');
            progress.css('visibility', 'hidden');
        } else {
            header.css('top', '0');
            progress.css('hidden', '');
        }
        startPos = value;
    })

    $('input[name="check"]').change(function() {
        var prop = $('.load_pictures').prop('checked');
        if (prop) {
            twitterViewPictures()
        } else {
            twitterHiddenPictures()
        }
    });

    function twitterViewPictures() {
        localStorage.setItem('twitter-view_pictures', true)
        var tweetTwitterPicture = document.querySelectorAll('.tweet-twitter_picture')
        for (let index = 0; index < tweetTwitterPicture.length; index++) {
            tweetTwitterPicture[index].src = tweetTwitterPicture[index].dataset.src
        }
    }

    function twitterHiddenPictures() {
        localStorage.removeItem('twitter-view_pictures')
        var tweetTwitterPicture = document.querySelectorAll('.tweet-twitter_picture')
        for (let index = 0; index < tweetTwitterPicture.length; index++) {
            tweetTwitterPicture[index].src = 'https://jackie99g.github.io/aquaprojects_staticfiles/images/icon.svg'
        }
    }

    $('input[name="check"]').change(function() {
        var prop = $('.load_clear_icon').prop('checked');
        if (prop) {
            twitterViewClearIcon()
        } else {
            twitterHideClearIcon()
        }
    });

    function twitterViewClearIcon() {
        localStorage.setItem('twitter-view_clear_icon', true)
        var tweetTwitterIconImg = document.querySelectorAll('.tweet-twitter_icon img')
        for (let index = 0; index < tweetTwitterIconImg.length; index++) {
            const element = tweetTwitterIconImg[index];
            var imgSrc = element.src
            element.src = imgSrc.replace('_normal', '_400x400')
        }
        var twitterUserTwitterIconImg = document.querySelector('.twitter_user-twitter_icon img')
        if (!twitterUserTwitterIconImg) {
            return false
        }
        var iconImgSrc = twitterUserTwitterIconImg.src
        twitterUserTwitterIconImg.src = iconImgSrc.replace('_normal', '_400x400')
    }

    function twitterHideClearIcon() {
        localStorage.removeItem('twitter-view_clear_icon')
        var tweetTwitterIconImg = document.querySelectorAll('.tweet-twitter_icon img')
        for (let index = 0; index < tweetTwitterIconImg.length; index++) {
            const element = tweetTwitterIconImg[index];
            var imgSrc = element.src
            element.src = imgSrc.replace('_400x400', '_normal')
        }
        var twitterUserTwitterIconImg = document.querySelector('.twitter_user-twitter_icon img')
        if (!twitterUserTwitterIconImg) {
            return false
        }
        var iconImgSrc = twitterUserTwitterIconImg.src
        twitterUserTwitterIconImg.src = iconImgSrc.replace('_400x400', '_normal')
    }

    $(document).on('click', '.header-summarize_button', function() {
        headerSummaryButton()
    })

    $('input[name="check"]').change(function() {
        var prop = $('.show_left_sidebar').prop('checked');
        if (prop) {
            showLeftSidebar()
        } else {
            hideLeftSidebar()
        }
    });

    function showLeftSidebar() {
        localStorage.setItem('show_left_sidebar', true)
        var custom_side_pannel_lg = $('.custom_side_pannel_lg').parent()
        custom_side_pannel_lg.removeClass('col-md-1')
        custom_side_pannel_lg.addClass('col-md-2')
        custom_side_pannel_lg.css({
            'visibility': 'visible'
        })

        var custom_side_pannel_md = $('.custom_side_pannel_md').parent()
        custom_side_pannel_md.removeClass('col-md-1')
        custom_side_pannel_md.addClass('col-md-2')
        custom_side_pannel_md.css({
            'visibility': 'visible'
        })

    }

    function hideLeftSidebar() {
        localStorage.removeItem('show_left_sidebar')
        var custom_side_pannel_lg = $('.custom_side_pannel_lg').parent()
        custom_side_pannel_lg.removeClass('col-md-2')
        custom_side_pannel_lg.addClass('col-md-1')
        custom_side_pannel_lg.css({
            'visibility': 'hidden'
        })

        var custom_side_pannel_md = $('.custom_side_pannel_md').parent()
        custom_side_pannel_md.removeClass('col-md-2')
        custom_side_pannel_md.addClass('col-md-1')
        custom_side_pannel_md.css({
            'visibility': 'hidden'
        })
    }

    function headerSummaryButton() {
        var custom_side_pannel_lg = $('.custom_side_pannel_lg').parent()
        custom_side_pannel_lg.toggleClass('col-md-1')
        custom_side_pannel_lg.toggleClass('col-md-2')
        if (custom_side_pannel_lg.css('visibility') === 'visible') {
            custom_side_pannel_lg.css({
                'visibility': 'hidden'
            })
            localStorage.removeItem('show_left_sidebar')
        } else {
            custom_side_pannel_lg.css({
                'visibility': 'visible'
            })
            localStorage.setItem('show_left_sidebar', true)
        }

        var custom_side_pannel_md = $('.custom_side_pannel_md').parent()
        custom_side_pannel_md.toggleClass('col-md-1')
        custom_side_pannel_md.toggleClass('col-md-2')
        if (custom_side_pannel_md.css('visibility') === 'visible') {
            custom_side_pannel_md.css({
                'visibility': 'hidden'
            })
            localStorage.removeItem('show_left_sidebar')
        } else {
            custom_side_pannel_md.css({
                'visibility': 'visible'
            })
            localStorage.setItem('show_left_sidebar', true)
        }
    }
})