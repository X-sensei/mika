/**
 * @project_name: Secktor-Md
 * @description: Secktor, A Multi-functional WhatsApp bot.
 * @version: 0.0.6
 * @author: SamPandey001
 * @license: GPL-3.0 License
 **/

const {
  tlang,
  ringtone,
  cmd,
  fetchJson,
  sleep,
  botpic,
  ffmpeg,
  getBuffer,
  pinterest,
  prefix,
  Config,
  isGroup,
} = require('../lib');
const { mediafire } = require('../lib/mediafire.js');
const googleTTS = require('google-tts-api');
const ytdl = require('ytdl-secktor');
const fs = require('fs-extra');
var videotime = 60000; // 1000 min
var dlsize = 1000; // 1000mb

//---------------------------------------------------------------------------
cmd(
  {
    pattern: 'tts',
    desc: 'Text to speech.',
    react: '🎙️',
    category: 'downloader',
    filename: __filename,
    use: '<Hii, this is Mikasa>',
  },
  async (Void, citel, text) => {
    if (!citel.isGroup && !isCreator) return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*
`);
    if (!text) return citel.reply('Please give me Sentence to change into audio.');
    let texttts = text;
    const ttsurl = googleTTS.getAudioUrl(texttts, {
      lang: "en",
      slow: false,
      host: "https://translate.google.com",
    });
    return Void.sendMessage(citel.chat, {
      audio: {
        url: ttsurl,
      },
      mimetype: "audio/mpeg",
      fileName: `ttsRonenBots.m4a`,
    }, {
      quoted: citel,
    });
  }
);


//---------------------------------------------------------------------------
cmd(
  {
    pattern: 'yts',
    desc: 'Gives descriptive info of query from YouTube.',
    react: '💽',
    category: 'downloader',
    filename: __filename,
    use: '<yt search text>',
  },
  async (Void, citel, text) => {
    if (!citel.isGroup && !isCreator) return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*
`);
    let yts = require("secktor-pack");
    if (!text) return citel.reply(`Example : ${prefix}yts ${tlang().title} WhatsApp Bot`);
    let search = await yts(text);
    let textt = "*YouTube Search*\n\n Result From " + text + "\n\n───────────────────\n";
    let no = 1;
    for (let i of search.all) {
      textt += `⚡ No : ${no++}\n ❤Title : ${i.title}\n♫ Type : ${i.type}\n🙈Views : ${i.views}\n⌛Duration : ${i.timestamp}\n🌟Upload At : ${i.ago}\n👑Author : ${i.author.name}\n🎵Url : ${i.url}\n\n──────────────\n\n`;
    }
    return Void.sendMessage(citel.chat, {
      image: {
        url: search.all[0].thumbnail,
      },
      caption: textt,
    }, {
      quoted: citel,
    });
  }
);


//---------------------------------------------------------------------------
cmd(
  {
    pattern: 'video',
    react: '🎥',
    desc: 'Downloads video from YouTube.',
    category: 'downloader',
    filename: __filename,
    use: '<Attack on Titan theme song>',
  },
  async (Void, citel, text) => {
    if (!citel.isGroup && !isCreator) return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*
`);
    let yts = require("secktor-pack");
    let ytdl = require("ytdl-core");
    let fs = require("fs");
    let { getBuffer } = require("./some-utils"); // Replace with the actual utility function to get a buffer

    let search = await yts(text);
    let anu = search.videos[0];
    let urlYt = anu.url;
    const getRandom = (ext) => {
      return `${Math.floor(Math.random() * 10000)}${ext}`;
    };
    let infoYt = await ytdl.getInfo(urlYt);
    if (infoYt.videoDetails.lengthSeconds >= videotime) {
      return citel.reply(`❌ Video file too big!`);
    }
    let titleYt = infoYt.videoDetails.title;
    let randomName = getRandom(".mp4");
    citel.reply('*Downloading:* ' + titleYt);
    const stream = ytdl(urlYt, {
      filter: (info) => info.itag == 22 || info.itag == 18,
    }).pipe(fs.createWriteStream(`./${randomName}`));

    await new Promise((resolve, reject) => {
      stream.on("error", reject);
      stream.on("finish", resolve);
    });

    let stats = fs.statSync(`./${randomName}`);
    let fileSizeInBytes = stats.size;
    let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
    if (fileSizeInMegabytes <= dlsize) {
      let buttonMessage = {
        video: fs.readFileSync(`./${randomName}`),
        jpegThumbnail: log0,
        mimetype: 'video/mp4',
        fileName: `${titleYt}.mp4`,
        caption: `⿻ Title : ${titleYt}\n⿻ File Size : ${fileSizeInMegabytes} MB`,
        headerType: 4,
        contextInfo: {
          externalAdReply: {
            title: titleYt,
            body: citel.pushName,
            thumbnail: await getBuffer(search.all[0].thumbnail),
            renderLargerThumbnail: true,
            mediaType: 2,
            mediaUrl: search.all[0].thumbnail,
            sourceUrl: search.all[0].thumbnail
          }
        }
      };

      Void.sendMessage(citel.chat, buttonMessage, { quoted: citel });
      fs.unlinkSync(`./${randomName}`);
    } else {
      citel.reply(`❌ File size bigger than 100mb.`);
      fs.unlinkSync(`./${randomName}`);
    }
  }
);


//---------------------------------------------------------------------------
cmd(
  {
    pattern: 'play',
    react: '📩',
    desc: 'Sends info about the query (YouTube video/audio).',
    category: 'downloader',
    filename: __filename,
    use: '<Attack on Titan Theme song.>',
  },
  async (Void, citel, text) => {
    if (!citel.isGroup && !isCreator) return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*
`);
    if (!text) return citel.reply(`Use ${command} Back in Black`);
    let yts = require("secktor-pack");
    let search = await yts(text);
    let anu = search.videos[0];
    let buttonMessage = {
      image: {
        url: anu.thumbnail,
      },
      caption: `
      ${tlang().title}
      *Youtube Player* 🎬
      📝 *Title:* ${anu.title}
      ♾️ *Duration:* ${anu.timestamp}
      👁️ *Viewers:* ${anu.views}
      ⌛ *Uploaded:* ${anu.ago}
      👤 *Author:* ${anu.author.name}
      
      ⦿ *Url* : ${anu.url}
      `,
      footer: tlang().footer,
      headerType: 4,
    };
    return Void.sendMessage(citel.chat, buttonMessage, {
      quoted: citel,
    });
  }
);

