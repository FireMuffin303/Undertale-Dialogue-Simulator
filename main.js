require("dotenv").config()
const fs = require('fs');
const {app, BrowserWindow,ipcMain,desktopCapturer,remote, ipcRenderer, systemPreferences} = require('electron');
const { error } = require("console");
const { contextIsolated } = require("process");


const filePath = './assets/dialog.txt'; // Replace with the actual path to your text file
const audioPath = "./assets/audio/dialog_audio.wav";


app.whenReady().then(() =>{
    let myWindow = new BrowserWindow({
        width : 800,
        height : 600,
        webPreferences:{
            nodeIntegration: false,
            contextIsolation: false
        }
    });

    myWindow.loadFile('index.html');
    myWindow.on('close',() => {myWindow = null;})


    fs.watch(audioPath, (eventType,filename)=>{
      if(filename){
        query(audioPath).then((response) => {
          if(response.error != undefined){
            return
          }
          console.log(response)
          let temptext = response.text
          let atext = ""
          temptext.split(" ").map((word)=>{
              atext += word
          })

          fs.writeFile(filePath,"2/e"+atext,(err) =>{
              if(err){
                console.log(err)
              }else{
                console.log("File write successfully!")
              }
          })
        }).catch((err) =>{
          console.log(err)
        });
      }
    })

    fs.watch(filePath, (eventType, filename) => {
      if (filename) {
        myWindow.reload()
      }
    });

    

    async function query(filename) {
      const data = fs.readFileSync(filename);
      
      const response = await fetch(
          "https://api-inference.huggingface.co/models/airesearch/wav2vec2-large-xlsr-53-th",
          {
              headers: { Authorization: process.env.HUGGING_FACE_API_KEY },
              method: "POST",
              body: data,
          }
      );
      const result = await response.json();
      return result;
  }

  /*query("./assets/audio/audio_test.mp3").then((response) => {
    //console.log(response.text)
    let text = ""
    response.text.split(" ").map((word)=>{
        text += word
    })
    fs.writeFile(filePath,"2/e"+text,(err) =>{
        if(err){
          console.log(err)
        }else{
          console.log("File write successfully!")
        }
    })
  });*/
})






