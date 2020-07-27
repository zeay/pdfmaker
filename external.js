console.log("externalsheet loaded");
const render = require('electron').ipcRenderer;
const config = require("./config.json");
const remote = require('electron').remote;
const globalData = remote.getGlobal('dataGlobal');
console.log(config);
let links = [];


function performSearch(){ 
    render.send("setStage", "result");
    let querybox = document.getElementsByName("q")[0];
    let button = document.getElementsByName("btnK")[0];
    let putvalue = "";
    if(config.keywords[globalData.linkCounter].indexOf("___") > -1){
        let value = config.keywords[globalData.linkCounter].split(" ");
        for(let i=0; i<value.length-1; i++){ 
            putvalue += value[i] + " ";
        }
        querybox.value = putvalue;
        button.click();
        render.send('mainFolder', putvalue);
        render.send('counter');  //increase the counter of link 
    }else{
        console.log(config.keywords[globalData.linkCounter], globalData.linkCounter, config.cities[globalData.cityCounter], globalData.cityCounter);
        putvalue = querybox.value = config.keywords[globalData.linkCounter] + config.cities[globalData.cityCounter];
        button.click();
        render.send('mainFolder', putvalue);
        render.send('counter');  //increase the counter of link 
        render.send('cityCounter'); //increase the counter 
    }
}

function saveLinkAndPerform(){ 
    console.log("save link");
    let result = document.getElementsByClassName("r");
    for(let i=0; i< result.length; i++){
        let link = result[i].childNodes[0];
        links.push(link.href);
    }
    render.send('captureLinks', links);
    render.send("startmakingpdf", window.location.href);
}

function stage(data){ 
    if(data === "initial"){ 
        //google search perform
        performSearch();
    }else if(data === "result"){
        //search ........
        setTimeout(()=>{ 
            saveLinkAndPerform();
        },5000);
    }
}

window.onload = function(){
    render.send("startBot");
    render.once('start', (e, data)=>{
        // console.log(e);
        // console.log("Start");
        stage(data);
    });
}