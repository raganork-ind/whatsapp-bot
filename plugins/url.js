// © Souravkl11 - Raganork MD™
/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const {Module} = require('../main');
const {MODE} = require('../config');
const {saveMessage} = require('./misc/saveMessage');
const {upload} = require('raganork-bot');
let a = MODE == 'public' ? false : true;
Module({pattern: 'url ?(.*)', fromMe: a, desc:'Uploads image to imgur.com'}, (async (m, match) => { 
if (!m.reply_message.image && !m.reply_message.video ) return;
await m.client.sendMessage(m.jid, {text: (await upload(await saveMessage(m.reply_message))).link }, { quoted: m.data });}));
