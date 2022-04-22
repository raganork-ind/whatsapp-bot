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
        let sr = await yts(match[1]);
        sr = sr.all;
        if(sr.length < 1) return await message.sendReply("*No results found!*");
        const sections = [
    {
    title: "Matching songs.",
    rows: [
        {title: sr[0].title, description: '', rowId:"song;"+sr[0].videoId+';'+message.client.user.jid},
        {title: sr[1].title, description: '', rowId:"song;"+sr[1].videoId+';'+message.client.user.jid},
        {title: sr[2].title, description: '', rowId:"song;"+sr[2].videoId+';'+message.client.user.jid},
        {title: sr[3].title, description: '', rowId:"song;"+sr[3].videoId+';'+message.client.user.jid},
        {title: sr[4].title, description: '', rowId:"song;"+sr[4].videoId+';'+message.client.user.jid},
        {title: sr[5].title, description: '', rowId:"song;"+sr[5].videoId+';'+message.client.user.jid},
        {title: sr[6].title, description: '', rowId:"song;"+sr[6].videoId+';'+message.client.user.jid},
        {title: sr[7].title, description: '', rowId:"song;"+sr[7].videoId+';'+message.client.user.jid},
        {title: sr[8].title, description: '', rowId:"song;"+sr[8].videoId+';'+message.client.user.jid},
        {title: sr[9].title, description: '', rowId:"song;"+sr[9].videoId+';'+message.client.user.jid},
        ]
    } ]
       const listMessage = {
  text: "And 9 more results...",
  footer: "Hey "+message.data.pushName+", selcected song will be downloaded in high quality which depends upon its size",
  title: sr[0].title,
  buttonText: "Select song",
  sections
}
    await message.client.sendMessage(message.jid, listMessage)
}));
Module({on: 'button', fromMe: sourav}, (async (message, match) => { 
if (message.list && message.list.startsWith("song") && message.list.includes(message.client.user.jid)) {
    try { let stream = ytdl(message.list.split(";")[1], {quality: 'highestaudio',}); } catch { return await message.sendReply("*Download failed. Restart bot*") }
    var {details} = await getVideo(message.list.split(";")[1]);
    var thumb = await skbuffer(details.thumbnail.url);
    ffmpeg(stream)
        .audioBitrate(320)
        .save('./temp/song.mp3')
        .on('end', async () => {
            try {var audio = await addInfo('./temp/song.mp3',details.title,AUDIO_DATA.split(";")[1],"Raganork Engine",thumb)} catch {return await message.client.sendMessage(message.jid,{audio: fs.readFileSync("./temp/song.mp3"),mimetype: 'audio/mp3'}, {quoted: message.data});}
            await message.client.sendMessage(message.jid,{audio: audio,mimetype: 'audio/mp3'}, {quoted: message.data});
        });
}
}));