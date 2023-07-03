import WaveSurfer from "./node_modules/wavesurfer.js/dist/wavesurfer.js"
import RecordPlugin from "https://unpkg.com/wavesurfer.js@beta/dist/plugins/record.js"

window.addEventListener('load',function(){
    load()
})

function load(){
    let soulRecorder = document.getElementById('soul_record')

    let is_record = false
    
    let x = document.getElementById("myAudio"); 
    let dialogText = document.getElementById('dialogText')
    let dialogProtrait = document.getElementById('dialog-protrait')
    let request = new XMLHttpRequest();
    request.open("GET", "./assets/dialog.txt", false);
    request.send();
    let a = request.responseText.split("/e")
    let text = "* "
    let protraitIndex = 1

    const wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#ffffff',
        progressColor: '#F1EAF5',
     })
  
    wavesurfer.load('./assets/audio/dialog_audio.wav')
    const record = wavesurfer.registerPlugin(RecordPlugin.create())

    if(a.length < 2 ){
        text += request.responseText
    }else{
        text += a[1]
        console.log(a)
        protraitIndex = a[0]
    }

    let protraitsPath = `./assets/protraits/jo/deltarune_my_protrait_${protraitIndex}.svg`
    dialogProtrait.src = protraitsPath


    let index = 0;
    const showText = setInterval(function() {
        dialogText.innerHTML += text.charAt(index);
        x.play(); 
        index++;

        if (index === text.length) {
            clearInterval(showText);
        }
    }, 20);

    
    soulRecorder.addEventListener('click',() =>{
        is_record = !is_record
        let soulPath = `./assets/white_soul.svg`
        if(is_record){
            console.log('aa')
            soulPath = `./assets/red_soul.svg`
            record.startRecording()
            soulRecorder.src = soulPath

            return
        }

        soulRecorder.src = soulPath
        record.stopRecording()
    })

    record.on('stopRecording',() =>{
        const link = document.createElement("a")
        link.href = record.getRecordedUrl()
        link.download = "dialog_audio.wav"
        link.hidden = true
        link.click()
    })
}


/*function recordButton(){
    console.log("clicked");
    let soulInjection = document.getElementById('soul_record')
    is_record = !is_record
    let soulPath = `./assets/white_soul.svg`
    if(is_record){
        soulPath = `./assets/red_soul.svg`
        startMediaRecorder()
    }
    stopMediaRecorder()
    soulInjection.src = soulPath
}*/
