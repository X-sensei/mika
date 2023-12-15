/**
 Copyright (C) 2022.
 Licensed under the  GPL-3.0 License;
 You may not use this file except in compliance with the License.
 It is supplied in the hope that it may be useful.
 * @project_name : Secktor-Md
 * @author : SamPandey001 <https://github.com/SamPandey001>
 * @description : Secktor,A Multi-functional whatsapp bot.
 * @version 0.0.6
 **/

const { dare, truth, random_question } = require('../lib/truth-dare.js')
const axios = require('axios')
const { formatp , sck1, formatDate , tlang, botpic,cmd, prefix, runtime,Config , parsedJid ,sleep } = require('../lib')
    //---------------------------------------------------------------------------


 
/*cmd({
  pattern: 'tc',
  desc: 'Sends the Terms and conditions of Ronen-Bots',
  category: 'general',
  use:'<.tc>',
}, async(Void,citel,text) => {
let buttonMessaged = {
        image: { url: `https://graph.org/file/1ca487ecf4b5a4506bcbe.jpg`},
        caption: 
    

	`*Terms and Conditions for Ronen Bots WhatsApp Bot:*

🎀 Thank you for using our WhatsApp bot, developed by Ronen Bots. By using our bot in your group, you are agreeing to comply with these Terms and Conditions. Please read them carefully.

1. The bot is designed to provide various functionalities within your WhatsApp group. It may respond to certain commands, deliver messages, and perform other automated tasks as programmed.

2. Our bot is intended to be used only in WhatsApp groups. It cannot be used in personal chats or other platforms.

3. Ronen Bots retains the right to periodically take the bot offline for maintenance or updates. During such periods, the bot may be unavailable for use, and we apologize for any inconvenience caused. Maintenance may last approximately 2-3 minutes or more, depending on the circumstances.

4. We do not guarantee the uninterrupted availability or continuous operation of the bot. There may be technical issues, server downtime, or other factors that could affect the bot's functionality. Ronen Bots shall not be held liable for any loss or damages resulting from the bot's unavailability.

5. Ronen Bots shall not be responsible for any loss, damage, or compromise of data that may occur while using our bot. Users are solely responsible for any actions taken or content shared through the bot. We encourage users to exercise caution and take appropriate measures to protect their privacy and confidentiality.

6. The bot will respect your privacy, and your chats within the group will remain private and safe. We do not collect, store, or share any personal information or conversations from your group.

7. Our bot may collect usage statistics or anonymized data for analytical purposes, which will solely be used to improve the bot's performance and user experience. No data collected will be personally identifiable.

8. The bot may offer additional features or services that require payment. These paid features will be clearly stated and can be purchased through in-app transactions or other designated payment methods. The pricing for these features will be clearly displayed, and you will be billed accordingly for your usage.

9. In order to use the bot, you must be of legal age according to the laws of your jurisdiction. By using the bot, you confirm that you meet the age requirements.

10. The bot may include links or references to third-party websites or services. Ronen Bots is not responsible for the content, accuracy, or functionality of these third-party sites. We advise users to review the terms and privacy policies of these websites before using their services.

11. Users are prohibited from reverse-engineering, decompiling, or attempting to extract the source code of the bot or any of its functionalities. Any unauthorized use of the bot or its components may result in legal action.

12. Users are prohibited from spamming or sending unsolicited messages using the bot. Any misuse or abuse of the bot may result in the immediate termination of your account and access to the bot's services.

13. We may periodically update the bot to introduce new features, improve performance, or address security vulnerabilities. By continuing to use the bot after such updates, you agree to accept the updated version and any associated changes to these Terms and Conditions.

14. Ronen Bots reserves the right to display promotional or advertising content within the bot. These promotions may be targeted based on user preferences or other relevant factors. By using the bot, you agree to receive such promotional content.

15. Ronen Bots does not guarantee the accuracy, reliability, or completeness of any information provided by the bot. Users are responsible for verifying the accuracy of information obtained through the bot before relying on it.

16. Users are responsible for maintaining the security and confidentiality of their WhatsApp account. Ronen Bots shall not be held liable for any unauthorized access to or use of your account.

17. In the event of any dispute between you and Ronen Bots arising out of or in connection with these Terms and Conditions, you agree to first attempt to resolve the dispute through good faith negotiations. If the dispute cannot be resolved amicably, you agree to submit to the exclusive jurisdiction of the courts in the jurisdiction in which Ronen Bots operates.

18. Failure by Ronen Bots to enforce any provision of these Terms and Conditions shall not be deemed a waiver of future enforcement of that or any other provision.

Please review these Terms and Conditions regularly, as they may be updated from time to time.

*📛 Your continued use of the bot after any modifications signifies your acceptance of the updated terms.*`,
	};
	
return await Void.sendMessage(citel.chat, buttonMessaged, {
        quoted: citel,	  
    });
		 
	});*/

