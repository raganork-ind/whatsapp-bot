/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const {Module} = require('../main');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const {saveMessage} = require('./misc/saveMessage');
const {trim,AVmix} = require('raganork-bot');
const {MODE} = require('../config');
const {getString} = require('./misc/lang');
const {bass} = require('./misc/misc');
const Lang = getString('media');
const fromMe = MODE=='public'?false:true
Module({pattern: 'trim ?(.*)', fromMe: fromMe,desc: Lang.TRIM_DESC,usage: Lang.TRIM_USE}, async (message, match) => { 
if (match[1]===''||!message.reply_message||!message.reply_message.audio||!match[1].includes(";")) return await message.sendReply(Lang.TRIM_NEED);
    var savedFile = await saveMessage(message.reply_message);
    var trimmed = await trim(savedFile,match[1].split(";")[0],match[1].split(";")[1],'./temp/trim.mp3');
    var result = fs.readFileSync('./temp/trim.mp3');
    await message.client.sendMessage(message.jid, { audio: result,mimetype: 'audio/mp4',ptt: false }, { quoted: message.data })
});
Module({pattern: "avmix", fromMe: fromMe, desc: Lang.AVMIX_DESC},async (message, match) => {
if (!fs.existsSync("./temp/avmix")) {fs.mkdirSync("./temp/avmix")}
      let files = fs.readdirSync("./temp/avmix/")
      if ((!message.reply_message && files.length < 2) ||(message.reply_message && !message.reply_message.audio && !message.reply_message.video)) return await message.sendMessage(Lang.AVMIX_NEED_FILES);
      if (message.reply_message.audio) {
            var savedFile = await saveMessage(message.reply_message);
            await fs.writeFileSync(fs.readFileSync(savedFile),'./temp/avmix/audio.mp3');
            return await message.sendReply(Lang.AVMIX_AUDIO_ADDED) }
      if (message.reply_message.video) {
            var savedFile = await saveMessage(message.reply_message);
            await fs.writeFileSync(fs.readFileSync(savedFile),'./temp/avmix/video.mp4');
            return await message.sendReply(Lang.AVMIX_AUDIO_ADDED) }
            AVmix('./temp/avmix/video.mp4','./temp/avmix/audio.mp3','./temp/avmix/mixed.mp4',async function(video) {
                await message.sendMessage(video,'video');
                await fs.unlinkSync('./temp/avmix/video.mp4');
                await fs.unlinkSync('./temp/avmix/audio.mp3');
                await fs.unlinkSync('./temp/avmix/mixed.mp4');
                return;
                });   
    });