const Config = require('../config')
const {cmd } = require('../lib')
cmd({
    pattern: "instagram",
    desc: "Download Instagram videos and photos",
    react: "📷",
    category: "fun",
    filename: __filename,
},
async (Void, citel, text, { isCreator }) => {
    if (!citel.isGroup && !isCreator) return citel.reply(`*⚠️WARNING⚠️* 
    
    _Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*`);
    // The rest of your warning message

    const fetch = require('node-fetch');
    const url = 'https://instagram-video-or-images-downloader.p.rapidapi.com/';
    const instagramUrl = 'https://www.instagram.com/reel/CvfJ31qI2dR/?igshid=MzRlODBiNWFlZA=='; // Replace with the Instagram URL you want to download

    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': 'f09116d6e4msh990deb2ce0d54c2p1bf46bjsn123c406d0a5b', // Replace with your RapidAPI key
            'X-RapidAPI-Host': 'instagram-video-or-images-downloader.p.rapidapi.com'
        },
        body: new URLSearchParams({
            url: encodeURIComponent(instagramUrl)
        })
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        
        // Process the downloaded Instagram content here, you can send it as a message or save it
        // For example, you can send it as a message like this:
        return await Void.sendMessage(citel.chat, result, {
            quoted: citel,
        });
    } catch (error) {
        console.error(error);
    }
});

cmd({
        pattern: "insta",
        alias: "ig",
        desc: "download instagram post.",
        react: "🛐",
        category: "downloader",
        filename: __filename
    },
    async(Void, citel,text,{isCreator}) => {
            if (!citel.isGroup && !isCreator) return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*
`);
        const { Insta } = require('../lib')
if(!text) return citel.reply('Need post url.')
let response = await Insta(text)
for (let i=0;i<response.length;i++) {
await Void.sendFileUrl(citel.chat, response[i], `*Downloaded Media from instagram.*`, citel)
}
    });


cmd({
        pattern: "iguser",
        alias: "ig",
        desc: "download instagram post.",
        react: "🛐",
        category: "downloader",
        filename: __filename
    },
    async(Void, citel,text,{isCreator}) => {
            if (!citel.isGroup && !isCreator) return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*
`);
        const { iginfo } = require('../lib/scraper.js')
if(!text) return citel.reply('Need Username.')
let response = await iginfo(text)
for (let i=0;i<response.length;i++) {
await Void.sendFileUrl(citel.chat, response[i], `*Downloaded Media from instagram.*`, citel)
}
    });

/*     cmd({
        pattern: "checkmarried",
        alias: "ig",
        desc: "download instagram post.",
        react: "🛐",
        category: "downloader",
        filename: __filename
    },
    async(Void, citel,text,{isCreator}) => {
            if (!citel.isGroup && !isCreator) return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*
`);
        const { checkmarried } = require('../lib')
if(!text) return citel.reply('Need Username.')
let response = await checkmarried(text)
for (let i=0;i<response.length;i++) {
await Void.sendFileUrl(citel.chat, response[i], `*Downloaded Media from instagram.*`, citel)
}
    });*/
