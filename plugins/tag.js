/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const {Module} = require('../main')
const {getString} = require('./misc/lang');
const {readFileSync} = require('fs');
const {saveMessage} = require('./misc/saveMessage');
const Lang = getString('group');
Module({pattern: 'tag', fromMe: true, desc: Lang.TAGALL_DESC}, (async (message, match) => {
if (!message.jid.endsWith('@g.us')) return await message.sendMessage(Lang.GROUP_COMMAND)
var group = await message.client.groupMetadata(message.jid)
var jids = [];
group.participants.map(async(user) => {
jids.push(user.id.replace('c.us', 's.whatsapp.net'));});
if (message.reply_message.data.quotedMessage.hasOwnProperty('listMessage')) return await message.client.sendMessage(message.jid,message.reply_message.data.quotedMessage.listMessage,{mentions: jids})
if (message.reply_message.data.quotedMessage.hasOwnProperty('extendedTextMessage')) {
return await message.client.sendMessage(message.jid, { text: message.reply_message.data.quotedMessage.extendedTextMessage.text, mentions: jids})
}
var savedFile = await saveMessage(message.reply_message);
if (message.reply_message.image) var type = 'image' 
if (message.reply_message.video) var type = 'video' 
if (message.reply_message.audio) var type = 'audio' 
if (message.reply_message.sticker) var type = 'sticker' 
if (message.reply_message.text) var type = 'text' 
if (message.reply_message.text) savedFile = message.reply_message.text 
var msg = savedFile.startsWith("./temp") ? readFileSync(savedFile) : savedFile;
await message.client.sendMessage(message.jid, { [type]: msg, mentions: jids})
}))