const {Module} = require('../main')
async function isAdmin(message, user = message.client.user.jid) {
    var metadata = await message.client.groupMetadata(message.jid);
    var m = metadata.participants.map((member) => {
    if (member.jid.split("@")[0] == user.split("@")[0] && member.isAdmin) return true; else; return false;});
    return m.includes(true);
}
Module({pattern: 'kick ?(.*)', fromMe: true, desc: 'Removes participant'}, (async (message, match) => {
var admin = await isAdmin(message);
if (!isAdmin) return await message.client.sendMessage(message.jid, { text: '_Bot is not an admin_' },{quoted: message.data})
const user = message.mention[0] || message.reply_message.jid
await message.client.sendMessage(message.jid, { text: '@'+user.split('@')[0] +' kicked!', mentions: [user] })
await message.client.groupParticipantsUpdate(message.jid, [user], "remove" /*replace this parameter with "remove", "demote" or "promote" */)
}))
Module({pattern: 'add ?(.*)', fromMe: true, desc: 'Adds participants to groups'}, (async (message, match) => {
var admin = await isAdmin(message);
if (!isAdmin) return await message.client.sendMessage(message.jid, { text: '_Bot is not an admin_' },{quoted: message.data})
var init = match[1]
var initt = init.split(" ").join("")
var user = initt.replace(/\+/g,'').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(/\(/g,'').replace(/\)/g,'').replace(/-/g,'')
var jids = [];
var msg = '';
numbers = user.split(',');
numbers.map((number) => {
msg += '@'+number+'\n'
jids.push(number+'@s.whatsapp.net');});
await message.client.groupParticipantsUpdate(message.jid, jids, "add")
await message.client.sendMessage(message.jid, { text: msg+' _Added to the group!_', mentions: jids })
}))
Module({pattern: 'promote', fromMe: true, desc: 'Makes participant an admin'}, (async (message, match) => {
var admin = await isAdmin(message);
if (!isAdmin) return await message.client.sendMessage(message.jid, { text: '_Bot is not an admin_' },{quoted: message.data})
await message.client.sendMessage(message.jid, { text: '@'+message.reply_message.jid.split('@')[0] +' is now an admin', mentions: [message.reply_message.jid] })
await message.client.groupParticipantsUpdate(message.jid, [message.reply_message.jid], "promote")
}))
Module({pattern: 'leave', fromMe: true, desc: 'Leaves from group'}, (async (message, match) => {
await message.client.sendMessage(message.jid, { text: "_I'm leaving, bye!_"})
return await message.client.groupLeave(message.jid);
}))
Module({pattern: 'demote', fromMe: true, desc: 'Demotes participant'}, (async (message, match) => {
var admin = await isAdmin(message);
if (!isAdmin) return await message.client.sendMessage(message.jid, { text: '_Bot is not an admin_' },{quoted: message.data})
await message.client.sendMessage(message.jid, { text: '@'+message.reply_message.jid.split('@')[0] +' is no longer an admin', mentions: [message.reply_message.jid] })
await message.client.groupParticipantsUpdate(message.jid, [message.reply_message.jid], "demote")
}))
Module({pattern: 'mute', fromMe: true, desc: 'Allow only admins to msg in group'}, (async (message, match) => {
var admin = await isAdmin(message);
if (!isAdmin) return await message.client.sendMessage(message.jid, { text: '_Bot is not an admin_' },{quoted: message.data})
await message.client.groupSettingUpdate(message.jid, 'announcement')
await message.client.sendMessage(message.jid, { text: '_Group muted_' })
}))
Module({pattern: 'unmute', fromMe: true, desc: 'Allows all participants to msg in group'}, (async (message, match) => {
var admin = await isAdmin(message);
if (!isAdmin) return await message.client.sendMessage(message.jid, { text: '_Bot is not an admin_' },{quoted: message.data})
await message.client.groupSettingUpdate(message.jid, 'not_announcement')
await message.client.sendMessage(message.jid, { text: '_Group unmuted_' })
}))
Module({pattern: 'jid', fromMe: true, desc: 'Gives chat jid'}, (async (message, match) => {
var jid = message.reply_message.jid || message.jid
await message.client.sendMessage(message.jid, { text:jid},{quoted: message.data})
}))
Module({pattern: 'invite', fromMe: true, desc: 'Gives group invite link'}, (async (message, match) => {
var admin = await isAdmin(message);
if (!isAdmin) return await message.client.sendMessage(message.jid, { text: '_Bot is not an admin_' },{quoted: message.data})
var code = await message.client.groupInviteCode(message.jid)
await message.client.sendMessage(message.jid, { text: "Group invite link: "+code })
}))
Module({pattern: 'revoke', fromMe: true, desc: 'Resets group invite link'}, (async (message, match) => {
var admin = await isAdmin(message);
if (!isAdmin) return await message.client.sendMessage(message.jid, { text: '_Bot is not an admin_' },{quoted: message.data})
await message.client.groupRevokeInvite(message.jid)
await message.client.sendMessage(message.jid, { text: '_Group link reset!_' })
}))
Module({pattern: 'tagall', fromMe: true, desc: 'Tags all participants in a group'}, (async (message, match) => {
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