//---------------------------------------------------------------------------
cmd(
  {
    pattern: 'pin',
    react: '📍',
    desc: 'Downloads image from Pinterest.',
    category: 'downloader',
    filename: __filename,
    use: '<text|image name>',
  },
  async (Void, citel, text) => {
    if (!citel.isGroup && !isCreator) return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*
`);
    if (!text) {
      return reply("What picture are you looking for?") && Void.sendMessage(citel.chat, {
        react: {
          text: '❌',
          key: citel.key
        }
      });
    }
    try {
      const anu = await pinterest(text);
      const result = anu[Math.floor(Math.random() * anu.length)];
      let buttonMessage = {
        image: {
          url: result
        },
        caption: ` `,
        footer: tlang().footer,
        headerType: 4,
        contextInfo: {
          externalAdReply: {
            title: `Here it is✨`,
            body: `${Config.ownername}`,
            thumbnail: log0,
            mediaType: 2,
            mediaUrl: ``,
            sourceUrl: ``
          }
        }
      };
      return Void.sendMessage(citel.chat, buttonMessage, {
        quoted: citel
      });
    } catch (e) {
      console.log(e);
    }
  }
);


//---------------------------------------------------------------------------
cmd(
  {
    pattern: 'mediafire',
    react: '📁',
    desc: 'Downloads zip from Mediafire.',
    category: 'downloader',
    filename: __filename,
    use: '<url of Mediafire>',
  },
  async (Void, citel, text) => {
    if (!citel.isGroup && !isCreator) return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*
`);
    if (!text) return citel.reply(`Where is the link, Baka!?`);
    if (!isUrl(text.split(" ")[0]) && !text.split(" ")[0].includes("mediafire.com")) return reply(`The link you provided is invalid`);

    const baby1 = await mediafire(text);
    if (baby1[0].size.split("MB")[0] >= 999) return reply("*File Over Limit* " + util.format(baby1));
    
    const result4 = `*Mᴇᴅɪᴀғɪʀᴇ Dᴏᴡɴʟᴏᴀᴅᴇʀ*
*Nᴀᴍᴇ* : ${baby1[0].nama}
*Sɪᴢᴇ* : ${baby1[0].size}
*Mɪᴍᴇ* : ${baby1[0].mime}
*Lɪɴᴋ* : ${baby1[0].link}`;
    
    reply(`${result4}`);
    
    return Void.sendMessage(citel.chat, {
      document: {
        url: baby1[0].link,
      },
      fileName: baby1[0].nama,
      mimetype: baby1[0].mime,
    }, {
      quoted: citel,
    })
    .catch((err) => reply("Could not find anything"));
  }
);


