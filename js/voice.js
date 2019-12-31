$(function() {
    var mymodal = document.getElementById('myModal')
    var startBtn = document.getElementById('open')
    var close = document.getElementById('close')
    var microphone = document.getElementById('microphone')
    var microphoneshader = document.getElementById('microphoneShader');
    var audioContext = null;
    var meter = null;
    var recorder = null;
    var sendFlag;

    close.onclick = function() {
        mymodal.style.display = 'none'
        sendFlag = false;
        if (recorder && recorder.state == 'recording') recorder.stop();
        StopStream()
    }
    microphone.onclick = function() {
        mymodal.style.display = 'none'
        if (recorder && recorder.state == 'recording') recorder.stop();
        StopStream()
    }
    mymodal.onclick = function() {
        mymodal.style.display = 'none'
        if (recorder && recorder.state == 'recording') recorder.stop();
        StopStream()
    }

    startBtn.onclick = function() {
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
            }).then(function(stream) {
                window.streamReference = stream;
                onMicrophoneGranted(stream)
            }).catch(function() {
                onMicrophoneDenied()
            })
        } catch (e) {
            alert('getUserMedia threw exception :' + e);
        }
    }

    function StopStream() {
        if (!window.streamReference) return;
        window.streamReference.getAudioTracks().forEach(function(track) {
            track.stop();
        });
        window.streamReference.getVideoTracks().forEach(function(track) {
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
        shaderVolume = meter.volume * 20 + 0.9
        microphoneshader.style.transform = 'scale(' + shaderVolume + ')'
        window.requestAnimationFrame(onLevelChange);
    }

    function ProcessStream(stream) {
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = function(e) {
            if (sendFlag === false) return
            var chunks = [];
            chunks.push(e.data);
            var blob = new Blob(chunks, {
                type: 'audio/webm;codecs=opus'
            });
            var fb = new FormData();
            fb.append('audio', blob);

            $.ajaxSetup({
                beforeSend: function(xhr, settings) {
                    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                    }
                }
            })
            var date = new Date()
            $.ajax({
                url: 'voice',
                type: 'POST',
                data: fb,
                processData: false,
                contentType: false,
            }).done(function(data) {
                console.log(data)
                var recognizeSpeech = document.createElement('p');
                alert(data)
                var donedate = new Date()
            }).fail(function() {
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

    function createAudioMeter(audioContext, clipLevel, averaging, clipLag) {
        var processor = audioContext.createScriptProcessor(512);
        processor.onaudioprocess = volumeAudioProcess;
        processor.clipping = false;
        processor.lastClip = 0;
        processor.volume = 0;
        processor.clipLevel = clipLevel || 0.98;
        processor.averaging = averaging || 0.95;
        processor.clipLag = clipLag || 750;

        // this will have no effect, since we don't copy the input to the output,
        // but works around a current Chrome bug.
        processor.connect(audioContext.destination);

        processor.checkClipping =
            function() {
                if (!this.clipping)
                    return false;
                if ((this.lastClip + this.clipLag) < window.performance.now())
                    this.clipping = false;
                return this.clipping;
            };

        processor.shutdown =
            function() {
                this.disconnect();
                this.onaudioprocess = null;
            };

        return processor;
    }

    function volumeAudioProcess(event) {
        var buf = event.inputBuffer.getChannelData(0);
        var bufLength = buf.length;
        var sum = 0;
        var x;

        // Do a root-mean-square on the samples: sum up the squares...
        for (var i = 0; i < bufLength; i++) {
            x = buf[i];
            if (Math.abs(x) >= this.clipLevel) {
                this.clipping = true;
                this.lastClip = window.performance.now();
            }
            sum += x * x;
        }

        // ... then take the square root of the sum.
        var rms = Math.sqrt(sum / bufLength);

        // Now smooth this out with the averaging factor applied
        // to the previous sample - take the max here because we
        // want "fast attack, slow release."
        this.volume = Math.max(rms, this.volume * this.averaging);
    }
    $('#open').on('mousedown', function() {
        ScrollPageTop()
    })
    $('#open').on('touchend', function() {
        ScrollPageTop()
    })

    function ScrollPageTop() {
        $('html').animate({
            scrollTop: 0
        }, {
            duration: 1000
        }, 'linear')
    }
})