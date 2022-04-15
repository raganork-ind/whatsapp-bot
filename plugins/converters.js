const {Module} = require('../main');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const {saveMessage} = require('./misc/saveMessage');
const Config = require('../config');
const {MODE} = require('../config');
let w = MODE=='public'?false:true
Module({pattern: 'sticker$', fromMe: w}, (async (message, match) => {    

        if (message.reply_message === false) return await message.client.sendMessage(message.jid, { text: '_Reply to a photo_' })
        var savedFile = await saveMessage(message.reply_message);
        if (message.reply_message.video === false && message.reply_message.image) {
            ffmpeg(savedFile)
                .outputOptions(["-y", "-vcodec libwebp"])
                .videoFilters('scale=2000:2000:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=2000:2000:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1')
                .save('./temp/st.webp')
                .on('end', async () => {
                     await message.client.sendMessage(message.jid, { sticker: fs.readFileSync('./temp/st.webp') }, { quoted: message.data })
            });
        return;
        }

        ffmpeg(savedFile)
            .outputOptions(["-y", "-vcodec libwebp", "-lossless 1", "-qscale 1", "-preset default", "-loop 0", "-an", "-vsync 0", "-s 600x600"])
            .videoFilters('scale=600:600:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=600:600:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1')
            .save('./temp/st.webp')
            .on('end', async () => {
                await message.client.sendMessage(message.jid, { sticker: fs.readFileSync('./temp/st.webp') }, { quoted: message.data })
            });
        return;
    }));
Module({pattern: 'mp3$', fromMe: w}, (async (message, match) => {    
if (message.reply_message === false) return await message.client.sendMessage(message.jid, { text: '_Reply to a video or voice_' })
        var savedFile = await saveMessage(message.reply_message);
     ffmpeg(savedFile)
            .save('./temp/tomp3.mp3')
            .on('end', async () => {
                await message.client.sendMessage(message.jid, { audio: fs.readFileSync('./temp/tomp3.mp3'),mimetype: 'audio/mp4',ptt: false }, { quoted: message.data })
            });   
}));
Module({pattern: 'photo$', fromMe: w}, (async (message, match) => {    
if (message.reply_message === false) return await message.client.sendMessage(message.jid, { text: '_Reply to a non animated sticker_' })
     if (message.reply_message.sticker && message.reply_message.animated === false ) {
     var savedFile = await saveMessage(message.reply_message);
     let msg = {key: {remoteJid: message.reply_message.jid,fromMe: false,id: message.reply_message.id}}
      ffmpeg(savedFile)
            .fromFormat('webp_pipe')
            .save('output.png')
            .on('end', async () => {
                await message.client.sendMessage(message.jid, {image: fs.readFileSync('output.png')},{quoted: msg});
            });
}
}));
