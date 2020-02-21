$(function() {
    var touchingPositionPageX = 0
    var touchStartScrollLeft = 0

    var clickingNow = false
    var clickingPositionOffsetX = 0
    var clickingPositionPageX = 0
    var currentSlideNumber = 0

    $(window).on('aquaproject_popstate', function() {
        if ('/' + location.pathname.replace(location.origin, '').split('/')[1] === '/newsplus') {
            var _currentSlideNumber = searchCurrentSlideNumber()
            jumpToSlide(_currentSlideNumber, 0)
            activateNewsplusAnchor()
            scrollNewsplusAnchorLeft(_currentSlideNumber)
        }
    })
    if ('/' + location.pathname.replace(location.origin, '').split('/')[1] === '/newsplus') {
        window.dispatchEvent(new Event('aquaproject_popstate'));
    }

    $(window).resize(() => {
        if ('/' + location.pathname.replace(location.origin, '').split('/')[1] === '/newsplus') {
            var _currentSlideNumber = searchCurrentSlideNumber()
            jumpToSlide(_currentSlideNumber, 0)
            scrollNewsplusAnchorLeft(_currentSlideNumber)
        }
    })

    $(document).on('click', '.box_anchor', boxAnchor)

    function boxAnchor(e) {
        var clickSlideNumber = $(`.${e.target.className}`).index(e.target)
        jumpToSlide(clickSlideNumber, 200)
        scrollNewsplusAnchorLeft(clickSlideNumber)

        var targetPage = e.target.href.replace(location.origin, '')
        var currentPage = location.href.replace(location.origin, '')
        easyPushState(targetPage, currentPage)
        changeContent(targetPage)
        return false
    }

    function easyPushState(targetPage, currentPage, changeLocation = "#main") {
        var state = {
            'targetPage': targetPage,
            'currentPage': currentPage,
            'changeLocation': changeLocation
        }
        history.pushState(state, null, targetPage)
        document.title = 'Aqua Project - ' + targetPage
        AquaProjectCache[location.href.replace(location.origin, '')] = $('html').html()
    }

    function assistEasyPushState(assistSlideNumber) {
        var targetPageAnchor = document.getElementsByClassName('box_anchor_container')[0].getElementsByClassName('box_anchor')[assistSlideNumber]
        var targetPage = targetPageAnchor.href.replace(location.origin, '')
        var currentPage = location.href.replace(location.origin, '')
        easyPushState(targetPage, currentPage)
        return targetPage
    }

    function changeContent(href) {
        activateNewsplusAnchor()
        fetch(
            href, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include'
            }
        ).then(response => {
            if (response.ok) {
                return response.text()
            } else {
                console.error(response)
            }
        }).then(data => {
            AquaProjectCache[href] = data
            if (href != location.href.replace(location.origin, '')) {
                console.log('It seems that you moved to a different page first.')
                return false
            }
            $('#main').html($(data).find('#main').html());
            window.dispatchEvent(new Event('aquaproject_popstate'));
        }).catch(err => {
            console.error(err)
        })
    }

    function searchCurrentSlideNumber() {
        var currentSlideNumber = 0
        var currentPage = location.href.replace(location.origin, '')
        var boxAnchorContainer = document.getElementsByClassName('box_anchor_container')[0].getElementsByClassName('box_anchor')
        for (let index = 0; index < boxAnchorContainer.length; index++) {
            if (currentPage === boxAnchorContainer[index].href.replace(location.origin, '')) {
                currentSlideNumber = index
            }
        }
        return currentSlideNumber
    }

    function activateNewsplusAnchor() {
        var currentSlideAnchorStore = document.getElementsByClassName('box_anchor_container')[0].getElementsByClassName('box_anchor')
        for (let index = 0; index < currentSlideAnchorStore.length; index++) {
            currentSlideAnchorStore[index].style.background = ''
            currentSlideAnchorStore[index].style.borderBottom = ''
            currentSlideAnchorStore[index].style.color = ''

        }
        currentSlideAnchorStore[currentSlideNumber].style.background = '#e8f5fe'
        currentSlideAnchorStore[currentSlideNumber].style.borderBottom = '1px solid #1da1f2'
        currentSlideAnchorStore[currentSlideNumber].style.color = '#1da1f2'
    }

    function scrollNewsplusAnchorLeft(newsplusAnchorSlideNumber) {
        var boxAnchorWidth = document.querySelector('.box_anchor').offsetWidth
        document.querySelector('.box_anchor_container').scrollLeft = (newsplusAnchorSlideNumber - 1) * boxAnchorWidth
    }

    $(document).on('touchstart', '.box_container', boxContainerTouchStart)
    $(document).on('touchmove', '.box_container', boxContainerTouchMove)
    $(document).on('touchend', '.box_container', boxContainerTouchEnd)
    // $(document).on('mousedown', '.box_container', boxContainerMouseDown)
    // $(document).on('mousemove', '.box_container', boxContainerMouseMove)
    // $(document).on('mouseup', '.box_container', boxContainerMouseUp)
    // $(document).on('mouseleave', '.box_container', boxContainerMouseLeave)
    // $(document).on('click', '.prevSlideBtn', prevSlideBtn)
    // $(document).on('click', '.nextSlideBtn', nextSlideBtn)

    function boxContainerTouchStart(e) {
        touchingPositionPageX = e.changedTouches[0].pageX
        touchStartScrollLeft = this.scrollLeft
    }

    function boxContainerTouchMove(e) {
        this.scrollLeft = touchStartScrollLeft + touchingPositionPageX - e.changedTouches[0].pageX
    }

    function boxContainerTouchEnd(e) {
        if (touchingPositionPageX - e.changedTouches[0].pageX > this.offsetWidth / 4) {
            scrollContentLeft(
                this,
                ($('.box_element').index(e.target.closest('.box_element')) + 1) * e.target.closest('.box_element').offsetWidth - this.scrollLeft, 200
            )
            currentSlideNumber += 1
            var href = assistEasyPushState(currentSlideNumber)
            changeContent(href)
        } else if (touchingPositionPageX - e.changedTouches[0].pageX < -(this.offsetWidth / 4)) {
            scrollContentLeft(
                this,
                ($('.box_element').index(e.target.closest('.box_element')) - 1) * e.target.closest('.box_element').offsetWidth - this.scrollLeft,
                200
            )
            currentSlideNumber -= 1
            var href = assistEasyPushState(currentSlideNumber)
            changeContent(href)
        } else {
            scrollContentLeft(
                this,
                $('.box_element').index(e.target.closest('.box_element')) * e.target.closest('.box_element').offsetWidth - this.scrollLeft,
                200
            )
        }
        touchingPositionPageX = 0
        touchStartScrollLeft = 0
    }

    function boxContainerMouseDown(e) {
        clickingNow = true
        clickingPositionOffsetX = e.offsetX
        clickingPositionPageX = e.pageX
    }

    function boxContainerMouseMove(e) {
        if (clickingNow) {
            this.scrollLeft = this.scrollLeft + clickingPositionOffsetX - e.offsetX
        }
    }

    function boxContainerMouseUp(e) {
        if (clickingPositionPageX - e.pageX > this.offsetWidth / 4) {
            scrollContentLeft(
                this,
                ($('.box_element').index(e.target.closest('.box_element')) + 1) * e.target.closest('.box_element').offsetWidth - this.scrollLeft, 200
            )
            currentSlideNumber += 1
            var href = assistEasyPushState(currentSlideNumber)
            changeContent(href)
        } else if (clickingPositionPageX - e.pageX < -(this.offsetWidth / 4)) {
            scrollContentLeft(
                this,
                ($('.box_element').index(e.target.closest('.box_element')) - 1) * e.target.closest('.box_element').offsetWidth - this.scrollLeft, 200
            )
            currentSlideNumber -= 1
            var href = assistEasyPushState(currentSlideNumber)
            changeContent(href)
        } else {
            scrollContentLeft(
                this,
                $('.box_element').index(e.target.closest('.box_element')) * e.target.closest('.box_element').offsetWidth - this.scrollLeft, 200
            )
        }
        clickingNow = false
    }

    function boxContainerMouseLeave(e) {
        if (!clickingNow) return false
        if (clickingPositionPageX - e.pageX > this.offsetWidth / 4) {
            scrollContentLeft(
                this,
                ($('.box_element').index(e.target.closest('.box_element')) + 1) * e.target.closest('.box_element').offsetWidth - this.scrollLeft, 200
            )
            currentSlideNumber += 1
            var href = assistEasyPushState(currentSlideNumber)
            changeContent(href)
        } else if (clickingPositionPageX - e.pageX < -(this.offsetWidth / 4)) {
            scrollContentLeft(
                this,
                ($('.box_element').index(e.target.closest('.box_element')) - 1) * e.target.closest('.box_element').offsetWidth - this.scrollLeft, 200
            )
            currentSlideNumber -= 1
            var href = assistEasyPushState(currentSlideNumber)
            changeContent(href)
        } else {
            scrollContentLeft(
                this,
                $('.box_element').index(e.target.closest('.box_element')) * e.target.closest('.box_element').offsetWidth - this.scrollLeft, 200
            )
        }
        clickingNow = false
    }

    function scrollContentLeft(n, t, i) {
        var r = new Date,
            u = n.scrollLeft,
            f = setInterval(() => {
                var e = new Date - r;
                e > i && (clearInterval(f), e = i);
                n.scrollLeft = u + t * (e / i)
            }, 10)
    }

    function changeContentLeft(n, t) {
        var u = n.scrollLeft
        n.scrollLeft = u + t
    }

    function prevSlideBtn() {
        scrollContentLeft(
            document.getElementsByClassName('box_container')[0],
            (currentSlideNumber - 1) * document.getElementsByClassName('box_element')[0].offsetWidth - document.getElementsByClassName('box_container')[0].scrollLeft,
            200
        )
        if (currentSlideNumber > 0) {
            currentSlideNumber -= 1
            var href = assistEasyPushState(currentSlideNumber)
            changeContent(href)
        }
    }

    function nextSlideBtn() {
        scrollContentLeft(
            document.getElementsByClassName('box_container')[0],
            (currentSlideNumber + 1) * document.getElementsByClassName('box_element')[0].offsetWidth - document.getElementsByClassName('box_container')[0].scrollLeft,
            200
        )
        if (currentSlideNumber < document.getElementsByClassName('box_element').length - 1) {
            currentSlideNumber += 1
            var href = assistEasyPushState(currentSlideNumber)
            changeContent(href)
        }
    }

    function jumpToSlide(jumpToSlideNumber, duration = 200) {
        if (duration < 100) {
            changeContentLeft(
                document.getElementsByClassName('box_container')[0],
                (jumpToSlideNumber) * document.getElementsByClassName('box_element')[0].offsetWidth - document.getElementsByClassName('box_container')[0].scrollLeft,
            )
        } else {
            scrollContentLeft(
                document.getElementsByClassName('box_container')[0],
                (jumpToSlideNumber) * document.getElementsByClassName('box_element')[0].offsetWidth - document.getElementsByClassName('box_container')[0].scrollLeft,
                duration
            )
        }
        currentSlideNumber = jumpToSlideNumber
    }
});