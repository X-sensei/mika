/**
 Copyright (C) 2022.
 Licensed under the  GPL-3.0 License;
 You may not use this file except in compliance with the License.
 It is supplied in the hope that it may be useful.
 * @project_name : Secktor-Md
 * @author : SamPandey001 <https://github.com/SamPandey001>
 * @description : Secktor, A Multi-functional WhatsApp bot.
 * @version 0.0.6
 **/

const axios = require('axios');
const { sck1, tiny, fancytext, listall, cmd, ffmpeg } = require('../lib/');
const fs = require('fs-extra');
const { exec } = require('child_process');
const { Sticker, createSticker, StickerTypes } = require("wa-sticker-formatter");
const Config = require('../config')


//---------------------------------------------------------------------------

cmd({
  pattern: "toimg",
  alias: ["photo"],
  react: "🃏",
  desc: "Makes a photo of the replied sticker.",
  category: "converter",
  use: '<reply to any gif>',
  filename: __filename
},
async (Void, citel, text) => {
  // Check if the command is being used in a group chat
  if (citel.isGroup) {
    const getRandom = (ext) => {
      return `${Math.floor(Math.random() * 10000)}${ext}`;
    };

    if (!citel.quoted) return citel.reply(`_Reply to any sticker._`);
    let mime = citel.quoted.mtype;
    if (mime == "imageMessage" || mime == "stickerMessage") {
      let media = await Void.downloadAndSaveMediaMessage(citel.quoted);
      let name = await getRandom('.png');
      exec(`ffmpeg -i ${media} ${name}`, (err) => {
        let buffer = fs.readFileSync(media);
        Void.sendMessage(citel.chat, { image: buffer }, { quoted: citel });

        fs.unlink(media, (err) => {
          if (err) {
            return console.error('File not deleted from TOPHOTO at:', media, '\nwhile Error:', err);
          } else {
            return console.log('File deleted successfully in TOPHOTO at:', media);
          }
        });
      });
    } else {
      return citel.reply("```Uhh Please, reply to a non-animated sticker.```");
    }
  } else {
    return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*`);
  }
});

//---------------------------------------------------------------------------

cmd({
  pattern: "vv",
  alias: ['viewonce', 'retrive'],
  react: "🎭",
  desc: "Flips given text.",
  category: "misc",
  use: '<query>',
  filename: __filename
},
async (Void, citel, text) => {
  // Check if the command is being used in a group chat
  if (citel.isGroup) {
    try {
      const quot = citel.msg.contextInfo.quotedMessage.viewOnceMessageV2;
      if (quot) {
        if (quot.message.imageMessage) {
          let cap = quot.message.imageMessage.caption;
          let anu = await Void.downloadAndSaveMediaMessage(quot.message.imageMessage);
          return Void.sendMessage(citel.chat, { image: { url: anu }, caption: cap });
        }
        if (quot.message.videoMessage) {
          let cap = quot.message.videoMessage.caption;
          let anu = await Void.downloadAndSaveMediaMessage(quot.message.videoMessage);
          return Void.sendMessage(citel.chat, { video: { url: anu }, caption: cap });
        }
      }
    } catch (e) {
      console.log("error", e);
    }
  } else {
    return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*`);
  }

  if (!citel.quoted) return citel.reply("```Uh Please Reply A ViewOnce Message```");
  if (citel.quoted.mtype === "viewOnceMessage") {
    console.log("ViewOnce Entered");
    if (citel.quoted.message.imageMessage) {
      let cap = citel.quoted.message.imageMessage.caption;
      let anu = await Void.downloadAndSaveMediaMessage(citel.quoted.message.imageMessage);
      Void.sendMessage(citel.chat, { image: { url: anu }, caption: cap });
    } else if (citel.quoted.message.videoMessage) {
      let cap = citel.quoted.message.videoMessage.caption;
      let anu = await Void.downloadAndSaveMediaMessage(citel.quoted.message.videoMessage);
      Void.sendMessage(citel.chat, { video: { url: anu }, caption: cap });
    }
  } else {
    return citel.reply("```This is Not A ViewOnce Message```");
  }
});

//---------------------------------------------------------------------------

