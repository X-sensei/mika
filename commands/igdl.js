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
const instagramDL = require('@7thraone/instagramdl');
const fs = require('fs-extra');

cmd(
  {
    pattern: 'igdl',
    desc: 'ig video downloader',
    react: '🎙️',
    category: 'downloader',
    filename: __filename,
    use: 'idfc',
  },
  async (Void, citel, text) => {
    if (!text || !text.includes("instagram")) {
      return citel.reply(
        `Please provide a valid Instagram Reel/Video link!\n\nExample: *${prefix}igdl https://www.instagram.com/p/CP7Y4Y8J8ZU/*`
      );
    }

    try {
      await citel.reply("Please wait until @7thraone/instagramdl responds");
      const videoLink = await instagramDL(text); // Use your 'igdl' package here
      if (videoLink) {
        await Void.sendMessage(
          citel.chat,
          {
            video: { url: videoLink },
            caption: `Downloaded by: *Mikasa* \n\n 🧩_*Powered By*_:\n @7thraone/instagramdl\n Url: https://github.com/7thRA-ONE/INSTAGRAMDL \n`,
          },
          { quoted: citel }
        );
      } else {
        await citel.reply(
          `Video access denied! It's private or has some other restrictions.`
        );
      }
    } catch (err) {
      await citel.reply(
        `An error occurred while downloading the video. Please try again later.`
      );
    }
  }
);
