/* (c) coded by souravkl11 for
 Warn: souravkl11/raganork md 
You may not use this file except compliance with license! */
let {Module} = require('../main');
let {WARN} = require('../config');
let {setwarn,getwarn,deletewarn} = require('raganork-bot');
Module({pattern: 'warn ?(.*)', fromMe: true, desc:'Warns user. Removes user after maximum number of warns'}, (async (m, mat) => { 
if (!m.reply_message) return await m.client.sendMessage(m.jid, { text: '_Reply to any message_' },{ quoted: m.data })
var par = m.reply_message.jid
var me = m.client.user.id.split('@')[0].split(':')[0]
var chat = m.jid
if (!chat.endsWith('@g.us')) return await m.client.sendMessage(m.jid, { text: '_Only works in groups_' },{ quoted: m.data })
var warn = await setwarn(me,chat,par, parseInt(WARN))
var ms = 'Replied message';
if (m.reply_message.audio) ms = 'Audio Message'
if (m.reply_message.sticker) ms = 'Sticker Message'
if (m.reply_message.text) ms = m.reply_message.text
if (m.reply_message.video) ms = 'Video Message'
if (m.reply_message.image) ms = 'Image Message'
if (m.reply_message.data.quotedMessage.listMessage) ms = 'List message'
var reason = mat[1] ? mat[1] : ms
var msg = "```Warning ⚠️```"+ '\n' +
"*User:* " +'@'+par.split('@')[0] + '\n' +
"*Reason:* " + reason+ '\n' +
"*Remaining:* "  + warn + '\n' 
if (warn !== 0) {
    return await m.client.sendMessage(m.jid, { text: msg ,mentions:[par]},{ quoted: m.data })
} else {
    await m.client.sendMessage(m.jid, { text: 'Warn limit ('+WARN+') of '+par+' exceeded. Removing participant ❌' ,mentions:[par]},{ quoted: m.data })
    await m.client.groupParticipantsUpdate(m.jid, [par], "remove")
 }
}));
Module({pattern: 'reset warn', fromMe: true, desc:'Resets the warn count of the user'}, (async (m, mat) => { 
    if (!m.reply_message) return await m.sendMessage('_Reply to any message!_')
        var par = m.reply_message.jid
    var me =  m.client.user.id.split('@')[0].split(':')[0]
    var chat = m.jid
if (!chat.endsWith('@g.us')) return await m.client.sendMessage(m.jid, { text: '_Only works in groups_' },{ quoted: m.data })
 await deletewarn(me,chat,par)
    return await m.client.sendMessage(m.jid, { text: 'Successfully reset warn limits of @'+par.split('@')[0] ,mentions:[par]},{ quoted: m.data })
}));
