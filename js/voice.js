$(function () {
    var mymodal = document.getElementById('myModal')
    var startBtn = document.getElementById('open')
    var close = document.getElementById('close')
    var microphone = document.getElementById('microphone')
    var microphoneshader = document.getElementById('microphoneShader');
    var recorderButton = document.getElementById("recordbutton")
    var volume = 0;
    var audioContext = null;
    var meter = null;
    var WIDTH = 500;
    var HEIGHT = 50;
    var rafID = null;
    var recorder, gumStream;

    close.onclick = function () {
        mymodal.style.display = 'none'
        if (recorder && recorder.state == 'recording') recorder.stop();
        StopStream()
    }
    microphone.onclick = function () {
        mymodal.style.display = 'none'
        if (recorder && recorder.state == 'recording') recorder.stop();
        StopStream()
    }
    mymodal.onclick = function () {
        mymodal.style.display = 'none'
        if (recorder && recorder.state == 'recording') recorder.stop();
        StopStream()
    }

    startBtn.onclick = function () {
        mymodal.style.display = 'flex'
        if (meter != null) {
            console.log(meter.volume)
        }
        // grab our canvas
        // monkeypatch Web Audio
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        // grab an audio context
        audioContext = new AudioContext();
        // Attempt to get audio input
        try {
            navigator.mediaDevices.getUserMedia({
                audio: true,
            }).then(function (stream) {
                window.streamReference = stream;
                onMicrophoneGranted(stream)
            }).catch(function () {
                onMicrophoneDenied()
            })
        } catch (e) {
            alert('getUserMedia threw exception :' + e);
        }
    }

    function StopStream() {
        if (!window.streamReference) return;
        window.streamReference.getAudioTracks().forEach(function (track) {
            track.stop();
        });
        window.streamReference.getVideoTracks().forEach(function (track) {
            track.stop();
        });
        window.streamReference = null;
    }

    function onMicrophoneDenied() {
        alert('Stream generation failed.');
    }

    var mediaStreamSource = null;

    function onMicrophoneGranted(stream) {
        // Create MediaRecorder and Post data.
        ProcessStream(stream)
        // Create an AudioNode from the stream.
        mediaStreamSource = audioContext.createMediaStreamSource(stream);
        // Create a new volume meter and connect it.
        meter = createAudioMeter(audioContext);
        mediaStreamSource.connect(meter);
        // kick off the visual updating
        onLevelChange();
    }

    function onLevelChange() {
        shaderVolume = meter.volume * 15
        microphoneshader.style.transform = 'scale(' + shaderVolume + ')'
        rafID = window.requestAnimationFrame(onLevelChange);
    }

    function ProcessStream(stream) {
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = function (e) {
            var chunks = [];
            chunks.push(e.data);
            var blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
            var fb = new FormData();
            fb.append('audio', blob);

            $.ajaxSetup({
                beforeSend: function (xhr, settings) {
                    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                    }
                }
            })
            var date = new Date()
            console.log('POST time: ' + date.getTime())
            $.ajax({
                url: 'voice',
                type: 'POST',
                data: fb,
                processData: false,
                contentType: false,
            }).done(function (data) {
                console.log(data)
                var recognizeSpeech = document.createElement('p');
                alert(data)
                var donedate = new Date()
                console.log('Get result time: ' + donedate.getTime())
            }).fail(function () {
                alert('fail.')
            })
            var url = URL.createObjectURL(e.data);
            var preview = document.createElement('audio');
            preview.controls = true;
            preview.src = url;
            preview.style.margin = '8px'
            var main = document.getElementById('main')
            main.appendChild(document.createElement('hr'))
            main.appendChild(preview)
        };
        recorder.start();
    }

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
})