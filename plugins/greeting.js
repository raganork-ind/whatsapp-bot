/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const {
    Module
} = require('../main');
const sql = require('./sql/greeting');
const Language = require('./misc/lang');
const Lang = Language.getString('greetings');

Module({
    pattern: 'welcome$',
    fromMe: true,
    desc: Lang.WELCOME_DESC
}, (async (message, match) => {
    var hg = await sql.getMessage(message.jid);
    if (hg === false) {
        await message.sendReply(Lang.NOT_SET_WELCOME);
    } else {
        await message.sendReply(Lang.WELCOME_ALREADY_SETTED + hg.message);
    }
}));
Module({
    pattern: 'welcome (.*)',
    fromMe: true,
    dontAddCommandList: true
}, (async (message, match) => {
    if (match[1] === 'delete') {
        await message.sendMessage(Lang.WELCOME_DELETED);
        return await sql.deleteMessage(message.jid, 'welcome');
    }
    await sql.setMessage(message.jid, 'welcome', match[1].replace(/&/g, '\n'));
    return await message.sendReply(Lang.WELCOME_SETTED)
}));
Module({
    pattern: 'goodbye$',
    fromMe: true,
    desc: Lang.GOODBYE_DESC
}, (async (message, match) => {
    var hg = await sql.getMessage(message.jid, 'goodbye');
    if (hg === false) {
        await message.sendReply(Lang.NOT_SET_GOODBYE)
    } else {
        await message.sendMessage(Lang.GOODBYE_ALREADY_SETTED + hg.message);
    }
}));
Module({
    pattern: 'goodbye (.*)',
    fromMe: true,
    dontAddCommandList: true
}, (async (message, match) => {
    if (match[1] === 'delete') {
        await message.sendReply(Lang.GOODBYE_DELETED);
        return await sql.deleteMessage(message.jid, 'goodbye');
    }
    await sql.setMessage(message.jid, 'goodbye', match[1].replace(/#/g, '\n'));
    return await message.sendMessage(Lang.GOODBYE_SETTED)
}));