const simpleGit = require('simple-git');
const git = simpleGit();
const {Module} = require('../main');
const {MessageType} = require('@adiwajshing/baileys');
const Config = require('../config');
const exec = require('child_process').exec;
const Heroku = require('heroku-client');
const { PassThrough } = require('stream');
const heroku = new Heroku({ token: Config.HEROKU.API_KEY })

Module({pattern: 'update check$', fromMe: true, dontAddCommandList: true, desc: "Updates bot"}, (async (message, match) => {
    await git.fetch();
    var commits = await git.log(['main' + '..origin/' + 'main']);
    if (commits.total === 0) {
        await message.client.sendMessage(message.jid, { text:"Bot up to date"})

    } else {
        var degisiklikler = "Updates are available";
        commits['all'].map(
            (commit) => {
                degisiklikler += '(' + commit.date.substring(0, 10) + ') : *' + commit.message.replace('Update','Fixed').replace('.js','') + '*\n';
            }
        );
        
        await message.client.sendMessage(message.jid, { text:degisiklikler})

    }
}));

Module({pattern: 'update start$', fromMe: true,dontAddCommandList: true, desc: Lang.UPDATE_NOW_DESC}, (async (message, match) => {
    await git.fetch();
    var commits = await git.log(['main' + '..origin/' + 'main']);
    if (commits.total === 0) {
        return await message.client.sendMessage(message.jid, { text:"Bot up to date"})

    } else {
        await message.client.sendMessage(message.jid, { text:"Build started"})

            try {
                var app = await heroku.get('/apps/' + Config.HEROKU.APP_NAME)
            } catch {
                await message.client.sendMessage(message.jid, { text:"Heroku information wrong!"})

                await new Promise(r => setTimeout(r, 1000));
            }
            git.fetch('upstream', 'main');
            git.reset('hard', ['FETCH_HEAD']);

            var git_url = app.git_url.replace(
                "https://", "https://api:" + Config.HEROKU.API_KEY + "@"
            )
            
            try {
                await git.addRemote('heroku', git_url);
            } catch { console.log('heroku remote ekli'); }
            await git.push('heroku', 'main');

            await message.client.sendMessage(message.jid, { text:"Successfully updated"})
           await message.client.sendMessage(message.jid, { text:"Restarting"})
            
        
    }
}));