//---------------------------------------------------------------------------
cmd(
  {
    pattern: 'audio',
    alias: ['song'],
    react: '📢',
    desc: 'Downloads audio from YouTube.',
    category: 'downloader',
    filename: __filename,
    use: '<text>',
  },
  async (Void, citel, text) => {
if (!citel.isGroup && !isCreator) return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*
`);
    let yts = require("secktor-pack");
    let ytdl = require("ytdl-core");
    let fs = require("fs");
    let { getBuffer } = require("./some-utils"); // Replace with the actual utility function to get a buffer

    let search = await yts(text);
    let anu = search.videos[0];
    const getRandom = (ext) => {
      return `${Math.floor(Math.random() * 10000)}${ext}`;
    };
    let infoYt = await ytdl.getInfo(anu.url);
    if (infoYt.videoDetails.lengthSeconds >= videotime) {
      return citel.reply(`❌ Video file too big!`);
    }
    let titleYt = infoYt.videoDetails.title;
    let randomName = getRandom(".mp3");
    citel.reply('*Downloading:* ' + titleYt);
    const stream = ytdl(anu.url, {
      filter: (info) => info.audioBitrate == 160 || info.audioBitrate == 128,
    }).pipe(fs.createWriteStream(`./${randomName}`));
    await new Promise((resolve, reject) => {
      stream.on("error", reject);
      stream.on("finish", resolve);
    });

    let stats = fs.statSync(`./${randomName}`);
    let fileSizeInBytes = stats.size;
    let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
    if (fileSizeInMegabytes <= dlsize) {
      let buttonMessage = {
        audio: fs.readFileSync(`./${randomName}`),
        mimetype: 'audio/mpeg',
        fileName: titleYt + ".mp3",
        headerType: 4,
        contextInfo: {
          externalAdReply: {
            title: titleYt,
            body: citel.pushName,
            renderLargerThumbnail: true,
            thumbnailUrl: search.all[0].thumbnail,
            mediaUrl: text,
            mediaType: 1,
            thumbnail: await getBuffer(search.all[0].thumbnail),
            sourceUrl: text,
          },
        },
      };
      await Void.sendMessage(citel.chat, buttonMessage, { quoted: citel });
      fs.unlinkSync(`./${randomName}`);
    } else {
      citel.reply(`❌ File size bigger than 100mb.`);
      fs.unlinkSync(`./${randomName}`);
    }
  }
);


//---------------------------------------------------------------------------
cmd(
  {
    pattern: 'ytmp4',
    alias: ['tomp4'],
    react: '🎬',
    desc: 'Downloads video from YouTube.',
    category: 'downloader',
    filename: __filename,
    use: '<yt video url>',
  },
  async (Void, citel, text) => {
    if (!citel.isGroup && !isCreator) return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*
`);
    const getRandom = (ext) => {
      return `${Math.floor(Math.random() * 10000)}${ext}`;
    };
    if (!text) {
      citel.reply(`❌ Please provide me a URL`);
      return;
    }
    try {
      let urlYt = text;
      if (!urlYt.startsWith("http")) return citel.reply(`❌ Give YouTube link!`);
      let infoYt = await ytdl.getInfo(urlYt);
      if (infoYt.videoDetails.lengthSeconds >= videotime) {
        return citel.reply(`❌ Video file too big!`);
      }
      let titleYt = infoYt.videoDetails.title;
      let randomName = getRandom(".mp4");

      const stream = ytdl(urlYt, {
        filter: (info) => info.itag == 22 || info.itag == 18,
      }).pipe(fs.createWriteStream(`./${randomName}`));
      await new Promise((resolve, reject) => {
        stream.on("error", reject);
        stream.on("finish", resolve);
      });

      let stats = fs.statSync(`./${randomName}`);
      let fileSizeInBytes = stats.size;
      let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
      if (fileSizeInMegabytes <= dlsize) {
        let yts = require("secktor-pack");
        let search = await yts(text);
        let buttonMessage = {
          video: fs.readFileSync(`./${randomName}`),
          jpegThumbnail: log0,
          mimetype: 'video/mp4',
          fileName: `${titleYt}.mp4`,
          caption: `⿻ Title : ${titleYt}\n⿻ File Size : ${fileSizeInMegabytes} MB`,
          headerType: 4,
          contextInfo: {
            externalAdReply: {
              title: titleYt,
              body: citel.pushName,
              thumbnail: await getBuffer(search.all[0].thumbnail),
              renderLargerThumbnail: true,
              mediaType: 2,
              mediaUrl: search.all[0].thumbnail,
              sourceUrl: search.all[0].thumbnail
            }
          }
        };
        Void.sendMessage(citel.chat, buttonMessage, { quoted: citel });
        fs.unlinkSync(`./${randomName}`);
      } else {
        citel.reply(`❌ File size bigger than 100mb.`);
        fs.unlinkSync(`./${randomName}`);
      }
    } catch (e) {
      console.log(e);
    }
  }
);

