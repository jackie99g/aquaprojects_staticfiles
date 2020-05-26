$(function() {
    $(window).on('aquaproject_popstate', function() {
        if ('/' + location.pathname.replace(location.origin, '').split('/')[1] === '/settings') {
            $('.twitter-slider-item').each(function(index, element) {
                var persentage = 50
                if (localStorage.getItem('font-size')) {
                    persentage = localStorage.getItem('font-size')
                }
                $('.display-font_size-show').text(persentage + '%')
                $('.twitter-slider-line-fill').css({
                    'width': persentage + '%'
                })
                var elementPersentage = parseInt($(element).data('value'))
                if (elementPersentage <= persentage) {
                    $(element).css({
                        'background': '#1DA1F2'
                    })
                } else {
                    $(element).css({
                        'background': '#8ED0F9'
                    })
                }
            })
            changeFontSize()
        }
    })
    if ('/' + location.pathname.replace(location.origin, '').split('/')[1] === '/settings') {
        window.dispatchEvent(new Event('aquaproject_popstate'));
    }

    $(document).on('click', '.twitter-slider-item', function() {
        var persentage = parseInt($(this).data('value'))
        localStorage.setItem('font-size', persentage)
        changeFontSize()
        $('.display-font_size-show').text(persentage + '%')
        $('.twitter-slider-line-fill').css({
            'width': persentage + '%'
        })
        $('.twitter-slider-item').each(function(index, element) {
            var elementPersentage = parseInt($(element).data('value'))
            if (elementPersentage <= persentage) {
                $(element).css({
                    'background': '#1DA1F2'
                })
            } else {
                $(element).css({
                    'background': '#8ED0F9'
                })
            }
        })

        var currentDate = new Date()
        currentDate.setFullYear(currentDate.getFullYear() + 1)
        var expires = currentDate.toUTCString()
        document.cookie = `ap_font_size=${persentage}; path=/twitter; expires=${expires}`
    })

    function changeFontSize() {
        if (localStorage.getItem('font-size')) {
            var _font_size = parseInt(localStorage.getItem('font-size'))
            var font_size, small_font_size, large_font_size = ''
            var twitter_image_size = ''
            if (_font_size == 0) {
                font_size = 'x-small'
                small_font_size = 'xx-small'
                large_font_size = 'small'
                twitter_image_size = '145'
            } else if (_font_size == 25) {
                font_size = 'small'
                small_font_size = 'x-small'
                large_font_size = 'medium'
                twitter_image_size = '215'
            } else if (_font_size == 50) {
                font_size = 'medium'
                small_font_size = 'small'
                large_font_size = 'large'
                twitter_image_size = '285'
            } else if (_font_size == 75) {
                font_size = 'large'
                small_font_size = 'medium'
                large_font_size = 'x-large'
                twitter_image_size = '335'
            } else if (_font_size == 100) {
                font_size = 'x-large'
                small_font_size = 'large'
                large_font_size = 'xx-large'
                twitter_image_size = '435'
            } else {
                font_size = 'medium'
                small_font_size = 'small'
                large_font_size = 'large'
                twitter_image_size = '285'
            }
            $('.font-size').css({
                'font-size': font_size
            })
            $('.small-font-size').css({
                'font-size': small_font_size
            })
            $('.large-font-size').css({
                'font-size': large_font_size
            })
            localStorage.setItem('twitter-image_size', twitter_image_size)
        }else {
            localStorage.setItem('twitter-image_size', '285')
        }
    }
})