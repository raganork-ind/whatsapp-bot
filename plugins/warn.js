/* (c) coded by souravkl11 for
 Warn: souravkl11/raganork md 
You may not use this file except compliance with license! */
let {Module} = require('../main');
let {WARN} = require('../config');
let {getString} = require('./misc/lang');
let Lang = getString('group');
let {setWarn,resetWarn,mentionjid} = require('./misc/misc');
Module({pattern: 'warn', fromMe: true, desc:Lang.WARN_DESC}, (async (m, mat) => { 
var user = m.mention[0] || m.reply_message.jid
if (!user) return await m.sendReply(Lang.NEED_USER)
if (!m.jid.endsWith('@g.us')) return await m.sendReply(Lang.GROUP_COMMAND)
var warn = await setWarn(m.jid,user,parseInt(WARN))
var ms = 'Replied message';
if (m.mention[0]) ms = 'Not defined'
if (m.reply_message.audio) ms = 'Audio Message'
if (m.reply_message.sticker) ms = 'Sticker Message'
if (m.reply_message.text) ms = m.reply_message.text
if (m.reply_message.video) ms = 'Video Message'
if (m.reply_message.image) ms = 'Image Message'
if (m.reply_message.data.quotedMessage.listMessage) ms = 'List message'
var reason = mat[1] ? mat[1].replace(mentionjid(user),"") : ms
var msg = Lang.WARNING + '\n' +
Lang.USER+mentionjid(user)+ '\n' +
Lang.REASON+ reason+ '\n' +
Lang.REMAINING+ warn + '\n' 
if (warn !== 0) {
    return await m.client.sendMessage(m.jid, { text: msg ,mentions:[user]},{ quoted: m.data })
} else {
    await m.sendMessage(Lang.WARN_OVER)
    await m.client.sendMessage(m.jid,{text: mentionjid(user)+Lang.KICKED, mentions: [user] })
    await m.client.groupParticipantsUpdate(m.jid, [user], "remove")
 }
}));
Module({pattern: 'reset warn', fromMe: true, desc:'Resets the warn count of the user'}, (async (m, mat) => { 
var user = m.mention[0] || m.reply_message.jid
if (!user) return await m.sendReply(Lang.NEED_USER)
if (!m.jid.endsWith('@g.us')) return await m.sendReply(Lang.GROUP_COMMAND)
await resetWarn(m.jid,user)
return await m.client.sendMessage(m.jid,{text:Lang.WARN_OVER+ mentionjid(user), mentions: [user] })
}));
