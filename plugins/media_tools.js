/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const {
      Module
  } = require('../main');
  const fs = require('fs');
  const ffmpeg = require('fluent-ffmpeg');
  const {
      saveMessage
  } = require('./misc/saveMessage');
  const {
      trim,
      AVmix,
      trimVideo
  } = require('raganork-bot');
  const {
      MODE
  } = require('../config');
  const {
      getString
  } = require('./misc/lang');
  const {
      bass,
      circle,
      findMusic 
  } = require('./misc/misc');
  const Lang = getString('media');
  const fromMe = MODE == 'public' ? false : true
  Module({
      pattern: 'trim ?(.*)',
      fromMe: fromMe,
      desc: Lang.TRIM_DESC,
      usage: Lang.TRIM_USE
  }, async (message, match) => {
      if (!message.reply_message || (!message.reply_message.video && !message.reply_message.audio)) return await message.sendReply(Lang.TRIM_NEED_REPLY);
      if (message.reply_message.audio) {
          if (match[1] === '' || !match[1].includes(",")) return await message.sendReply(Lang.TRIM_NEED);
          var savedFile = await saveMessage(message.reply_message);
          var trimmed = await trim(savedFile, match[1].split(",")[0], match[1].split(",")[1], './temp/trim.mp3');
          var result = fs.readFileSync('./temp/trim.mp3');
          await message.client.sendMessage(message.jid, {
              audio: result,
              mimetype: 'audio/mp4',
              ptt: false
          }, {
              quoted: message.data
          })
      }
      if (message.reply_message.video) {
          if (match[1] === '' || !match[1].includes(",")) return await message.sendReply(Lang.TRIM_VIDEO_NEED);
          var savedFile = await saveMessage(message.reply_message);
          trimVideo(savedFile, match[1].split(",")[0], match[1].split(",")[1], "./temp/trim.mp4", async function(video) {
              return await message.sendMessage(video, 'video')
          });
      }
  });
  Module({
      pattern: "avmix",
      fromMe: fromMe,
      desc: Lang.AVMIX_DESC
  }, async (message, match) => {
      if (!fs.existsSync("./temp/avmix")) {
          fs.mkdirSync("./temp/avmix")
      }
      let files = fs.readdirSync("./temp/avmix/")
      if ((!message.reply_message && files.length < 2) || (message.reply_message && !message.reply_message.audio && !message.reply_message.video)) return await message.sendMessage(Lang.AVMIX_NEED_FILES);
      if (message.reply_message.audio) {
          var savedFile = await saveMessage(message.reply_message);
          await fs.writeFileSync('./temp/avmix/audio.mp3', fs.readFileSync(savedFile));
          return await message.sendReply(Lang.AVMIX_AUDIO_ADDED)
      }
      if (message.reply_message.video) {
          var savedFile = await saveMessage(message.reply_message);
          await fs.writeFileSync('./temp/avmix/video.mp4', fs.readFileSync(savedFile));
          return await message.sendReply(Lang.AVMIX_VIDEO_ADDED)
      }
      AVmix('./temp/avmix/video.mp4', './temp/avmix/audio.mp3', './temp/avmix/mixed.mp4', async function(video) {
          await message.sendMessage(video, 'video');
          await fs.unlinkSync('./temp/avmix/video.mp4');
          await fs.unlinkSync('./temp/avmix/audio.mp3');
          await fs.unlinkSync('./temp/avmix/mixed.mp4');
          return;
      });
  });
  Module({
      pattern: "avmix",
      fromMe: fromMe,
      desc: Lang.AVMIX_DESC
  }, async (message, match) => {
      if (!fs.existsSync("./temp/avmix")) {
          fs.mkdirSync("./temp/avmix")
      }
      let files = fs.readdirSync("./temp/avmix/")
      if ((!message.reply_message && files.length < 2) || (message.reply_message && !message.reply_message.audio && !message.reply_message.video)) return await message.sendMessage(Lang.AVMIX_NEED_FILES);
      if (message.reply_message.audio) {
          var savedFile = await saveMessage(message.reply_message);
          await fs.writeFileSync('./temp/avmix/audio.mp3', fs.readFileSync(savedFile));
          return await message.sendReply(Lang.AVMIX_AUDIO_ADDED)
      }
      if (message.reply_message.video) {
          var savedFile = await saveMessage(message.reply_message);
          await fs.writeFileSync('./temp/avmix/video.mp4', fs.readFileSync(savedFile));
          return await message.sendReply(Lang.AVMIX_VIDEO_ADDED)
      }
      AVmix('./temp/avmix/video.mp4', './temp/avmix/audio.mp3', './temp/avmix/mixed.mp4', async function(video) {
          await message.sendMessage(video, 'video');
          await fs.unlinkSync('./temp/avmix/video.mp4');
          await fs.unlinkSync('./temp/avmix/audio.mp3');
          await fs.unlinkSync('./temp/avmix/mixed.mp4');
          return;
      });
  });
  Module({
      pattern: "slowmo",
      fromMe: fromMe,
      desc: "Video to smooth slow motion"
  }, async (message, match) => {
      if (!message.reply_message || !message.reply_message.video) return await message.sendReply("*Reply to a video*");
      var savedFile = await saveMessage(message.reply_message);
      await message.sendReply("*Motion interpolating and rendering..*");
      ffmpeg(savedFile)
          .videoFilters('minterpolate=fps=120')
          .videoFilters('setpts=4*PTS')
          .noAudio()
          .format('mp4')
          .save('./temp/slowmo.mp4')
          .on('end', async () => {
              return await message.sendMessage(fs.readFileSync('./temp/slowmo.mp4'), 'video')
          });
  });
 Module({
      pattern: "circle",
      fromMe: fromMe,
      desc: "Sticker/photo to circle crop"
  }, async (message, match) => {
      await circle(message);
  });
  Module({
      pattern: "gif",
      fromMe: fromMe,
      desc: "Video to gif with audio"
  }, async (message, match) => {
      if (!message.reply_message || !message.reply_message.video) return await message.sendReply("*Reply to a video*");
      var savedFile = await saveMessage(message.reply_message);
      await message.sendReply("*Rendering..*");
      ffmpeg(savedFile)
          .fps(13)
          .videoBitrate(500)
          .save('./temp/agif.mp4')
          .on('end', async () => {
              return await message.client.sendMessage(message.jid, {
                  video: fs.readFileSync('./temp/agif.mp4'),
                  gifPlayback: true
              });
          });
  });
  Module({
      pattern: "interp ?(.*)",
      fromMe: fromMe,
      desc: "Increases video's frame rate (FPS)"
  }, async (message, match) => {
      if (!message.reply_message || !message.reply_message.video) return await message.sendReply("*Reply to a video*");
      if (match[1] <= 10) return await message.sendMessage('*Low FPS Value ⚠️*\n*Minimun = 10*');
      if (match[1] >= 500) return await message.sendMessage('*High FPS Value ⚠️*\n*Maximum = 500*')
      var savedFile = await saveMessage(message.reply_message);
      await message.sendReply("*Motion interpolating and rendering..*");
      ffmpeg(savedFile)
          .videoFilters(`minterpolate=fps=${match[1]}:mi_mode=mci:me_mode=bidir`)
          .format('mp4')
          .save('./temp/interp.mp4')
          .on('end', async () => {
              return await message.sendMessage(fs.readFileSync('./temp/interp.mp4'), 'video')
          });
  });
