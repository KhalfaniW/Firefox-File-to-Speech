
var hash =window.location.href.split("#")[1];
self.port.on("write", function(message) {
	try	
	{//These items wont be around on 2 load so they will cause an error
		document.getElementById("input_text").value=message.replace(/(\r\n|\n|\r)/gm," ");
		document.getElementById("voice").selectedIndex=hash-1;
		document.getElementById("create_audio_file").click();
		
	}
	catch(e)
	{	try
		{
			if(document.getElementsByClassName("input_text")[0].innerHTML.indexOf("Download audio file")>-1)
			{
				for(i=0; i<document.getElementsByTagName("a").length;i++)
				{
					if(document.getElementsByTagName("a")[i].innerHTML.indexOf("Download audio file")>-1)
					{
						self.port.emit("content script", document.getElementsByTagName("a")[i].href+"#"+hash);
						return;
					}
				}
			
			}
		}catch(e)
		{}
	}
})


