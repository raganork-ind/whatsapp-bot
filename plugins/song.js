/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const {
    Module
} = require('../main');
const {
    MODE,
    AUDIO_DATA
} = require('../config');
const yts = require('yt-search')
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const {
    getString
} = require('./misc/lang');
const {
    getJson,
    getThumb
} = require('./misc/misc');
const Lang = getString('scrapers');
const fs = require('fs');
const {
    skbuffer,
    ytdlServer,
    getVideo,
    addInfo
} = require('raganork-bot');
let sourav = MODE == 'public' ? false : true
const getID = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed|shorts\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
Module({
    pattern: 'song ?(.*)',
    fromMe: sourav,
    desc: Lang.SONG_DESC
}, (async (message, match) => {
    if (!match[1]) return message.sendReply(Lang.NEED_TEXT_SONG)
    var link = match[1].match(/\bhttps?:\/\/\S+/gi)
    if (link !== null && getID.test(link[0])) {
        var query = getID.exec(link[0]);
        try {
            var stream = ytdl(query[1], {
                quality: 'highestaudio',
            });
        } catch {
            var {
                url
            } = await ytdlServer("https://youtu.be/" + query[1], "128kbps", "audio");
            return await message.client.sendMessage(message.jid, {
                audio: {
                    url: url
                },
                mimetype: 'audio/mpeg'
            }, {
                quoted: message.data
            });
        }
        var {
            details
        } = await getVideo(query[1]);
        var thumb = await skbuffer(details.thumbnail.url);
        ffmpeg(stream)
            .audioBitrate(128)
            .save('./temp/song.mp3')
            .on('end', async () => {
                try {
                    var audio = await addInfo('./temp/song.mp3', details.title, AUDIO_DATA.split(";")[1], "Raganork Engine", thumb)
                } catch {
                    return await message.client.sendMessage(message.jid, {
                        audio: fs.readFileSync("./temp/song.mp3"),
                        mimetype: 'audio/mp3'
                    }, {
                        quoted: message.data
                    });
                }
                return await message.client.sendMessage(message.jid, {
                    audio: audio,
                    mimetype: 'audio/mpeg'
                }, {
                    quoted: message.data
                });
            });
        return;
    }
    var myid = message.client.user.id.split("@")[0].split(":")[0]
    let sr = await yts(match[1]);
    sr = sr.all;
    if (sr.length < 1) return await message.sendReply(Lang.NO_RESULT);
    const sections = [{
        title: Lang.MATCHING_SONGS,
        rows: [{
            title: sr[0].title,
            description: '',
            rowId: "song;" + sr[0].videoId + ';' + myid
        }, {
            title: sr[1].title,
            description: '',
            rowId: "song;" + sr[1].videoId + ';' + myid
        }, {
            title: sr[2].title,
            description: '',
            rowId: "song;" + sr[2].videoId + ';' + myid
        }, {
            title: sr[3].title,
            description: '',
            rowId: "song;" + sr[3].videoId + ';' + myid
        }, {
            title: sr[4].title,
            description: '',
            rowId: "song;" + sr[4].videoId + ';' + myid
        }, {
            title: sr[5].title,
            description: '',
            rowId: "song;" + sr[5].videoId + ';' + myid
        }, {
            title: sr[6].title,
            description: '',
            rowId: "song;" + sr[6].videoId + ';' + myid
        }, {
            title: sr[7].title,
            description: '',
            rowId: "song;" + sr[7].videoId + ';' + myid
        }, {
            title: sr[8].title,
            description: '',
            rowId: "song;" + sr[8].videoId + ';' + myid
        }, {
            title: sr[9].title,
            description: '',
            rowId: "song;" + sr[9].videoId + ';' + myid
        }, ]
    }]
    const listMessage = {
        text: "And 9 more results...",
        footer: "Hey " + message.data.pushName,
        title: sr[0].title,
        buttonText: "Select song",
        sections
    }
    await message.client.sendMessage(message.jid, listMessage)
}));
Module({
    pattern: 'yts ?(.*)',
    fromMe: sourav,
    desc: "Select and download songs from yt (list)"
}, (async (message, match) => {
    if (!match[1]) return message.sendReply("*Need words*")
    var myid = message.client.user.id.split("@")[0].split(":")[0]
    let sr = await yts(match[1]);
    sr = sr.all;
    if (sr.length < 1) return await message.sendReply("*No results found!*");
    var videos = [];
    for (var index = 0; index < sr.length; index++) {
        videos.push({
            title: sr[index].title,
            description: '',
            rowId: "ytsl;" + sr[index].videoId + ';' + myid
        });
    }
    const sections = [{
        title: "Search results from YouTube.",
        rows: videos
    }]
    const listMessage = {
        text: "And " + (sr.length - 1) + " more results...",
        footer: "Hey " + message.data.pushName,
        title: sr[0].title,
        buttonText: "Select a video",
        sections
    }
    await message.client.sendMessage(message.jid, listMessage)
}));
Module({
    on: 'button',
    fromMe: sourav
}, (async (message, match) => {
    if (message.list && message.list.startsWith("ytsl") && message.list.includes(message.client.user.id.split("@")[0].split(":")[0])) {
    const buttons = [{
                                urlButton: {
                                    displayText: '𝑊𝐴𝑇𝐶𝐻 𝑂𝑁 𝑌𝑂𝑈𝑇𝑈𝐵𝐸',
                                    url: 'https://youtu.be/'+ message.list.split(";")[1]
                                }
                            }, {
                                quickReplyButton: {
                                    displayText: '𝐴𝑈𝐷𝐼𝑂',
                                    id: 'ytsa;' + message.client.user.id.split("@")[0].split(":")[0] + ";" + message.list.split(";")[1]
                                }  
                            }, {
                                quickReplyButton: {
                                    displayText: '𝑉𝐼𝐷𝐸𝑂',
                                    id: 'ytsv;' + message.client.user.id.split("@")[0].split(":")[0] + ";" + message.list.split(";")[1]
                                }
                            }]   
   
        var {
            info,
            thumbnail
        } = await getJson("https://raganork-api.vercel.app/api/youtube/details?video_id=" + message.list.split(";")[1]);
        
        await message.sendImageTemplate(await skbuffer(thumbnail),info,"ᴜsᴇʀ: "+message.senderName,buttons);
    }
    if (message.button && message.button.startsWith("ytsv") && message.button.includes(message.client.user.id.split("@")[0].split(":")[0])) {
        try {
            var dl = await getVideo(message.button.split(";")[2])
        } catch {
            var {
                url,
                thumbnail,
                title
            } = await ytdlServer("https://youtu.be/" + message.button.split(";")[2]);
            return await message.client.sendMessage(message.jid, {
                video: {
                    url: url
                },
                mimetype: "video/mp4",
                caption: title,
                thumbnail: await skbuffer(thumbnail)
            });
        }
        var cap = dl.details.title || ""
        var th = dl.details.thumbnail.url || null
        try {
            var yt = ytdl(message.button.split(";")[2], {
                filter: format => format.container === 'mp4' && ['720p', '480p', '360p', '240p', '144p'].map(() => true)
            });
        } catch {
            var {
                url,
                thumbnail,
                title
            } = await ytdlServer("https://youtu.be/" + message.button.split(";")[2]);
            return await message.client.sendMessage(message.jid, {
                video: {
                    url: url
                },
                mimetype: "video/mp4",
                caption: title,
                thumbnail: await skbuffer(thumbnail)
            });
        }
        yt.pipe(fs.createWriteStream('./temp/' + message.button.split(";")[2] + '.mp4'));
        yt.on('end', async () => {
            await message.client.sendMessage(message.jid, {
                video: fs.readFileSync('./temp/' + message.button.split(";")[2] + '.mp4'),
                mimetype: "video/mp4",
                caption: cap,
                thumbnail: await skbuffer(th)
            });
        });
    }
    if (message.button && message.button.startsWith("ytsa") && message.button.includes(message.client.user.id.split("@")[0].split(":")[0])) {
        try {
            var stream = ytdl(message.button.split(";")[2], {
                quality: 'highestaudio',
            });
        } catch {
            var {
                url
            } = await ytdlServer("https://youtu.be/" + message.button.split(";")[2], "128kbps", "audio");
            return await message.client.sendMessage(message.jid, {
                audio: {
                    url: url
                },
                mimetype: 'audio/mpeg'
            }, {
                quoted: message.data
            });
        }
        var {
            details
        } = await getVideo(message.button.split(";")[2]);
        var thumb = await skbuffer(details.thumbnail.url);
        ffmpeg(stream)
            .audioBitrate(128)
            .save('./temp/song.mp3')
            .on('end', async () => {
                try {
                    var audio = await addInfo('./temp/song.mp3', details.title, AUDIO_DATA.split(";")[1], "Raganork Engine", thumb)
                } catch {
                    return await message.client.sendMessage(message.jid, {
                        audio: fs.readFileSync("./temp/song.mp3"),
                        mimetype: 'audio/mp3'
                    }, {
                        quoted: message.data
                    });
                }
                return await message.client.sendMessage(message.jid, {
                    audio: audio,
                    mimetype: 'audio/mpeg'
                }, {
                    quoted: message.data
                });
            });
    }
    if (message.list && message.list.startsWith("song") && message.list.includes(message.client.user.id.split("@")[0].split(":")[0])) {
        try {
            var stream = ytdl(message.list.split(";")[1], {
                quality: 'highestaudio',
            });
        } catch {
            var {
                url
            } = await ytdlServer("https://youtu.be/" + message.list.split(";")[1], "128kbps", "audio");
            return await message.client.sendMessage(message.jid, {
                audio: {
                    url: url
                },
                mimetype: 'audio/mpeg'
            }, {
                quoted: message.data
            });
        }
        var {
            details
        } = await getVideo(message.list.split(";")[1]);
        var thumb = await skbuffer(details.thumbnail.url);
        ffmpeg(stream)
            .audioBitrate(128)
            .save('./temp/song.mp3')
            .on('end', async () => {
                try {
                    var audio = await addInfo('./temp/song.mp3', details.title, AUDIO_DATA.split(";")[1], "Raganork Engine", thumb)
                } catch {
                    return await message.client.sendMessage(message.jid, {
                        audio: fs.readFileSync("./temp/song.mp3"),
                        mimetype: 'audio/mp3'
                    }, {
                        quoted: message.data
                    });
                }
                return await message.client.sendMessage(message.jid, {
                    audio: audio,
                    mimetype: 'audio/mpeg'
                }, {
                    quoted: message.data
                });
            });
    }
    if (message.list && message.list.startsWith("ytv") && message.list.includes(message.client.user.id.split("@")[0].split(":")[0])) {
        try {
            var stream = ytdl(message.list.split(";")[1], {
                quality: 'highestaudio',
            });
        } catch {
            var {
                url
            } = await ytdlServer("https://youtu.be/" + message.list.split(";")[1]);
            return await message.client.sendMessage(message.jid, {
                audio: {
                    url: url
                },
                mimetype: 'audio/mpeg'
            }, {
                quoted: message.data
            });
        }
        var {
            details
        } = await getVideo(message.list.split(";")[1]);
        var thumb = await skbuffer(details.thumbnail.url);
        ffmpeg(stream)
            .audioBitrate(128)
            .save('./temp/song.mp3')
            .on('end', async () => {
                try {
                    var audio = await addInfo('./temp/song.mp3', details.title, AUDIO_DATA.split(";")[1], "Raganork Engine", thumb)
                } catch {
                    return await message.client.sendMessage(message.jid, {
                        audio: fs.readFileSync("./temp/song.mp3"),
                        mimetype: 'audio/mp3'
                    }, {
                        quoted: message.data
                    });
                }
                return await message.client.sendMessage(message.jid, {
                    audio: audio,
                    mimetype: 'audio/mpeg'
                }, {
                    quoted: message.data
                });
            });
    }
}));
