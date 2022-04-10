const {addCommand} = require('../events')
addCommand({pattern: 'kick', fromMe: true, desc: 'Is bot alive?'}, (async (message, match) => {
await message.client.sendMessage(message.jid, { text: '@'+message.reply_message.jid.split('@')[0] +' kicked!', mentions: [message.reply_message.jid] })
await message.client.groupParticipantsUpdate(message.jid, [message.reply_message.jid], "remove" /*replace this parameter with "remove", "demote" or "promote" */)
}))
addCommand({pattern: 'promote', fromMe: true, desc: 'Is bot alive?'}, (async (message, match) => {
await message.client.sendMessage(message.jid, { text: '@'+message.reply_message.jid.split('@')[0] +' is now an admin', mentions: [message.reply_message.jid] })
await message.client.groupParticipantsUpdate(message.jid, [message.reply_message.jid], "promote" /*replace this parameter with "remove", "demote" or "promote" */)
}))
addCommand({pattern: 'demote', fromMe: true, desc: 'Is bot alive?'}, (async (message, match) => {
await message.client.sendMessage(message.jid, { text: '@'+message.reply_message.jid.split('@')[0] +' is no longer an admin', mentions: [message.reply_message.jid] })
await message.client.groupParticipantsUpdate(message.jid, [message.reply_message.jid], "demote" /*replace this parameter with "remove", "demote" or "promote" */)
}))
addCommand({pattern: 'mute', fromMe: true, desc: 'Is bot alive?'}, (async (message, match) => {
await message.client.groupSettingUpdate(message.jid, 'announcement')
await message.client.sendMessage(message.jid, { text: '_Group muted_' })
}))
addCommand({pattern: 'unmute', fromMe: true, desc: 'Is bot alive?'}, (async (message, match) => {
await message.client.groupSettingUpdate(message.jid, 'not_announcement')
await message.client.sendMessage(message.jid, { text: '_Group unmuted_' })
}))
addCommand({pattern: 'log', fromMe: true, desc: 'Is bot alive?'}, (async (message, match) => {
console.log(message)
}))
