var self = require("sdk/self");
var tabs = require("sdk/tabs");
require("sdk/tabs").on("ready", startProccess);
// To read & write content to file
const {Cu} = require("chrome");
const {TextDecoder, TextEncoder, OS} = Cu.import("resource://gre/modules/osfile.jsm", {});
var { setInterval, clearInterval,setTimeout } = require("sdk/timers");

var directory = "/media/mint/617bfc7e-9f48-424e-a2c1-9076286517b7/Files2/";
var index;
var tryingtowrite =true;	
var tabs = require("sdk/tabs");
var linksaquired=[false,false,false,false,false];
//create clickable button in firefox toolbar 
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

var button = buttons.ActionButton({//requires user to click button to start
  id: "mozilla-link",
  label: "Start Process",
  icon: {
    "16": "./info.png",
  },
  onClick: restart
});


function restart()
{
	tabs.open("http://www.fromtexttospeech.com#1");//these denote the five voices
	tabs.open("http://www.fromtexttospeech.com#2");
	tabs.open("http://www.fromtexttospeech.com#3");
	tabs.open("http://www.fromtexttospeech.com#4");
	tabs.open("http://www.fromtexttospeech.com#5");
	linksaquired=[false,false,false,false,false];
}

//Control shift a : enable debugging



function startProccess() {
	//Get File Number

	let decoder = new TextDecoder();       
	let promise = OS.File.read("index"); // file To convert
	promise = promise.then(
		function onFulfill(array) {
			index = (decoder.decode(array)).replace(/\r?\n|\r/g, "");   // Convert this array to text	
			readAndSendToContentScript(directory+index);
								//substring to get rid of new line if there is one
		},
		function onReject()
		{
			console.log("failed to acess index on start");
		}
	);
	
}
var timer=0;
function readAndSendToContentScript(path)//read actuall Book Text
{

	let decoder = new TextDecoder();       
	let promise = OS.File.read(path); // Read the complete file as an array
	promise = promise.then(
		function onFulfill(array) {
			var text = decoder.decode(array);   // Convert this array to a text	
			//Add content Script
			var tabs = require("sdk/tabs");
			for (let tab of tabs)//all tabs in web browser denoting all the voices
			{
				if(tab.url.indexOf("fromtexttospeech.com")>-1)	{
					var worker = tab.attach({  		 
						contentScriptFile: "./content script.js"
			  		});
					worker.port.emit("write",text);//send message to contentscript
				 	worker.port.on("content script", function(message) {//receives message from contentscript
							var hash = parseInt(message.split("#")[1]);//the hash is the number denoting the voice

							if(!linksaquired[hash-1])// if you have received the mp3 url from the tab
							{	
								var tabs = require("sdk/tabs");
								for (let tab of tabs)
								{
									if (tab.url.indexOf("#"+hash)>-1)
									{
										tab.close();										
									}

								}
								appendToFile("locations.txt",message);
								linksaquired[hash-1]=true;
							}
	
							if(checkAll())
							{	//tell console to download
								writeToFile("console","download");
								console.log("Success");
								tryingtowrite=false;
								//reset all
								linksaquired=[false,false,false,false,false];
								//wait a while to restart
								timer = setInterval(waitToRestart, 1000);
							}
							
					});
					
				}
			}

		},
		function onReject(reason)
		{
			console.log("failed to read file: "+path+" because "+reason);
		}
	);
}
function checkAll(){
	for(i=0; i<linksaquired.length;i++)
	{
		if(linksaquired[i]==false)
		return false;
	}
	return true;
}
function waitToRestart()
{
	var filetext;

	
	let decoder = new TextDecoder();       
	let promise = OS.File.read("console"); // file To convert
	promise = promise.then(
		function onFulfill(array) {
			filetext = (decoder.decode(array));   // Convert this array to text	
			if (filetext.indexOf("restart")>-1)
			{
				console.log("Restarting");
				clearInterval(timer);
				restart();
			}
			
		},
		function onReject()
		{
			console.log("failed to acess index restart");
		}
	);
}
function writeToFile(path,info)
{ 
	info=String(info);
	let encoder = new TextEncoder();                                  
	let array = encoder.encode(info); //create temp file             
	let writepromise = OS.File.writeAtomic(path, info,          
		{tmpPath: "/media/mint/617bfc7e-9f48-424e-a2c1-9076286517b7/converttextfiles/"+path+".tmp"});
  	writepromise.then(
		function onFulfill(){
		//don't worry about it if ift fails
		},
		function onReject(){
			console.log("failed to write "+info +"to"+path);
		}
	);
}
function appendToFile(path,info)
{
	OS.File.open("/media/mint/617bfc7e-9f48-424e-a2c1-9076286517b7/converttextfiles/"+path, {write: true, append: true}).then(valOpen => {
		var txtToAppend = info+'\n';
		var txtEncoded = TextEncoder().encode(txtToAppend);
		valOpen.write(txtEncoded).then(valWrite => {
		    valOpen.close().then(valClose => {
			//don't do anything
		    });
		});
	});
}


