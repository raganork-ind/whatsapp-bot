const {Module} = require('../main');
const {downloadContentFromMessage,Mimetype} = require('@adiwajshing/baileys');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const {execFile} = require('child_process');
const Config = require('../config');
const {MODE} = require('../config');
let w = MODE=='public'?false:true
Module({pattern: 'sticker$', fromMe: w}, (async (message, match) => {    
if (message.reply_message === false) return await message.client.sendMessage(message.jid, { text: '_Reply to a photo or short video_' })
 const stream = await downloadContentFromMessage(message.reply_message.data.quotedMessage[message.reply_message.image?'imageMessage':'videoMessage], message.reply_message.image?'image':'video)
 let buffer = Buffer.from([])
 for await(const chunk of stream) {
  buffer = Buffer.concat([buffer, chunk])}
  await fs.writeFileSync(message.reply_message.image?'./temp/sticker.jpeg':'./temp/sticker.mp4', buffer)
    

        if (message.reply_message.video === false && message.reply_message.image) {
            ffmpeg('./temp/sticker.jpeg')
                .outputOptions(["-y", "-vcodec libwebp"])
                .videoFilters('scale=2000:2000:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=2000:2000:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1')
                .save('./temp/st.webp')
                .on('end', async () => {
                     await message.client.sendMessage(message.jid, { sticker: fs.readFileSync('./temp/st.webp') }, { quoted: message.data })
            });
        return;
        }

        ffmpeg('./temp/sticker.mp4')
            .outputOptions(["-y", "-vcodec libwebp", "-lossless 1", "-qscale 1", "-preset default", "-loop 0", "-an", "-vsync 0", "-s 600x600"])
            .videoFilters('scale=600:600:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=600:600:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1')
            .save('./temp/st.webp')
            .on('end', async () => {
                await message.client.sendMessage(message.jid, { sticker: fs.readFileSync('./temp/st.webp') }, { quoted: message.data })
            });
        return;
    }));
Module({pattern: 'mp3$', fromMe: w}, (async (message, match) => {    
if (message.reply_message === false) return await message.client.sendMessage(message.jid, { text: '_Reply to a photo_' })
 const stream = await downloadContentFromMessage(message.reply_message.data.quotedMessage[message.reply_message.audio?'audioMessage':'videoMessage'],message.reply_message.audio?'audio':'video')
 let buffer = Buffer.from([])
 for await(const chunk of stream) {
  buffer = Buffer.concat([buffer, chunk])}
  await fs.writeFileSync(message.reply_message.audio?'./temp/tomp3.mp3':'./temp/tomp3.mp4', buffer)
  ffmpeg(message.reply_message.audio?'./temp/tomp3.mp3':'./temp/tomp3.mp4')
            .save('./temp/resmp3.mp3')
            .on('end', async () => {
await message.client.sendMessage(message.jid, { audio: fs.readFileSync('./temp/resmp3.mp3') }, { quoted: message.data, mimetype: Mimetype.mp4audio })
});
}));
     
