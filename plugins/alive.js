const {Module} = require('../main')
const {MODE} = require('../config');
let w = MODE=='public'?false:true
Module({pattern: 'list', fromMe: w, desc: 'Is bot alive?'}, (async (message, match) => {
const templateButtons = [
  {index: 1, urlButton: {displayText: 'Official website', url: 'https://bit.ly/Raganork'}},
  {index: 2, urlButton: {displayText: 'Raganork Github', url: 'https://github.com/souravkl11/raganork-md'}},
  {index: 3, quickReplyButton: {displayText: 'MENU', id: 'mdmenu'}},
  {index: 4, quickReplyButton: {displayText: 'COMMANDS', id: 'mdcmd'}}
]

const buttonMessage = {
    text: "Hey guys, this bot is under testing stage and will be available very soon for you!",
    footer: 'All rights reserved - souravkl11/raganork',
    templateButtons: templateButtons,
    image: {url: 'https://i.imgur.com/xerZo68.jpeg'}
}

await message.client.sendMessage(message.jid, buttonMessage)
}))
Module({on: 'button', fromMe: w, desc: 'Is bot alive?'}, (async (message, match) => {
await message.client.sendMessage(message.jid, { text: JSON.stringify(message) },{ quoted: message.data })	
if (message.tembutton === 'mdcmd') await message.client.sendMessage(message.jid, { text: 'Commands will appear here!' },{ quoted: message.data })
	if (message.tembutton === 'mdmenu') await message.client.sendMessage(message.jid, { text: 'Menu will appear here!' },{ quoted: message.data })
 
}))
Module({pattern: 'alive', fromMe: w, desc: 'Is bot alive?'}, (async (message, match) => {
await message.client.sendMessage(message.jid, { text: 'I am alive' },{ quoted: message.data })
 }))
Module({pattern: 'logm', fromMe: w, desc: 'Is bot alive?'}, (async (message, match) => {
await message.client.sendMessage(message.jid, { text: JSON.stringify(message.client.chats) },{ quoted: message.data })
 }))
Module({pattern: 'ping', fromMe: w, desc: 'Measures ping'}, (async (message, match) => {
const start = new Date().getTime()
		await message.client.sendMessage(message.jid, { text: '_Ping!_' })
                const end = new Date().getTime()
		await message.client.sendMessage(message.jid, { text: '*_Pong!_*\n ```' + (end - start) + '``` *_ms_*'},{ quoted: message.data })
}));
