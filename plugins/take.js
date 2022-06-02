/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
let {
    saveMessage
} = require('./misc/saveMessage');
const {
    sticker,
    addExif
} = require('./misc/misc');
let {
    Module
} = require('../main');
let {
    TAKE_KEY,
    STICKER_DATA,
    MODE,
    HEROKU,
    AUDIO_DATA
} = require('../config');
let {
    addInfo,
    skbuffer,
    stickercrop,
    webp2mp4
} = require('raganork-bot');
let a = MODE == 'public' ? false : true;
let ffmpeg = require('fluent-ffmpeg');
let fs = require('fs');
const h = require('heroku-client');
const he = new h({
    token: HEROKU.API_KEY
});
let ur = '/apps/' + HEROKU.APP_NAME;
Module({
    pattern: 'take ?(.*)',
    fromMe: a,
    desc: 'Changes sticker/audio pack & author name. Title, artist, thumbnail etc.'
}, (async (m, match) => {
    if (!m.reply_message.data.quotedMessage) return await m.sendMessage('_Reply to an audio or a sticker_')
    var audiomsg = m.reply_message.audio;
    var stickermsg = m.reply_message.sticker;
    var q = await saveMessage(m.reply_message);
    if (stickermsg) {
        if (match[1]!=="") {
        var exif = {
            author: match[1].includes(";")?match[1].split(";")[1]:"",
            packname: match[1].includes(";")?match[1].split(";")[0]:match[1],
            categories: STICKER_DATA.split(";")[2] || "😂",
            android: "https://github.com/souravkl11/Raganork-md/",
            ios: "https://github.com/souravkl11/Raganork-md/"
        } }
        else {
            var exif = {
                author: STICKER_DATA.split(";")[1] || "",
                packname: STICKER_DATA.split(";")[0] || "",
                categories: STICKER_DATA.split(";")[2] || "😂",
                android: "https://github.com/souravkl11/Raganork-md/",
                ios: "https://github.com/souravkl11/Raganork-md/"
            }
        }
        return await m.sendReply(fs.readFileSync(await addExif(q,exif)),'sticker')
    }
    if (!stickermsg && audiomsg) {
                let inf = match[1] !== '' ? match[1] : AUDIO_DATA
                var spl = inf.split(';')
                var image = spl[2]?await skbuffer(spl[2]):''
                var res = await addInfo(q,spl[0],spl[1], 'Raganork Engine', image)
                await m.client.sendMessage(m.jid, {
                    audio: res,
                    mimetype: 'audio/mp4',
                }, {
                    quoted: m.data,
                    ptt: false
                });
    }
    if (!audiomsg && !stickermsg) return await m.client.sendMessage(m.jid, {
        text: '_Reply to an audio or a sticker_'
    }, {
        quoted: m.data
    })
}));
/*addCommand({pattern: 'wm ?(.*)', fromMe: a, desc:'Sets sticker pack & author name with given ones.'}, (async (m, t) => { 
var q = await m.client.downloadAndSaveMediaMessage({key: {remoteJid: m.reply_message.jid,id: m.reply_message.id},message: m.reply_message.data.quotedMessage});
var au,p;
if (t[1].includes('|')) {
var s = t[1].split('|');
au = s[1];
p = s[0];}
else {p = t[1]}
var res = await sticker(q,au,p,w.take_key,v)
await m.client.sendMessage(m.jid, await skbuffer(res),MessageType.sticker,{quoted:m.data});}));
addCommand({pattern: 'crop ?(.*)', fromMe: a, desc:'Crops sticker'}, (async (m, t) => { 
var q = await m.client.downloadAndSaveMediaMessage({key: {remoteJid: m.reply_message.jid,id: m.reply_message.id},message: m.reply_message.data.quotedMessage});
var au,p;
var s = w.SOURAVKL11.split('|');
var au = s[1];
var p = s[0];
var res = await stickercrop(q,au,p,v)
await m.client.sendMessage(m.jid, await skbuffer(res),MessageType.sticker,{quoted:m.data});}));
addCommand({ pattern: 'setexif ?(.*)', fromMe: true}, (async (m, qu) => {
if (!qu[1]) {return await m.client.sendMessage(m.jid,'_Need some data \n Example: \n .setexif Name|Author_',MessageType.text,{quoted:m.data})}
await m.client.sendMessage(m.jid, '_Added new exif!_',MessageType.text,{quoted:m.data});
await he.patch(ur + '/config-vars', { body: {['STICKER_DATA']: qu[1]}});}));
addCommand({ pattern: 'audinfo ?(.*)', fromMe: true}, (async (m, qu) => {
if (!qu[1]) {return await m.client.sendMessage(m.jid,'_Need some data like: *.audinfo Title;Artist;Imagelink*_',MessageType.text,{quoted:m.data})}
await m.client.sendMessage(m.jid, '_Added new audio info!_',MessageType.text,{quoted:m.data});
await he.patch(ur + '/config-vars', { body: {['AUDIO_DATA']: qu[1]}});}));
*/
Module({
    pattern: 'mp4 ?(.*)',
    fromMe: a,
    desc: 'Converts animated sticker to video'
}, (async (m, t) => {
    if (m.reply_message.sticker) {
        var q = await saveMessage(m.reply_message);
        try {
            var result = await webp2mp4(q)
        } catch {
            return await m.sendReply("*Failed*")
        }
        await m.sendReply({
            url: result
        }, 'video');
    } else return await m.sendReply('_Reply to an animated sticker!_');
}));
