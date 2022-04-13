const {Module} = require('../main')
Module({pattern: 'kick', fromMe: true, desc: 'Removes participant'}, (async (message, match) => {
await message.client.sendMessage(message.jid, { text: '@'+message.reply_message.jid.split('@')[0] +' kicked!', mentions: [message.reply_message.jid] })
await message.client.groupParticipantsUpdate(message.jid, [message.reply_message.jid], "remove" /*replace this parameter with "remove", "demote" or "promote" */)
}))
Module({pattern: 'add', fromMe: true, desc: 'Adds participants to groups'}, (async (message, match) => {
var jids = [];
var msg = '';
numbers = match[1].split(',');
numbers.map((number) => {
msg += '@'+number+'\n'
jids.push(number+'@s.whatsapp.net');});
await message.client.groupParticipantsUpdate(message.jid, jids, "add")
await message.client.sendMessage(message.jid, { text: msg+' _Added to the group!_', mentions: jids })
}))
Module({pattern: 'promote', fromMe: true, desc: 'Makes participant an admin'}, (async (message, match) => {
await message.client.sendMessage(message.jid, { text: '@'+message.reply_message.jid.split('@')[0] +' is now an admin', mentions: [message.reply_message.jid] })
await message.client.groupParticipantsUpdate(message.jid, [message.reply_message.jid], "promote")
}))
Module({pattern: 'demote', fromMe: true, desc: 'Demotes participant'}, (async (message, match) => {
await message.client.sendMessage(message.jid, { text: '@'+message.reply_message.jid.split('@')[0] +' is no longer an admin', mentions: [message.reply_message.jid] })
await message.client.groupParticipantsUpdate(message.jid, [message.reply_message.jid], "demote")
}))
Module({pattern: 'mute', fromMe: true, desc: 'Allow only admins to msg in group'}, (async (message, match) => {
await message.client.groupSettingUpdate(message.jid, 'announcement')
await message.client.sendMessage(message.jid, { text: '_Group muted_' })
}))
Module({pattern: 'unmute', fromMe: true, desc: 'Allows all participants to msg in group'}, (async (message, match) => {
await message.client.groupSettingUpdate(message.jid, 'not_announcement')
await message.client.sendMessage(message.jid, { text: '_Group unmuted_' })
}))
Module({pattern: 'logm', fromMe: true}, (async (message, match) => {
console.log(message)
}))
Module({pattern: 'logt', fromMe: true}, (async (message, match) => {
console.log(message)
}))
