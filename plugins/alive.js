const {addCommand} = require('../events')
addCommand({pattern: 'alive', fromMe: true, desc: 'Is bot alive?'}, (async (message, match) => {
const templateButtons = [
  {index: 1, urlButton: {displayText: 'Official website', url: 'https://bit.ly/Raganork'}},
  {index: 2, urlButton: {displayText: 'Raganork Github', phoneNumber: 'https://github.com/souravkl11/raganork'}},
  {index: 3, quickReplyButton: {displayText: 'MENU', id: 'mdmenu'}},
  {index: 4, quickReplyButton: {displayText: 'COMMANDS', id: 'mdcmd'}}
]

const buttonMessage = {
    text: "Hey guys, this bot is under testing stage and will be available very soon for you!",
    footer: 'All rights reserved - souravkl11/raganork',
    templateButtons: templateButtons,
    image: {url: 'https://www.linkpicture.com/q/rgnk.jpg'}
}

await message.client.sendMessage(message.jid, buttonMessage)
}))
addCommand({on: 'button', fromMe: true, desc: 'Is bot alive?'}, (async (message, match) => {
	if (message.tembutton === 'mdcmd') await message.client.sendMessage(message.jid, { text: 'Commands will appear here!' },{ quoted: message.data })
	if (message.tembutton === 'mdmenu') await message.client.sendMessage(message.jid, { text: 'Menu will appear here!' },{ quoted: message.data })
 
}))
