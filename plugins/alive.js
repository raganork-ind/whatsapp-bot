/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const {
  Module
} = require('../main')
const {
  MODE,
  ALIVE
} = require('../config');
const {
  parseAlive
} = require('./misc/misc');
let w = MODE == 'public' ? false : true
Module({
  pattern: 'menu',
  fromMe: w,
  desc: 'Is bot alive?'
}, (async (message, match) => {
  const templateButtons = [{
          index: 1,
          urlButton: {
              displayText: 'Github',
              url: 'https://github.com/souravkl11/raganork-md'
          }
      },
      {
          index: 2,
          quickReplyButton: {
              displayText: 'MENU',
              id: 'mdmenu'
          }
      },
      {
          index: 3,
          quickReplyButton: {
              displayText: 'COMMANDS',
              id: 'mdcmd'
          }
      }
  ]

  const buttonMessage = {
      text: `Hello ${message.data.pushName}, type .list for commands`,
      footer: 'Hey, if you have any ideas or styles for this menu message, feel free to contact developer',
      templateButtons: templateButtons
  }

  await message.client.sendMessage(message.jid, buttonMessage)
}))
Module({
  on: 'button',
  fromMe: w,
  desc: 'Is bot alive?'
}, (async (message, match) => {
  if (message.tembutton === 'mdcmd') await message.sendReply('Type .list for commands!');
  if (message.tembutton === 'mdmenu') await message.sendReply('Menu will appear here!')

}))
Module({
  pattern: 'alive',
  fromMe: w,
  desc: 'Is bot alive?'
}, (async (message, match) => {
  await parseAlive(message, ALIVE)
}))
Module({
  pattern: 'logm',
  fromMe: w,
  desc: 'Is bot alive?'
}, (async (message, match) => {
  await message.client.sendMessage(message.jid, {
      text: JSON.stringify(message.client.chats)
  }, {
      quoted: message.data
  })
}))
Module({
  pattern: 'ping',
  fromMe: w,
  desc: 'Measures ping'
}, (async (message, match) => {
  const start = new Date().getTime()
  await message.client.sendMessage(message.jid, {
      text: '_Ping!_'
  })
  const end = new Date().getTime()
  await message.client.sendMessage(message.jid, {
      text: '*_Pong!_*\n ```' + (end - start) + '``` *_ms_*'
  }, {
      quoted: message.data
  })
}));