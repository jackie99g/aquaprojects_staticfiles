import {getCookie} from './utils.js'
(() => {
    var mymodal = document.getElementById('myModal')
    var microphoneshader = document.getElementById('microphoneShader');
    var audioContext = null;
    var meter = null;
    var recorder = null;
    var sendFlag;

    $(document).on('click', '#close', () => {
        mymodal.style.display = 'none'
        sendFlag = false;
        if (recorder && recorder.state == 'recording') recorder.stop();
        StopStream()
    })
    $(document).on('click', '#microphone', () => {
        mymodal.style.display = 'none'
        if (recorder && recorder.state == 'recording') recorder.stop();
        StopStream()
    })
    $(document).on('click', '#myModal', () => {
        mymodal.style.display = 'none'
        if (recorder && recorder.state == 'recording') recorder.stop();
        StopStream()
    })

    $(document).on('click', '#open', () => {
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
    })

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

            fetch(
                '/voice', {
                    method: 'POST',
                    body: fb,
                    mode: 'cors',
                    credentials: 'include',
                    headers: {
                        "X-CSRFToken": getCookie('csrftoken')
                    },
                }
            ).then(response => {
                if (response.ok) {
                    return response.text()
                } else {
                    console.error(response)
                }
            }).then(data => {
                console.log(data)
                var recognizeSpeech = document.createElement('p');
                alert(data)
            }).catch(err => {
                console.error(err)
                alert('fail...')
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

    // function csrfSafeMethod(method) {
    //     // these HTTP methods do not require CSRF protection
    //     return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    // }

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
    $(document).on('mousedown', '#open' ,() => {
        scrollPageTop()
    })

    function scrollPageTop() {
        scrollTop(500)

        function scrollTop(n) {
            var t = new Date,
                i = window.pageYOffset,
                r = setInterval(() => {
                    var u = new Date - t;
                    u > n && (clearInterval(r), u = n);
                    window.scrollTo(0, i * (1 - u / n))
                }, 10)
        }
    }
})()