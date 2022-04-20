const {getString} = require('./misc/lang');
const Lang = getString('group');
const {Module} = require('../main')
async function isAdmin(message, user = message.client.user.id) {
var metadata = await message.client.groupMetadata(message.jid);
var admins = metadata.participants.filter(v => v.admin !== null).map(x => x.id)
return admins.includes(user.split('@')[0]);}
function mentionjid(jid){ return "@"+jid.split("@")[0].split(":")[0]; }
Module({pattern: 'kick ?(.*)', fromMe: true, desc: Lang.KICK_DESC}, (async (message, match) => {
if (!message.jid.endsWith('@g.us')) return await message.sendMessage(Lang.GROUP_COMMAND)
var admin = await isAdmin(message);
if (!admin) return await message.sendReply(Lang.NOT_ADMIN)
const user = message.mention[0] || message.reply_message.jid
if (!user) return await message.sendReply(Lang.NEED_USER)
await message.client.sendMessage(message.jid, { text: mentionjid(user) + Lang.KICKED, mentions: [user] })
await message.client.groupParticipantsUpdate(message.jid, [user], "remove" /*replace this parameter with "remove", "demote" or "promote" */)
}))
Module({pattern: 'add ?(.*)', fromMe: true, desc: Lang.ADD_DESC}, (async (message, match) => {
if (!message.jid.endsWith('@g.us')) return await message.sendMessage(Lang.GROUP_COMMAND)
var admin = await isAdmin(message);
if (!admin) return await message.sendReply(Lang.NOT_ADMIN)
var init = match[1]
if (!init) return await message.sendReply(Lang.NEED_USER)
var initt = init.split(" ").join("")
var user = initt.replace(/\+/g,'').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(/\(/g,'').replace(/\)/g,'').replace(/-/g,'')
var jids = [];
var msg = '';
numbers = user.split(',');
numbers.map((number) => {
msg += '@'+number+'\n'
jids.push(number+'@s.whatsapp.net');});
await message.client.groupParticipantsUpdate(message.jid, jids, "add")
await message.client.sendMessage(message.jid, { text: msg+' '+Lang.ADDED, mentions: jids })
}))
Module({pattern: 'promote', fromMe: true, desc: Lang.PROMOTE_DESC}, (async (message, match) => {
if (!message.jid.endsWith('@g.us')) return await message.sendMessage(Lang.GROUP_COMMAND)
var admin = await isAdmin(message);
if (!admin) return await message.sendReply(Lang.NOT_ADMIN)
await message.client.sendMessage(message.jid, { text: mentionjid(message.reply_message.jid) +' '+Lang.PROMOTED, mentions: [message.reply_message.jid] })
await message.client.groupParticipantsUpdate(message.jid, [message.reply_message.jid], "promote")
}))
Module({pattern: 'leave', fromMe: true, desc: Lang.LEAVE_DESC}, (async (message, match) => {
await message.client.sendMessage(message.jid, { text: Lang.LEAVING})
return await message.client.groupLeave(message.jid);
}))
Module({pattern: 'demote', fromMe: true, desc: Lang.DEMOTE_DESC}, (async (message, match) => {
    if (!message.jid.endsWith('@g.us')) return await message.sendMessage(Lang.GROUP_COMMAND)
    var admin = await isAdmin(message);
    if (!admin) return await message.sendReply(Lang.NOT_ADMIN)
    await message.client.sendMessage(message.jid, { text: mentionjid(message.reply_message.jid) +' '+Lang.DEMOTED, mentions: [message.reply_message.jid] })
await message.client.groupParticipantsUpdate(message.jid, [message.reply_message.jid], "demote")
}))
Module({pattern: 'mute', fromMe: true, desc: Lang.MUTE_DESC}, (async (message, match) => {
    if (!message.jid.endsWith('@g.us')) return await message.sendMessage(Lang.GROUP_COMMAND)
    var admin = await isAdmin(message);
    if (!admin) return await message.sendReply(Lang.NOT_ADMIN)
    await message.client.groupSettingUpdate(message.jid, 'announcement')
await message.sendMessage(Lang.MUTED)
}))
Module({pattern: 'unmute', fromMe: true, desc: Lang.UNMUTE_DESC}, (async (message, match) => {
    if (!message.jid.endsWith('@g.us')) return await message.sendMessage(Lang.GROUP_COMMAND)
    var admin = await isAdmin(message);
    if (!admin) return await message.sendReply(Lang.NOT_ADMIN)
    await message.client.groupSettingUpdate(message.jid, 'not_announcement')
await message.sendMessage(Lang.UNMUTED)
}))
Module({pattern: 'jid', fromMe: true, desc: Lang.JID_DESC}, (async (message, match) => {
var jid = message.reply_message.jid || message.jid
await message.sendReply(jid)
}))
Module({pattern: 'invite', fromMe: true, desc: Lang.INVITE_DESC}, (async (message, match) => {
if (!message.jid.endsWith('@g.us')) return await message.sendMessage(Lang.GROUP_COMMAND)
var admin = await isAdmin(message);
if (!admin) return await message.sendReply(Lang.NOT_ADMIN)
var code = await message.client.groupInviteCode(message.jid)
await message.client.sendMessage(message.jid, { text: Lang.INVITE+' '+code })
}))
Module({pattern: 'revoke', fromMe: true, desc: Lang.REVOKE_DESC}, (async (message, match) => {
if (!message.jid.endsWith('@g.us')) return await message.sendMessage(Lang.GROUP_COMMAND)
var admin = await isAdmin(message);
if (!admin) return await message.sendReply(Lang.NOT_ADMIN)
await message.client.groupRevokeInvite(message.jid)
await message.sendMessage(Lang.REVOKED)
}))
Module({pattern: 'tagall', fromMe: true, desc: Lang.TAGALL_DESC}, (async (message, match) => {
if (!message.jid.endsWith('@g.us')) return await message.sendMessage(Lang.GROUP_COMMAND)
var group = await message.client.groupMetadata(message.jid)
var jids = [];
var mn = '';
group.participants.map(async(user) => {
mn += '@' + user.id.split('@')[0] + '\n';
jids.push(user.id.replace('c.us', 's.whatsapp.net'));});
var msg = message.reply_message.message || mn
await message.client.sendMessage(message.jid, { text: msg, mentions: jids})
}))
module.exports = {
    isAdmin: isAdmin
};
