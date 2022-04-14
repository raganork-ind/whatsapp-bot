// © Souravkl11 - Raganork MD™
const {Module} = require('../main');
const {MODE} = require('../config');
const {saveMessage} = require('./misc/saveMessage');
const {upload} = require('raganork-bot');
let a = MODE == 'public' ? false : true;
e.addCommand({pattern: 'url ?(.*)', fromMe: a, desc:'Uploads image to imgur.com'}, (async (m, match) => { 
if (!m.reply_message.image && !m.reply_message.video ) return;
await m.client.sendMessage(m.jid, {text: (await upload(await saveMessage(m.reply_message))).link }, { quoted: m.data });}));
