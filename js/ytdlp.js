import * as utils from './utils.js'
import { changeTheme, error, findParents, getCookie } from './utils.js'

!(() => {
    window.addEventListener('aquaprojects_popstate', () => {
        if (utils.locationMatch('/newsplus')) {
            changeTheme()
        }
    })
    if (utils.locationMatch('/ytdlp')) {
        window.dispatchEvent(new Event('aquaprojects_popstate'))
    }
    const getYtId = () => {
        const ytdlprequestinput = document.querySelector('.ytdlprequestinput')
        return ytdlprequestinput.value
    }
    const onclick = async () => {
        const ytdlprequeststatus = document.querySelector('.ytdlprequeststatus')
        ytdlprequeststatus.innerHTML = 'Status: The request is ongoing.'
        const href = `/ytdlp/${getYtId()}`
        const fetching = fetch(href, {
            method: 'post',
            credentials: 'include',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })
        const response = await fetching
        if (response.ok === false) {
            error(response)
            ytdlprequeststatus.innerHTML = 'Status: The request has failed.'
            return
        }
        const data = await response.text()
        console.log('POST', href, data)
        ytdlprequeststatus.innerHTML = 'Status: The request has completed.'
    }
    const onclickdownload = async () => {
        const ytdlpplaystatus = document.querySelector('.ytdlpdownloadstatus')
        const href = `/ytdlp/${getYtId()}`
        const fetching = fetch(href, {
            method: 'get',
            credentials: 'include',
        })
        ytdlpplaystatus.innerHTML = 'The request video is downloading.'
        const response = await fetching
        if (response.ok === false) {
            error(response)
            ytdlpplaystatus.innerHTML = 'The request video was not downloaded.'
            return
        }
        await response.blob()
        ytdlpplaystatus.innerHTML = 'The request video was downloaded.'
        const ytdlpvideo = document.querySelector('.ytdlpvideo')
        ytdlpvideo.src = `/ytdlp/${getYtId()}`
    }
    const onclickcache = async () => {
        const cacheName = 'static-cache-v1'
        const cache = await caches.open(cacheName)
        const href = `/ytdlp/${getYtId()}`
        const requests = await cache.keys()
        if (getYtId() === '') {
            const responses = await cache.matchAll()
            const urls = await Promise.all(
                responses
                    .filter(e => {
                        const url = new URL(e.url)
                        const pathname = url.pathname
                        return pathname.includes('/ytdlp/')
                    })
                    .map(async e => {
                        const url = new URL(e.url)
                        const pathname = url.pathname
                        const arraybuffer = await e.arrayBuffer()
                        const byteLength = arraybuffer.byteLength
                        return [pathname, byteLength.toLocaleString()]
                    })
            )
            const ytdlpcachestatus = document.querySelector('.ytdlpcachestatus')
            const getThead = () => {
                const thUrl = '<th>URL</th>'
                const thByte = '<th>ByteLength</th>'
                const thCaP = '<th>Copy and Paste</th>'
                return `<thead><tr>${thUrl}${thByte}${thCaP}</tr></thead>`
            }
            const getTd = (td0, td1) => {
                const td0bClass = 'class="ytdlpcacheurl"'
                const td0bStyle = 'style="padding: 0 1rem;"'
                const td0b = `<td ${td0bClass} ${td0bStyle}>${td0}</td>`
                const td1b = `<td>${td1}</td>`
                const td2bClass = 'class="ytdlpcachecopyandpastebtn"'
                const td2b = `<td><button ${td2bClass}>Copy and Paste</button></td>`
                const trClass = 'class="ytdlpcachetr"'
                return `<tr ${trClass}>${td0b}${td1b}${td2b}</tr>`
            }
            const urlsStr = urls.map(e => getTd(e[0], e[1])).join('')
            ytdlpcachestatus.innerHTML = `<table>${getThead()}<tbody>${urlsStr}</tbody></table>`
            return
        }
        const targetRequest = requests.find(e => {
            const url = new URL(e.url)
            const pathname = url.pathname
            return href === pathname
        })
        const response = await cache.match(targetRequest)
        const responseBlob = await response.blob()
        const responseRawDataSrc = URL.createObjectURL(responseBlob)
        console.log('responseRawDataSrc', responseRawDataSrc)
        const ytdlpvideo = document.querySelector('.ytdlpvideo')
        ytdlpvideo.src = responseRawDataSrc
        return
    }
    const onclickcachedel = async () => {
        const cacheName = 'static-cache-v1'
        const cache = await caches.open(cacheName)
        const href = `/ytdlp/${getYtId()}`
        const requests = await cache.keys()
        const targetRequest = requests.find(e => {
            const url = new URL(e.url)
            const pathname = url.pathname
            return href === pathname
        })
        const isDeleted = cache.delete(targetRequest)
        const delstatus = document.querySelector('.ytdlpcachedelstatus')
        if (isDeleted) {
            delstatus.innerHTML = 'Status: Removed downloaded video.'
        } else {
            delstatus.innerHTML = 'Status: Cann not remove downloaded video.'
        }
        console.log('isDeleted', isDeleted)
    }
    const handletogglepip = () => {
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture()
        } else if (document.pictureInPictureEnabled) {
            const ytdlpvideo = document.querySelector('.ytdlpvideo')
            ytdlpvideo.requestPictureInPicture()
        }
    }
    const handletoggleloop = () => {
        const ytdlpvideo = document.querySelector('.ytdlpvideo')
        const ytdlptoggleloopbtn = document.querySelector('.ytdlptoggleloopbtn')
        const loopStatus = ytdlpvideo.getAttribute('loop')
        if (loopStatus === 'true' || loopStatus === '') {
            ytdlpvideo.removeAttribute('loop')
            ytdlptoggleloopbtn.innerHTML = 'Set Loop'
        } else if (loopStatus === null) {
            ytdlpvideo.setAttribute('loop', 'true')
            ytdlptoggleloopbtn.innerHTML = 'Unset Loop'
        }
    }
    document.addEventListener('click', e => {
        if (findParents(e.target, 'ytdlprequestbtn')) {
            onclick(e.target)
        }
        if (findParents(e.target, 'ytdlpdownloadbtn')) {
            onclickdownload(e.target)
        }
        if (findParents(e.target, 'ytdlpcachebtn')) {
            onclickcache(e.target)
        }
        if (findParents(e.target, 'ytdlpcachedelbtn')) {
            onclickcachedel(e.target)
        }
        if (findParents(e.target, 'ytdlptogglebtn')) {
            handletogglepip(e.target)
        }
        if (findParents(e.target, 'ytdlptoggleloopbtn')) {
            handletoggleloop(e.target)
        }
    })
})()