cmd({
            pattern: "question",
            desc: "Random Question.",
 react: "⁉️",
            category: "fun",
            filename: __filename,
        },
        async(Void, citel, text,{ isCreator }) => {
	     if (!citel.isGroup && !isCreator) return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*
`);
           let ter = `*Question:* ${random_question()}\n\n*Powered by Mikasa💗*`;
    let buttonMessaged = {
        image: { url: await botpic() },
        caption: ter,
    };
return await Void.sendMessage(citel.chat, buttonMessaged, {
        quoted: citel,	  
    });
		 
	});
    //---------------------------------------------------------------------------
cmd({
    pattern: "truth",
    desc: "truth and dare (truth game.)",
    react: "🤔",
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

_${Config.botname} Powered by:_ *©️RONEN-BOTS*`)
    // The rest of your warning message
    
    let ter = `*TRUTH*\n\n${truth()}`;
    let buttonMessaged = {
        image: { url: `https://graph.org/file/4da4f140f5524e63a0b8b.jpg`},
        caption: ter,
        /*footer: tlang().footer,
        headerType: 4,
        contextInfo: {
            externalAdReply: {
               title: "",
               body: "Mikasa💗",
                thumbnail: log0,
                mediaType: 4,
                mediaUrl: '',
                sourceUrl: ``,
            },
        },*/
    };
    return await Void.sendMessage(citel.chat, buttonMessaged, {
        quoted: citel,
    });
});


    //---------------------------------------------------------------------------
cmd({
	pattern: "dare",
    desc: "truth and dare (dare game.)",
    react: "🤔",
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

_${Config.botname} Powered by:_ *©️RONEN-BOTS*`)
    // The rest of your warning message
    
    let ter = `*DARE*\n\n${dare()}`;
    let buttonMessaged = {
        image: { url: `https://graph.org/file/2d22d8358f911e70a252d.jpg`},
        caption: ter,
        /*footer: tlang().footer,
        headerType: 4,
       contextInfo: {
            externalAdReply: {
                title: "",
                body: "Mikasa💗",
                //thumbnail: log0,
                mediaType: 4,
                mediaUrl: '',
                sourceUrl: ``,
            },
        },*/
    };
    return await Void.sendMessage(citel.chat, buttonMessaged, {
        quoted: citel,
    });
});

    //---------------------------------------------------------------------------
cmd({
        pattern: "fact",
        desc: "Sends fact in chat.",
 react: "❕",
        category: "fun",
        filename: __filename,
    },
  async(Void, citel, text,{ isCreator }) => {
	     if (!citel.isGroup && !isCreator) return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*
`);
        const { data } = await axios.get(`https://nekos.life/api/v2/fact`)
         
	  let ter = `*FACT:* ${data.fact}\n\n*Powered by Mikasa💗*`;
    let buttonMessaged = {
        image: { url: await botpic() },
        caption: ter,
    };
return await Void.sendMessage(citel.chat, buttonMessaged, {
        quoted: citel,	  
    });

  });
    //---------------------------------------------------------------------------
    cmd({
        pattern: "quotes",
        desc: "Sends quotes in chat.",
     react: "〽️",
        category: "fun",
        filename: __filename,
    },
    async(Void, citel, text,{ isCreator }) => {
	     if (!citel.isGroup && !isCreator) return citel.reply(`*⚠️WARNING⚠️*
  
_Don't text the Bot in pm._

*㊙️If you want to add this bot in your GC(GroupChat) then ask the Developer*

*〽️Developer:*
• wa.me/${Config.ronen}

*📛Our official Support GC: ${Config.gc}*

*💗Have a nice day💗*

_${Config.botname} Powered by:_ *©️RONEN-BOTS*
`);
        var quoo = await axios.get(`https://favqs.com/api/qotd`)
	    let ter = `*🎗️Content:* ${quoo.data.quote.body}\n*👤Author:* ${quoo.data.quote.author}\n\n*Powered by Mikasa💗*`;
    let buttonMessaged = {
        image: { url: await botpic() },
        caption: ter,
    };
return await Void.sendMessage(citel.chat, buttonMessaged, {
        quoted: citel,	  
    });
    
    });
    //---------------------------------------------------------------------------
    cmd({
    pattern: "define",
    desc: "urban dictionary.",
    react: "✳️",
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

_${Config.botname} Powered by:_ *©️RONEN-BOTS*
`);
    try {
        let { data } = await axios.get(`http://api.urbandictionary.com/v0/define?term=${text}`);
        var textt = `*🔰Word:* ${text}\n*📛Definition:* ${data.list[0].definition.replace(/\[/g, "").replace(/\]/g, "")}\n*⚜️Example:* ${data.list[0].example.replace(/\[/g, "").replace(/\]/g, "")}\n\n*Powered by Mikasa💗*`;
        let buttonMessaged = {
            image: { url: await botpic() },
            caption: textt,
        };
        return await Void.sendMessage(citel.chat, buttonMessaged, {
            quoted: citel,
        });
    } catch {
        return citel.reply(`No result for ${text}`);
    }
});
