/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const {
    Module 
} = require('../main');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const {
    saveMessage
} = require('./misc/saveMessage');
const Config = require('../config');
const {
    MODE,
    STICKER_DATA
} = require('../config');
const {
    getString
} = require('./misc/lang');
const {
    bass,
    sticker,
    addExif
} = require('./misc/misc');
const Lang = getString('converters');
let w = MODE == 'public' ? false : true
Module({
    pattern: 'sticker$',
    fromMe: w,
    desc: Lang.STICKER_DESC
}, (async (message, match) => {

    if (message.reply_message === false) return await message.sendMessage(Lang.STICKER_NEED_REPLY)
    var savedFile = await saveMessage(message.reply_message);
    var exif = {
        author: STICKER_DATA.split(";")[1] || "",
        packname: STICKER_DATA.split(";")[0] || "",
        categories: STICKER_DATA.split(";")[2] || "😂",
        android: "https://github.com/souravkl11/Raganork-md/",
        ios: "https://github.com/souravkl11/Raganork-md/"
    }
    if (message.reply_message.video === false && message.reply_message.image) {
        await message.sendReply(fs.readFileSync(await addExif(await sticker(savedFile),exif)), 'sticker')
        return;
    }
        await message.sendReply(fs.readFileSync(await addExif(await sticker(savedFile),exif)), 'sticker')
        return;
}));
Module({
    pattern: 'mp3$',
    fromMe: w,
    desc: Lang.MP3_DESC
}, (async (message, match) => {
    if (message.reply_message === false) return await message.sendReply(Lang.MP3_NEED_REPLY)
    var savedFile = await saveMessage(message.reply_message);
    ffmpeg(savedFile)
        .save('./temp/tomp3.mp3')
        .on('end', async () => {
            await message.client.sendMessage(message.jid, {
                audio: fs.readFileSync('./temp/tomp3.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            }, {
                quoted: message.data
            })
        });
}));
Module({
    pattern: 'bass ?(.*)',
    fromMe: Lang.BASS_DESC
}, (async (message, match) => {
    if (message.reply_message === false) return await message.sendReply(Lang.BASS_NEED_REPLY)
    var savedFile = await saveMessage(message.reply_message);
    bass(savedFile, match[1], async function(audio) {
        await message.client.sendMessage(message.jid, {
            audio: audio,
            mimetype: 'audio/mp4',
            ptt: false
        }, {
            quoted: message.data
        })
    });
}));
Module({
    pattern: 'photo$',
    fromMe: w,
    desc: Lang.PHOTO_DESC
}, (async (message, match) => {
    if (message.reply_message === false) return await message.sendMessage(Lang.PHOTO_NEED_REPLY)
        var savedFile = await saveMessage(message.reply_message);
        ffmpeg(savedFile)
            .fromFormat('webp_pipe')
            .save('output.png')
            .on('end', async () => {
                await message.sendReply(fs.readFileSync('output.png'), 'image');
            });
}));
