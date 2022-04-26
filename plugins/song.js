const {Module} = require('../main');
const {MODE,AUDIO_DATA} = require('../config');
const yts = require( 'yt-search' )
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const {skbuffer,getVideo,addInfo} = require('raganork-bot');
let sourav = MODE == 'public' ? false : true
Module({pattern: 'song ?(.*)', fromMe: sourav, desc: "Select and download songs from yt (list)"}, (async (message, match) => { 
if (!match[1]) return message.sendReply("*Need words*")
        var myid = message.client.user.id.split("@")[0].split(":")[0]
        let sr = await yts(match[1]);
        sr = sr.all;
        if(sr.length < 1) return await message.sendReply("*No results found!*");
        const sections = [
    {
    title: "Matching songs.",
    rows: [
         
        {title: sr[0].title, description: '', rowId:"song;"+sr[0].videoId+';'+myid},
        {title: sr[1].title, description: '', rowId:"song;"+sr[1].videoId+';'+myid},
        {title: sr[2].title, description: '', rowId:"song;"+sr[2].videoId+';'+myid},
        {title: sr[3].title, description: '', rowId:"song;"+sr[3].videoId+';'+myid},
        {title: sr[4].title, description: '', rowId:"song;"+sr[4].videoId+';'+myid},
        {title: sr[5].title, description: '', rowId:"song;"+sr[5].videoId+';'+myid},
        {title: sr[6].title, description: '', rowId:"song;"+sr[6].videoId+';'+myid},
        {title: sr[7].title, description: '', rowId:"song;"+sr[7].videoId+';'+myid},
        {title: sr[8].title, description: '', rowId:"song;"+sr[8].videoId+';'+myid},
        {title: sr[9].title, description: '', rowId:"song;"+sr[9].videoId+';'+myid},
        ]
    } ]
       const listMessage = {
  text: "And 9 more results...",
  footer: "Hey "+message.data.pushName,
  title: sr[0].title,
  buttonText: "Select song",
  sections
}
    await message.client.sendMessage(message.jid, listMessage)
}));
Module({on: 'button', fromMe: sourav}, (async (message, match) => { 
if (message.list && message.list.startsWith("song") && message.list.includes(message.client.user.id.split("@")[0].split(":")[0])) {
    await message.sendMessage("_Downloading_")
    var stream = ytdl(message.list.split(";")[1], {quality: 'highestaudio',});
    var {details} = await getVideo(message.list.split(";")[1]);
    var thumb = await skbuffer(details.thumbnail.url);
    ffmpeg(stream)
        .audioBitrate(320)
        .save('./temp/song.mp3')
        .on('end', async () => {
            try {var audio = await addInfo('./temp/song.mp3',details.title,AUDIO_DATA.split(";")[1],"Raganork Engine",thumb)} catch {return await message.client.sendMessage(message.jid,{audio: fs.readFileSync("./temp/song.mp3"),mimetype: 'audio/mp3'}, {quoted: message.data});}
            return await message.client.sendMessage(message.jid,{audio: audio,mimetype: 'audio/mpeg'}, {quoted: message.data});
        });
}
}));