Module({
      pattern: "find ?(.*)",
      fromMe: fromMe,
      desc: "Finds music name. Like Shazam"
  }, async (message, match) => {
      if (!message.reply_message || !message.reply_message.audio) return await message.sendReply("*Reply to a music*");
      if (message.reply_message.duration > 60) return await message.sendMessage('*Audio too large! Use .trim command and cut the audio to < 60*');
      var savedFile = await saveMessage(message.reply_message);
      var data = await findMusic(fs.readFileSync(savedFile));
      if (!data) return await message.sendReply("*No matching results found!*");
      const templateButtons = [
    {index: 1, urlButton: {displayText: 'YouTube 🔗', url: 'https://youtu.be/'+data.external_metadata?.youtube?.vid}}
 ]
function getDuration(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
const templateMessage = {
    text:  `*Title:* ${data.title}
*Artists:* ${data.artists?.map(e => e.name + " ")}
*Released on:* ${data.release_date}
*Duration:* ${getDuration(data.duration_ms)}
*Album:* ${data.album?.name}
*Genres:* ${data.genres?.map(e => e.name + " ")}
*Label:* ${data.label}`,
    footer: 'Listen to full music on:',
    templateButtons: templateButtons
}
await message.client.sendMessage(message.jid, templateMessage)
  });

