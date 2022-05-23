/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
let {Module} = require('../main');
let {WARN,ANTILINK_WARN} = require('../config');
let {getString} = require('./misc/lang');
let {isAdmin} = require('./misc/misc');
let Lang = getString('group');
let {setWarn,resetWarn,mentionjid} = require('./misc/misc');
Module({pattern: 'warn ?(.*)', fromMe: true, desc:Lang.WARN_DESC}, (async (m, mat) => { 
if (m.message.includes(Lang.REMAINING)) return;
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
var msg = "⚠️ "+Lang.WARNING + ' ⚠️\n' +
Lang.USER+mentionjid(user)+ '\n' +
Lang.REASON+ reason+ '\n' +
Lang.REMAINING+ warn + '\n' 
if (warn !== 0) {
    return await m.client.sendMessage(m.jid, { text: msg ,mentions:[user]},{ quoted: m.data })
} else {
        await m.sendMessage(Lang.WARN_OVER.format(WARN,mentionjid(user).replace("@","")))
    await m.client.sendMessage(m.jid,{text: mentionjid(user)+Lang.KICKED, mentions: [user] })
    await m.client.groupParticipantsUpdate(m.jid, [user], "remove")
 }
}));
Module({pattern: 'reset warn', fromMe: true, desc:'Resets the warn count of the user'}, (async (m, mat) => { 
var user = m.mention[0] || m.reply_message.jid
if (!user) return await m.sendReply(Lang.NEED_USER)
if (!m.jid.endsWith('@g.us')) return await m.sendReply(Lang.GROUP_COMMAND)
try { await resetWarn(m.jid,user) } catch { return await m.sendReply("error")}
return await m.client.sendMessage(m.jid,{text:Lang.WARN_RESET.format(WARN,mentionjid(user)), mentions: [user] })
}));
Module({on: 'text', fromMe: false}, (async (m, mat) => { 
    if (!ANTILINK_WARN.split(",").includes(m.jid)) return;
    var matches = m.message.match(/\bhttps?:\/\/\S+/gi);
    if (matches && matches[0].includes(".")) {
    var user = m.sender
    var admin = await isAdmin(m,m.sender);
    if (admin) return;
    if (!user) return await m.sendReply(Lang.NEED_USER)
    if (!m.jid.endsWith('@g.us')) return await m.sendReply(Lang.GROUP_COMMAND)
    var warn = await setWarn(m.jid,user,parseInt(WARN))
    var reason = matches.join(", ");
    var msg = "Antilink "+Lang.WARNING + '\n' +
    Lang.USER+mentionjid(user)+ '\n' +
    Lang.REASON+ reason+ '\n' +
    Lang.REMAINING+ warn + '\n' 
    if (warn !== 0) {
        return await m.client.sendMessage(m.jid, { text: msg ,mentions:[user]},{ quoted: m.data })
    } else {
        var admin = await isAdmin(m,m.sender);
        await m.sendMessage(Lang.WARN_OVER.format(WARN,mentionjid(user).replace("@","")))
        await m.client.sendMessage(m.jid,{text: mentionjid(user)+Lang.KICKED, mentions: [user] })
        await m.client.groupParticipantsUpdate(m.jid, [user], "remove")
     }
    }
    }));
