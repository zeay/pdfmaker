// const path = require('path');
// const url = require('url');
// const fs = require('fs');
const ipcMain = require('electron').ipcMain;
const { exec } = require("child_process");
const sanitize = require('sanitize-filename');
const config = require("./config.json");
let stage = "initial";
let command = "";
let mainFolder= "";
let direc = "";
global.dataGlobal = {
    linkCounter: 0,
    cityCounter: 0,
}

let links ;
let pdfCreator = 0;
let keywordExist = false;

//make this false if start working with city developer note
let cityExist = true;

ipcMain.on('startBot', (e, data)=> {
    console.log("Bot Started");
    e.sender.send('start', stage);
});

ipcMain.on('setStage', (e, data)=>{
    stage = data;
});

//frontend caller
ipcMain.on("counter", ()=>{ 
    if(config.keywords.length - 1 > global.dataGlobal.linkCounter){
        global.dataGlobal.linkCounter += 1;
        // if(global.dataGlobal.linkCounter === config.keywords.length){ 
        //     global.dataGlobal.linkCounter -= 1;
        //     keywordExist = true;
        // }
        console.log("link counter ", global.dataGlobal.linkCounter);
    }else{ 
        keywordExist = true;
        console.log("Keywords are full ...................");
    }
});

//frontend caller
ipcMain.on("cityCounter", ()=>{ 
    if(config.cities.length - 1 > global.dataGlobal.cityCounter){
        global.dataGlobal.cityCounter += 1;
        // if(global.dataGlobal.cityCounter === config.cities.length){ 
        //     global.dataGlobal.cityCounter -= 1;
        // }
        console.log("city counter ", global.dataGlobal.cityCounter);
    }else{
        cityExist = true;
        console.log("Cities are full ...................");
    }
});

//frontend caller
ipcMain.on("mainFolder", (e,data)=>{ 
    console.log(data);
    mainFolder = sanitize(data);
    console.log("mainfolder name ", mainFolder)
});

//frontend caller
ipcMain.on("captureLinks", (e, data)=>{ 
    links = data;
});

ipcMain.on("startmakingpdf", (e, link)=>{ 
    direc = "data/"+mainFolder + "/" +"searchResult.pdf";
    command = `phantomjs pdfPrint.js "${link}" "${direc}"`;
    console.log(command);
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log("Moving to extract links wait........")
        setTimeout(()=>{ 
            console.log("starting pdf maker");
            startMakePdf();
        },5000)
    });
});

function startMakePdf(){ 
    if(pdfCreator < links.length){ 
        direc = "data/"+mainFolder + "/" +"result"+pdfCreator+".pdf";
        command = `phantomjs pdfPrint.js "${links[pdfCreator]}" "${direc}"`;
        console.log(command);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                pdfCreator += 1;
                startMakePdf();
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                pdfCreator += 1;
                startMakePdf();
            }
            console.log(`stdout: ${stdout}`);
            pdfCreator += 1;
            startMakePdf();
        });
    }else{
        if(global.dataGlobal.cityCounter === config.cities.length-1 && !keywordExist){
            global.dataGlobal.cityCounter = 0;
        }

        // if(global.dataGlobal.cityCounter > config.cities.length && global.dataGlobal.linkCounter > config.keywords.length - 1){ 
        //     global.dataGlobal.linkCounter -= 1;
        // }

        if(keywordExist && cityExist){
            console.log("I am done ................");
            process.exit();
        }else{ 
            pdfCreator = 0;
            stage = "initial";
            global.win.loadURL("https://google.co.in");
        }
    }
}






