cmd({
  pattern: "fancy",
  react: "♠️",
  desc: "Makes stylish/fancy given text",
  category: "converter",
  use: '56 Mikasa',
  react: "✅",
  filename: __filename
},
async (Void, citel, text) => {
  // Check if the command is being used in a group chat
  if (citel.isGroup) {
    if (isNaN(text.split(" ")[0]) || !text) {
      let text = tiny("Fancy text generator\n\nExample: .fancy 32 Mikasa\n\n");
      listall("Mikasa Bot").forEach((txt, num) => {
        text += `${(num += 1)} ${txt}\n`;
      });
      return await citel.reply(text);
    }

    let fancytextt = await fancytext(`${text.slice(2)}`, text.split(" ")[0]);
    citel.reply(fancytextt);
  } else {
    return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*`);
  }
});

//---------------------------------------------------------------------------

cmd({
  pattern: "tiny",
  desc: "Makes url tiny.",
  category: "converter",
  use: '<url>',
  react: "✅",
  filename: __filename
},
async (Void, citel, text) => {
  // Check if the command is being used in a group chat
  if (citel.isGroup) {
    if (!text) return citel.reply('Provide me a link');
    try {
      link = text.split(" ")[0];
      anu = await axios.get(`https://tinyurl.com/api-create.php?url=${link}`);
      citel.reply(`*🛡️Your Shortened URL*\n\n${anu.data}`);
    } catch (e) {
      console.log(e);
    }
  } else {
    return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*`);
  }
});

//---------------------------------------------------------------------------

cmd({
  pattern: "circle",
  alias: ["circlestic", "circlesticker", "cs"],
  react: "⭕",
  desc: "Makes sticker of replied image/video.",
  category: "sticker",
  filename: __filename,
  use: '<reply to any image/video.>'
},
async (Void, citel, text) => {
  // Check if the command is being used in a group chat
  if (citel.isGroup) {
    if (!citel.quoted) return citel.reply(`*Reply To any Image or video.*`);
    let mime = citel.quoted.mtype;
    pack = Config.packname;
    author = Config.author;
    if (mime == "imageMessage" || mime == "stickerMessage") {
      let media = await citel.quoted.download();
      let sticker = new Sticker(media, {
        pack: pack, // The pack name
        author: author, // The author name
        type: StickerTypes.CIRCLE,
        categories: ["🤩", "🎉"], // The sticker category
        id: "12345", // The sticker id
        quality: 75, // The quality of the output file
      });
      const buffer = await sticker.toBuffer();
      return Void.sendMessage(citel.chat, { sticker: buffer }, { quoted: citel });
    } else {
      return citel.reply("*Uhh,Please reply to any image*");
    }
  } else {
    return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*`);
  }
});

//---------------------------------------------------------------------------

cmd({
  pattern: "crop",
  alias: ["cropstic", "csticker", "cropsticker"],
  react: "☑️",
  desc: "Makes sticker of replied image/video.",
  category: "sticker",
  filename: __filename,
  use: '<reply to any image/video.>'
},
async (Void, citel, text) => {
  // Check if the command is being used in a group chat
  if (citel.isGroup) {
    if (!citel.quoted) return citel.reply(`*Reply To any Image or video Sir.*`);
    let mime = citel.quoted.mtype;
    pack = Config.packname;
    author = Config.author;
    if (mime == "imageMessage" || mime == "stickerMessage") {
      let media = await citel.quoted.download();
      let sticker = new Sticker(media, {
        pack: pack, // The pack name
        author: author, // The author name
        type: StickerTypes.CROPPED,
        categories: ["🤩", "🎉"], // The sticker category
        id: "12345", // The sticker id
        quality: 75, // The quality of the output file
      });
      const buffer = await sticker.toBuffer();
      return Void.sendMessage(citel.chat, { sticker: buffer }, { quoted: citel });
    } else {
      return citel.reply("*Uhh,Please reply to any image*");
    }
  } else {
    return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*`);
  }
});

//---------------------------------------------------------------------------

cmd({
  pattern: "round",
  alias: ["roundstic", "roundsticker"],
  react: "🔘",
  desc: "Makes sticker of replied image/video.",
  category: "sticker",
  filename: __filename,
  use: '<reply to any image/video.>'
},
async (Void, citel, text) => {
  // Check if the command is being used in a group chat
  if (citel.isGroup) {
    if (!citel.quoted) return citel.reply(`*Reply To any Image or video.*`);
    let mime = citel.quoted.mtype;
    pack = Config.packname;
    author = Config.author;
    if (mime == "imageMessage" || mime == "stickerMessage") {
      let media = await citel.quoted.download();
      let sticker = new Sticker(media, {
        pack: pack, // The pack name
        author: author, // The author name
        type: StickerTypes.ROUNDED,
        categories: ["🤩", "🎉"], // The sticker category
        id: "12345", // The sticker id
        quality: 75, // The quality of the output file
      });
      const buffer = await sticker.toBuffer();
      return Void.sendMessage(citel.chat, { sticker: buffer }, { quoted: citel });
    } else {
      return citel.reply("*Uhh,Please reply to any image*");
    }
  } else {
    return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*`);
  }
});

//---------------------------------------------------------------------------

cmd({
  pattern: "toaudio",
  alias: ['mp3', 'tomp3'],
  react: "🔊",
  desc: "Changes type to audio.",
  category: "converter",
  use: '<reply to any Video>',
  filename: __filename
},
async (Void, citel, text) => {
  // Check if the command is being used in a group chat
  if (citel.isGroup) {
    if (!citel.quoted) return citel.reply(`_Reply to Any Video_`);
    let mime = citel.quoted.mtype;
    if (mime == "audioMessage" || mime == "videoMessage") {
      let media = await Void.downloadAndSaveMediaMessage(citel.quoted);
      const { toAudio } = require('../lib');
      let buffer = fs.readFileSync(media);
      let audio = await toAudio(buffer);
      Void.sendMessage(citel.chat, { audio: audio, mimetype: 'audio/mpeg' }, { quoted: citel });

      fs.unlink(media, (err) => {
        if (err) {
          return console.error('File Not Deleted from From TOAUDIO AT : ', media, '\n while Error : ', err);
        } else {
          return console.log('File deleted successfully in TOAUDIO MP3 at : ', media);
        }
      });
    } else {
      return citel.reply("```Uhh Please, Reply To A video Message```");
    }
  } else {
    return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*`);
  }
});