//---------------------------------------------------------------------------
cmd(
  {
    pattern: 'ytmp3',
    alias: ['tomp3'],
    react: '🎧',
    desc: 'Downloads audio by YouTube link.',
    category: 'downloader',
    use: '<yt video url>',
  },
  async (Void, citel, text) => {
    if (!citel.isGroup && !isCreator) return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*
`);

    const getRandom = (ext) => {
      return `${Math.floor(Math.random() * 10000)}${ext}`;
    };

    if (text.length === 0) {
      citel.reply(`❌ URL is empty! \nSend ${prefix}ytmp3 url`);
      return;
    }

    try {
      let urlYt = text;
      if (!urlYt.startsWith("http")) {
        citel.reply(`❌ Give YouTube link!`);
        return;
      }

      let infoYt = await ytdl.getInfo(urlYt);

      // 30 MIN
      if (infoYt.videoDetails.lengthSeconds >= videotime) {
        citel.reply(`❌ I can't download that long video!`);
        return;
      }

      let titleYt = infoYt.videoDetails.title;
      let randomName = getRandom(".mp3");

      const stream = ytdl(urlYt, {
        filter: (info) => info.audioBitrate == 160 || info.audioBitrate == 128,
      }).pipe(fs.createWriteStream(`./${randomName}`));

      await new Promise((resolve, reject) => {
        stream.on("error", reject);
        stream.on("finish", resolve);
      });

      let stats = fs.statSync(`./${randomName}`);
      let fileSizeInBytes = stats.size;
      let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

      if (fileSizeInMegabytes <= dlsize) {
        let yts = require("secktor-pack");
        let search = await yts(text);

        let buttonMessage = {
          audio: fs.readFileSync(`./${randomName}`),
          mimetype: 'audio/mpeg',
          fileName: titleYt + ".mp3",
          headerType: 4,
          contextInfo: {
            externalAdReply: {
              title: titleYt,
              body: citel.pushName,
              renderLargerThumbnail: true,
              thumbnailUrl: search.all[0].thumbnail,
              mediaUrl: text,
              mediaType: 1,
              thumbnail: await getBuffer(search.all[0].thumbnail),
              sourceUrl: text,
            },
          },
        };

        await Void.sendMessage(citel.chat, buttonMessage, { quoted: citel });
        fs.unlinkSync(`./${randomName}`);
      } else {
        citel.reply(`❌ File size bigger than 100mb.`);
      }

      fs.unlinkSync(`./${randomName}`);
    } catch (e) {
      console.log(e);
    }
  }
);


//---------------------------------------------------------------------------

cmd(
  {
    pattern: 'ytdoc',
    alias: ['todoc'],
    react: '💼',
    desc: 'Downloads audio by YouTube link as document.',
    category: 'downloader',
    use: '<ytdoc video url>',
  },
  async (Void, citel, text) => {
   if (!citel.isGroup && !isCreator) return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*
`); 

    const getRandom = (ext) => {
      return `${Math.floor(Math.random() * 10000)}${ext}`;
    };

    if (text.length === 0) {
      citel.reply(`❌ URL is empty! \nSend ${prefix}ytmp3 url`);
      return;
    }

    try {
      let urlYt = text;
      if (!urlYt.startsWith("http")) {
        citel.reply(`❌ Give YouTube link!`);
        return;
      }

      let infoYt = await ytdl.getInfo(urlYt);

      // 30 MIN
      if (infoYt.videoDetails.lengthSeconds >= videotime) {
        citel.reply(`❌ I can't download that long video!`);
        return;
      }

      let titleYt = infoYt.videoDetails.title;
      let randomName = getRandom(".mp3");

      const stream = ytdl(urlYt, {
        filter: (info) => info.audioBitrate == 160 || info.audioBitrate == 128,
      }).pipe(fs.createWriteStream(`./${randomName}`));

      await new Promise((resolve, reject) => {
        stream.on("error", reject);
        stream.on("finish", resolve);
      });

      let stats = fs.statSync(`./${randomName}`);
      let fileSizeInBytes = stats.size;
      let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

      if (fileSizeInMegabytes <= dlsize) {
        let yts = require("secktor-pack");
        let search = await yts(text);

        let buttonMessage = {
          document: fs.readFileSync(`./${randomName}`),
          mimetype: 'audio/mpeg',
          fileName: titleYt + ".mp3",
          headerType: 4,
          contextInfo: {
            externalAdReply: {
              title: titleYt,
              body: citel.pushName,
              renderLargerThumbnail: true,
              thumbnailUrl: search.all[0].thumbnail,
              mediaUrl: text,
              mediaType: 1,
              thumbnail: await getBuffer(search.all[0].thumbnail),
              sourceUrl: text,
            },
          },
        };

        await Void.sendMessage(citel.chat, buttonMessage, { quoted: citel });
        fs.unlinkSync(`./${randomName}`);
      } else {
        citel.reply(`❌ File size bigger than 100mb.`);
        fs.unlinkSync(`./${randomName}`);
      }
    } catch (e) {
      console.log(e);
    }
  }
);
