const fs = require('fs');
const { Sequelize } = require('sequelize');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });
function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
DATABASE_URL = process.env.DATABASE_URL === undefined ? './bot.db' : process.env.DATABASE_URL;
DEBUG = process.env.DEBUG === undefined ? false : convertToBool(process.env.DEBUG);
module.exports = {
    VERSION: 'V0.0.5',
    ALIVE: process.env.ALIVE === undefined ? "{image/https://i.imgur.com/KCnoMM2.jpg} Hey there, I'm alive \n Uptime: {uptime}" : process.env.ALIVE,
    BLOCK_CHAT: process.env.BLOCK_CHAT === undefined ? "" : process.env.BLOCK_CHAT,
    READ_MESSAGES: process.env.READ_MESSAGES === undefined ? false : convertToBool(process.env.READ_MESSAGES),
    READ_COMMAND: process.env.READ_COMMAND === undefined ? true : convertToBool(process.env.READ_COMMAND),
    USERNAME: process.env.USERNAME === undefined ? '' : process.env.USERNAME,
    PASSWORD: process.env.PASSWORD === undefined ? '' : process.env.PASSWORD,
    HANDLERS: process.env.HANDLERS === undefined ? '^[.,]' : process.env.HANDLERS,
    STICKER_DATA: process.env.STICKER_DATA === undefined ? 'ꪶ͢٭𝑺𝜣𝑼𝑹𝛢𝑽𝑲𝑳¹¹ꫂ' : process.env.STICKER_DATA,
    AUDIO_DATA: process.env.AUDIO_DATA === undefined ? 'ꪶ͢٭𝑺𝜣𝑼𝑹𝛢𝑽𝑲𝑳¹¹ꫂ;Raganork MD bot;https://www.linkpicture.com/q/rgnk.jpg' : process.env.AUDIO_DATA,
    TAKE_KEY: process.env.TAKE_KEY === undefined ? '' : process.env.TAKE_KEY,
    MODE: process.env.MODE === undefined ? 'private' : process.env.MODE,
    WARN: process.env.WARN === undefined ? '4' : process.env.WARN,
    HEROKU: {
        HEROKU: process.env.HEROKU === undefined ? false : convertToBool(process.env.HEROKU),
        API_KEY: process.env.HEROKU_API_KEY === undefined ? '' : process.env.HEROKU_API_KEY,
        APP_NAME: process.env.HEROKU_APP_NAME === undefined ? '' : process.env.HEROKU_APP_NAME
    },
    DATABASE_URL: DATABASE_URL,
    DATABASE: DATABASE_URL === './bot.db' ? new Sequelize({ dialect: "sqlite", storage: DATABASE_URL, logging: DEBUG }) : new Sequelize(DATABASE_URL, { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }, logging: DEBUG }),
    SUDO: process.env.SUDO === undefined ? '916282344739,0' : process.env.SUDO,
    LANGUAGE: process.env.LANGUAGE === undefined ? 'english' : process.env.LANGUAGE,
    DEBUG: DEBUG
    };
