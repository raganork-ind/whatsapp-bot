const {getVideo, skbuffer} = require('ytdl-core');
const ytdl = require('ytdl-core');
const {Module} = require('../main');
const {MODE} = require('../config');
let w = MODE=='public'?false:true
Module({pattern: 'video ?(.*)', fromMe: w, desc: "YouTube video downloader"}, (async (message, match) => { 
        var s1 = !match[1] ? message.reply_message.message : match[1]
        if (!s1) return await message.client.sendMessage(message.jid,{text: '_Unable to read link. Use .video link_'});
        if (!s1.includes('youtu')) return await message.client.sendMessage(message.jid,{text:"_Need YouTube link_"});
     const getID =
        /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed|shorts\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
        var qq = getID.exec(s1)
        await message.client.sendMessage(message.jid,{text: "_Downloading_"}, {quoted : { key: {fromMe: true,participant: "0@s.whatsapp.net",remoteJid: "status@broadcast"},message: {"extendedTextMessage": {"text": s1 }}}});
     try { var dl = await getVideo(qq[1]) } catch {return await message.client.sendMessage(message.jid,{text:"*Download failed. Restart bot*"})}
var cap = dl.details.title || ""
var th = dl.details.thumbnail.url || null
try { var yt = ytdl(qq[1], {filter: format => format.container === 'mp4' && ['720p', '480p', '360p', '240p', '144p'].map(() => true)}); } catch {return await message.client.sendMessage(message.jid,{text:"*Download failed. Restart bot*"})}
        yt.pipe(fs.createWriteStream('./temp/' + qq[1] + '.mp4'));
        yt.on('end', async () => {
            await message.client.sendMessage(message.jid,{text:"_Uploading_"});
            await message.client.sendMessage(message.jid,{video: fs.readFileSync('./temp/' + qq[1] + '.mp4'),mimetype: "video/mp4" , caption:cap, thumbnail: await skbuffer(th)});
        });
    
}));
