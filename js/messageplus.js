$(function() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('start_video')) {
            startVideo()
        } else if (e.target.classList.contains('start_display_video')) {
            startDisplayVideo()
        } else if (e.target.classList.contains('stop_video')) {
            stopVideo()
        } else if (e.target.classList.contains('connect_video')) {
            connect()
        } else if (e.target.classList.contains('recieve_remote_sdp_btn')) {
            RecieveRemoteSdpClick()
        } else if (e.target.classList.contains('recieve_remote_sdp_btn_sender')) {
            RecieveRemoteSdpSenderClick()
        }
    })

    let localStream = null;

    let localVideo = document.querySelector('#local_video');
    let SendSdpText = document.querySelector('#send_sdp_text');
    let recieveSdpText = document.querySelector('#recieve_sdp_text');
    let recieveSdpTextSender = document.querySelector('#recieve_sdp_text_sender');

    function startVideo() {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
        }).then(function(stream) {
            localVideo.srcObject = stream
            localStream = stream;
        })
    }

    function startDisplayVideo() {
        navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false,
        }).then(function(stream) {
            localVideo.srcObject = stream
            localStream = stream;
        })
    }

    function stopVideo() {
        localVideo.pause()
        localVideo.srcObject = null
        let tracks = localStream.getTracks();
        for (let track of tracks) {
            track.stop();
        }
    }

    var senderPeerConnection = new RTCPeerConnection({
        'iceServers': [{
            'urls': 'stun:stun.l.google.com:19302'
        }]
    })
    var reciverPeerConnection = new RTCPeerConnection({
        'iceServers': [{
            'urls': 'stun:stun.l.google.com:19302'
        }]
    })

    function connect() {
        document.querySelector('#local_video').srcObject = localStream
        localStream.getTracks().forEach(track => senderPeerConnection.addTrack(track, localStream))

        console.log('creating_offer')
        senderPeerConnection.createOffer().then(function(offer) {
            console.log('created_offer')
            return senderPeerConnection.setLocalDescription(offer)
        }).then(function() {
            console.log('set_local_description #sender')
            SendSdpText.value = senderPeerConnection.localDescription
        })
    }

    function RecieveRemoteSdpClick() {
        var recieve_remote_sdp_text = recieveSdpText.value
        console.log('set_remote_description #reciever')
        reciverPeerConnection.setRemoteDescription(
            new RTCSessionDescription({
                type: 'offer',
                sdp: recieve_remote_sdp_text,
            })
        ).then(function() {
            document.querySelector('#local_video').srcObject = localStream
            localStream.getTracks().forEach(track => reciverPeerConnection.addTrack(track, localStream))
        }).then(function() {
            console.log('create_answer')
            return reciverPeerConnection.createAnswer()
        }).then(function(answer) {
            console.log('set_local_description #reciever')
            return reciverPeerConnection.setLocalDescription(answer)
        }).then(function() {
            SendSdpText.value = reciverPeerConnection.localDescription
        })
    }

    function RecieveRemoteSdpSenderClick() {
        var recieve_remote_sdp_text_sender = recieveSdpTextSender.value
        console.log('set_remote_description #sender')
        senderPeerConnection.setRemoteDescription(
            new RTCSessionDescription({
                type: 'answer',
                sdp: recieve_remote_sdp_text_sender,
            })
        )
    }

    senderPeerConnection.addEventListener('icecandidate', function(event) {
        console.log('ice_candidate #sender')
        console.log(event)
        if (!event.candidate) {
            SendSdpText.value = senderPeerConnection.localDescription.sdp
            console.log(senderPeerConnection.localDescription.sdp)
        }
    })

    reciverPeerConnection.addEventListener('icecandidate', function(event) {
        console.log('ice_candidate #reciever')
        console.log(event)
        if (!event.candidate) {
            SendSdpText.value = reciverPeerConnection.localDescription.sdp
            console.log(reciverPeerConnection.localDescription.sdp)
        }
    })

    senderPeerConnection.addEventListener('track', function(event) {
        console.log('track_event #sender')
        console.log(event)
        document.querySelector('#remote_video').srcObject = event.streams[0]
    })

    reciverPeerConnection.addEventListener('track', function(event) {
        console.log('track_event #reciever')
        console.log(event)
        document.querySelector('#remote_video').srcObject = event.streams[0]
    })

    senderPeerConnection.addEventListener('addstream', function(event) {
        console.log('addstream #sender')
        console.log(event)
        document.querySelector('#remote_video').srcObject = event.stream
    })

    reciverPeerConnection.addEventListener('addstream', function(event) {
        console.log('addstream #reciever')
        console.log(event)
        document.querySelector('#remote_video').srcObject = event.stream
    })
})