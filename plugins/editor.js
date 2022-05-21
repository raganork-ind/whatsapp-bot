/* (c) souravkl11/raganork
You may not use this file except compliance with license!*/
let {Module} = require('../main');
let w = require('../config');
const {saveMessage} = require('./misc/saveMessage');
let {edit,editxtra,upload,skbuffer} = require('raganork-bot');
let x = require('axios');
let a = w.WORKTYPE == 'public' ? false : true;
let ffmpeg = require('fluent-ffmpeg');
let fs = require('fs');
Module({pattern: 'wanted ?(.*)', fromMe: a, desc:'Edits photo to a wanted effect'}, (async (m, match) => { 
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await edit(q,'wanted')
await m.sendReply(res,'image');}));
Module({pattern: 'mission failed ?(.*)', fromMe: a, desc:'Edits photo to a wanted effect'}, (async (m, match) => { 
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await edit(q,'missionfailed')
await m.sendReply(res,'image');}));
Module({pattern: 'delete ?(.*)', fromMe: a, desc:'Edits photo to a delete file effect'}, (async (m, match) => { 
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await edit(q,'delete')
await m.sendReply(res,'image');}));
Module({pattern: 'respect ?(.*)', fromMe: a, desc:'Edits photo to a delete file effect'}, (async (m, match) => { 
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await edit(q,'respect')
await m.sendReply(res,'image');}));
Module({pattern: 'wasted ?(.*)', fromMe: a, desc:'Edits photo to a wasted effect'}, (async (m, match) => { 
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await edit(q,'wasted')
await m.sendReply(res,'image');}));
Module({pattern: 'blur ?(.*)', fromMe: a, desc:'Edits photo to a blur effect'}, (async (m, match) => { 
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await edit(q,'blur')
await m.sendReply(res,'image');}));
Module({pattern: 'draw ?(.*)', fromMe: a, desc:'Edits photo to a drawing effect'}, (async (m, match) => { 
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await edit(q,'draw')
await m.sendReply(res,'image');}));
Module({pattern: 'sketch ?(.*)', fromMe: a, desc:'Edits photo to a sketch effect'}, (async (m, match) => { 
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await edit(q,'sketch')
await m.sendReply(res,'image');}));
Module({pattern: 'rip ?(.*)', fromMe: a, desc:'Edits photo to a rip effect'}, (async (m, match) => { 
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await edit(q,'rip')
await m.sendReply(res,'image');}));
Module({pattern: 'scary ?(.*)', fromMe: a, desc:'Edits photo to a scay effect'}, (async (m, match) => { 
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await edit(q,'scary')
await m.sendReply(res,'image');}));
Module({pattern: 'mission passed ?(.*)', fromMe: a, desc:'Edits photo to a mission passed effect'}, (async (m, match) => { 
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await edit(q,'missionpassed')
await m.sendReply(res,'image');}));
Module({pattern: 'reject ?(.*)', fromMe: a, desc:'Edits photo to a rejected effect'}, (async (m, match) => { 
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await edit(q,'rejected')
await m.sendReply(res,'image');}));
Module({pattern: 'jail ?(.*)', fromMe: a, desc:'Edits photo to a jail effect'}, (async (m, match) => { 
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await edit(q,'jail')
await m.sendReply(res,'image');}));
Module({pattern: 'contrast ?(.*)', fromMe: a, desc:'Edits photo to a contrast effect'}, (async (m, match) => { 
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await edit(q,'contrast')
await m.sendReply(res,'image');}));
Module({pattern: 'aadhar ?(.*)', fromMe: a, desc:'Makes an aadhar card with given image, name and gender'}, (async (m, text) => { 
if (!text[1]) return await m.sendMessage("Need any text")
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await upload(q)
var msg = await skbuffer(`https://raganork-api.herokuapp.com/api/image_editor?apikey=made_by_souravkl11&style=aadhar&text=${text[1]}&url=${res.link}`)
await m.sendReply(msg,'image');}));
Module({pattern: 'blur ?(.*)', fromMe: a, desc:'Makes an aadhar card with given image, name and gender'}, (async (m, text) => { 
let value = text[1] ? text[1] : 5
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await upload(q)
await m.sendReply(msg,'image');}));
Module({pattern: 'google', fromMe: a, desc:'Searches image in google. Like Google lens'}, (async (m, text) => { 
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await upload(q)
var search = await x(`https://raganork-api.herokuapp.com/api/image-search?apikey=souravkl11&image=${res.link}`)
var msg = '';
search.data.result.map((google) => {msg +='```Title:``` *'+google.title+'*\n ```Desc:``` *'+google.description+'* \n ```Link:``` *'+google.url+'* \n\n'});
await m.sendReply(msg,'image');}));
Module({pattern: 'ytcomment ?(.*)', fromMe: a, desc:'Makes a youtube comment image with image,text and username'}, (async (m, text) => { 
if (!text[1]) return await m.sendMessage("Need any text")
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await upload(q)
var msg = await skbuffer(`https://raganork-api.herokuapp.com/api/image_editor?apikey=made_by_souravkl11&style=ytcomment&text=${text[1]}&url=${res.link}`)
await m.sendReply(msg,'image');}));
Module({pattern: 'burn ?(.*)', fromMe: a, desc:'Edits photo to a fire effect'}, (async (m, match) => { 
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await edit(q,'burn')
await m.sendReply(res,'image');}));
Module({pattern: 'fire ?(.*)', fromMe: a, desc:'Edits photo to a fire meme effect'}, (async (m, match) => { 
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await edit(q,'fire')
await m.sendReply(res,'image');}));
Module({pattern: 'trash ?(.*)', fromMe: a, desc:'Edits photo to a trash meme effect'}, (async (m, match) => { 
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await edit(q,'trash')
await m.sendReply(res,'image');}));
/*Module({pattern: 'challenge ?(.*)', fromMe: a, desc:'Edits text to a challenge completed effect'}, (async (m, match) => { 
var q = await saveMessage(m.reply_message);
var res = await edit(match[1],'fire')
await m.sendReply(res,'image');}));
Module({pattern: 'pstore ?(.*)', fromMe: a, desc:'Edits photo to a playstore app effect'}, (async (m, match) => { 
if (!match[1].includes('|')) return await m.sendMessage("Wrong format! \n Use | to split words")
var res = await edit(match[1],'play-store')
await m.sendReply(res,'image');}));
*/Module({pattern: 'approve ?(.*)', fromMe: a, desc:'Edits photo to a approved effect'}, (async (m, match) => { 
var q = await saveMessage(m.reply_message);
var res = await edit(q,'approved')
await m.sendReply(res,'image');}));
Module({pattern: 'missing ?(.*)', fromMe: a, desc:'Edits photo to a notice effect with text'}, (async (m, match) => { 
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var tl, t2, t3;
if (match[1].includes('|')) {
var split = match[1].split('|');
t3 = split[2];
t2 = split[1];
t1 = split[0];}
else return await m.sendMessage("Wrong format! \n Use | to split words")
var res = await editxtra(q,t1,t2,t3)
await m.sendReply(res,'image');}));
Module({pattern: 'trigger ?(.*)', fromMe: a, desc:'Edits photo to a wanted effect'}, (async (m, match) => { 
if (!m.reply_message || !m.reply_message.image) return await m.sendReply("*Need an image!*")
var q = await saveMessage(m.reply_message);
var res = await edit(q,'triggered')
await fs.writeFileSync('st.mp4', res)
ffmpeg('st.mp4')
.outputOptions(["-y", "-vcodec libwebp", "-lossless 1", "-qscale 1", "-preset default", "-loop 0", "-an", "-vsync 0", "-s 600x600"])
.videoFilters('scale=600:600:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=600:600:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1')
.save('tri.webp')
.on('end', async () => {
await m.sendReply(fs.readFileSync('tri.webp'),'sticker');
})}));                                                                                                                                                                                                                                                                                                                                                      