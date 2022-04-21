const {Module} = require('../main')
const {MODE,ALIVE} = require('../config');
const {parseAlive} = require('./misc/misc');
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
if (message.tembutton === 'mdcmd') await message.sendReply('Type .list for commands!');
	if (message.tembutton === 'mdmenu') await message.sendReply('Menu will appear here!')
 
}))
Module({pattern: 'alive', fromMe: w, desc: 'Is bot alive?'}, (async (message, match) => {
await parseAlive(message,ALIVE)
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
