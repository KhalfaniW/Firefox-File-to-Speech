#-Firefox-File-to-Speech

This is a firefox addon I was used to convert the text files I had extracted from a series of images into audio.

This addon works by looking at the text files in a folder that was pointed to by a Bash shell script.

The addon then opens the text file and copies the text it into 5 instances of the website [fromtexttospeech.com](www.fromtexttospeech.com) representing the 5 available voices, then, after converting the text files to speech, it sends the resulting urls linking to the hosted mp3s to the bash script for it to download.

This method is deprecated because the [new method](https://github.com/KhalfaniWadlington/Convert-Book-or-PDF-To-Audio) for converting text files to audio is headless whereas this method requires multiple applicatioms to run synchronously through the *console* text file liaison.

This add-on requires jpm to run ```jpm -b /usr/lib/firefox/firefox run ```


*Note that the directories referenced are hard coded into the program

Refer to the [Firefox addon documentation](https://developer.mozilla.org/en-US/Add-ons/SDK) for hints on how this was made and may be used
