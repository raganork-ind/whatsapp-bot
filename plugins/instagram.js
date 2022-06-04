/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const {
    Module
} = require('../main');
const {
    Mimetype
} = require('@adiwajshing/baileys');
const fs = require('fs');
const got = require("got");
const axios = require('axios');
const setting = require('../config');
const {
    getPost,
    getStalk,
    getStory,
    skbuffer
} = require('raganork-bot');
const Config = require('../config');
const s = require('../config');
var need = "*_Need instagram link!_*";
var downloading = "_*Downloading*_";
var need_acc = "*_Need an instagram username!_*";
var fail = "*_Download failed! Check your link and try again_*";
var need_acc_s = "_Need an instagram username or link!_";
let sourav = setting.MODE == 'public' ? false : true
Module({
    pattern: 'insta ?(.*)',
    fromMe: sourav,
    desc: 'Downloads post/reel/igtv from instagram',
    usage: 'insta link or reply to a link'
}, (async (msg, query) => {
     var q = !msg.reply_message.message ? query[1] : msg.reply_message.message
    if (q.startsWith('l')) return;
    if (!q) return await msg.client.sendMessage(msg.jid, {
        text: "*Need instagram link*"
    }, {
        quoted: msg.data
    })
    if (q && !q.includes('instagram.com')) return await msg.client.sendMessage(msg.jid, {
        text: need
    }, {
        quoted: msg.data
    })
    await msg.client.sendMessage(msg.jid, {
        text: downloading
    }, {
        quoted: msg.data
    })
    var getid = /(?:https?:\/\/)?(?:www\.)?(?:instagram\.com(?:\/.+?)?\/(p|reel|tv)\/)([\w-]+)(?:\/)?(\?.*)?$/
    var url = getid.exec(q)
    if (url != null) {
        var res = await getPost(url[0])
        var link = res.data
        if (link.length ===0 ) return await msg.sendReply("*Download failed*");
        for (var i = 0; i < (link.length); i++) {
            var get = got(link[i], {
                https: {
                    rejectUnauthorized: false
                }
            });
            var type = link[i].includes('mp4') ? 'video' : 'image'
            var mime = link[i].includes('mp4') ? 'video/mp4' : 'image/jpeg'
            var stream = get.buffer();
            stream.then(async (video) => {
                await msg.sendReply(video, type)
            })
        };
    }
}));
Module({
    pattern: 'ig ?(.*)',
    fromMe: sourav,
    desc: 'Gets account info from instagram',
    usage: 'ig username'
}, (async (msg, query) => {
    if (query[1] === '') return await msg.client.sendMessage(msg.jid, {
        text: need_acc
    }, {
        quoted: msg.data
    })
    var res = await getStalk(query[1])
    if (res === "false") return await msg.client.sendMessage(msg.jid, {
        text: "*_Username invalid!_*"
    }, {
        quoted: msg.data
    })
    var buffer = await skbuffer(res.hd_profile_pic_url_info.url)
    await msg.client.sendMessage(msg.jid, {
        image: buffer,
        caption: '_*Name:*_ ' + `${res.fullname}` + '\n _*Bio:*_ ' + `${res.biography}` + '\n _*Private account:*_ ' + `${res.is_private} ` + '\n _*Followers:*_ ' + `${res.followers}` + '\n _*Following:*_ ' + `${res.following}` + '\n _*Posts:*_ ' + `${res.post_count}` + '\n _*Verified:*_ ' + `${res.is_verified} ` + '\n _*IGTV videos:*_ ' + `${res.total_igtv_videos}`
    }, {
        quoted: msg.data
    });
}));
Module({
    pattern: 'story ?(.*)',
    fromMe: sourav,
    desc: 'Downloads full/single story from instagram',
    usage: '.story username or link'
}, (async (msg, query) => {
    if (query[1] === '') return await msg.sendReply(need_acc_s);
    var user = query[1];
    try { var res = await getStory(user) } catch {return await msg.sendReply("*Server error*")}
    if (res === "false") return await msg.sendReply("_Story not found!_")
    if (res.error) return await msg.sendReply("Status: 403 (forbidden)")
    var url = ''
    await msg.sendMessage('```Downloading ' + res.result.stories.length + ' stories of ' + res.result.username || query[1] + '```');
    res.result.stories.map((result) => {
        url += result.url + ','
    });
    var que = url !== false ? url.split(',') : [];
    for (var i = 0; i < (que.length < res.result.stories.length ? que.length : res.result.stories.length); i++) {
        var get = got(que[i], {
            https: {
                rejectUnauthorized: false
            }
        });
        var type = que[i].includes('mp4') ? 'video' : 'image'
        var stream = get.buffer();
        stream.then(async (video) => {
            await msg.sendReply(video, type);
        })
    };
}));
