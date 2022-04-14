/* (c) souravkl11/raganork-md
You may not use this file except compliance with license!*/
let {saveMessage} = require('./misc/saveMessage');
let {Module} = require('../main');
let {TAKE_KEY,STICKER_DATA,MODE,HEROKU,AUDIO_DATA} = require('../config');
let {addInfo,skbuffer,sticker,stickercrop,webp2mp4} = require('raganork-bot');
let a = MODE == 'public' ? false : true;
let ffmpeg = require('fluent-ffmpeg');
const h = require('heroku-client');
const he = new h({token: HEROKU.API_KEY});
let ur = '/apps/' + HEROKU.APP_NAME;
Module({pattern: 'take ?(.*)', fromMe: a, desc:'Changes sticker/audio pack & author name. Title, artist, thumbnail etc.'}, (async (m, match) => { 
if (!m.reply_message.data.quotedMessage) return await m.sendMessage('_Reply to an audio or a sticker_')
var audiomsg = m.reply_message.audio;
var stickermsg = m.reply_message.sticker;
var q = await saveMessage(m.reply_message);
if (stickermsg) {
let inf = match[1] ? match[1] : STICKER_DATA        
var s = inf.split('|');
var au = s[1] ? s[1] : STICKER_DATA.split('|')[1]
var p =  s[0] ? s[0] : STICKER_DATA.split('|')[0]
if (!TAKE_KEY) return await m.client.sendMessage(m.jid,{text:'_No API key given! Get your key from https://api.imgbb.com/ and add setvar TAKE_KEY:key_'})
var res = await sticker(q,au,p,TAKE_KEY)
await m.client.sendMessage(m.jid, {sticker: await skbuffer(res)},{quoted:m.data});
} 
if (!stickermsg && audiomsg) {
ffmpeg(q)
.save('info.mp3')
.on('end', async () => {
let inf = match[1] ? match[1] : AUDIO_DATA        
var spl = inf.split(';')
let im = spl[2].startsWith('http') ? spl[2] : ''
let tit = spl[0] ? spl[0] : AUDIO_DATA.split(';')[0]
let auth = spl[1] ? spl[1] : AUDIO_DATA.split(';')[1]
var res = await addInfo('info.mp3',tit,auth,'Raganork Engine', await skbuffer(im))
await m.client.sendMessage(m.jid, { audio: res},{quoted:m.data,ptt: false});});}
if (!audiomsg && !stickermsg) return await m.client.sendMessage(m.jid, {text:'_Reply to an audio or a sticker_'},{quoted: m.data})}));
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
Module({pattern: 'mp4 ?(.*)', fromMe: a, desc:'Converts animated sticker to video'}, (async (m, t) => { 
if (m.reply_message.sticker && m.reply_message.animated === true) {
var q = await saveMessage(m.reply_message);
await m.client.sendMessage(m.jid, {video: await webp2mp4(!TAKE_KEY?'4bc0575f8bb479527cd1d13a194c3fed':TAKE_KEY,q)},{quoted:m.data});
} else return await m.client.sendMessage(m.jid,{text:'_Reply to an animated sticker!_'});
}));
    
