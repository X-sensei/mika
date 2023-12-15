const { MongoClient } = require('mongodb');
const { cmd, getAdmin, RandomXP, tlang } = require('../lib/');
const waifus = require('../marry-waifu');
const Levels = require("discord-xp");
const { marry } = require('../lib/marry.js');

const uri = 'mongodb+srv://en:en@cluster0.lfqz6ie.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect()
  .then(() => {
    console.log('Connected to waifu MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to Waifu MongoDB:', err);
  });

const waifuNames = waifus.map((waifu) => waifu.Name).join('\n');

const waifuCollection = client.db('Marry').collection('waifus');

// Marry Command
cmd({
  pattern: "marry",
  alias: ["my", "mine"],
  react: "💍",
  desc: "Marry a waifu from the given list",
  category: "group",
  filename: __filename,
}, async (Void, citel, text, { isCreator }) => {
  if (!citel.isGroup) return citel.reply(tlang().group);

  if (!text) return citel.reply(`👰Whom do you want to marry?\n\n${waifuNames}\n\n*🔰Example:* _<.marry Asuna>_\n\n*📄Note:* You can't marry a waifu who is already married to someone.`);

  const user = citel.sender;

  const currentEngagement = await waifuCollection.findOne({ userId: user });

  if (currentEngagement) {
    const waifuName = currentEngagement.waifuName;

    const marriageMessage = `*💍 You are already married to ${waifuName}.*\n\n_👰You can Summon ${waifuName} using the command <.summon ${waifuName}>_\n\nTo divorce, use _<.divorce ${waifuName}>_`;
    citel.reply(marriageMessage);

    return;
  }

  const waifu = text.split(" ")[0];

  if (!waifus.some((w) => w.Name === waifu)) {
    citel.reply(`🚫 *${waifu}* is not a valid waifu name. Choose from the following:\n\n${waifuNames}`);
    return;
  }

  const existingMarriage = await waifuCollection.findOne({ waifuName: waifu });
  if (existingMarriage) {
    citel.reply(`🚫 *${waifu}* is already married to *${existingMarriage.userId}*\n\nYou can't marry her until the user who is married to her divorces with her.\nPlease marry another waifu from the list. \n\n🎐Type: _<.marry>_ to get the waifu list`);
    return;
  }

  const waifuData = {
    userId: citel.sender,
    waifuName: waifu,
  };

  await waifuCollection.insertOne(waifuData);

  try {
    const userWaifu = waifus.find((w) => w.Name === waifu);
    if (userWaifu) {
      const marriageMessage = `*🎊Congratulations ${waifu} accepted your proposal.*\n*💖Now you two are officially Married*\n\n_👰Now you can Summon ${waifu} using the command <.summon ${waifu}>_\n\nTo divorce, use _<.divorce ${waifu}>_`;
      const imageLink = userWaifu.ImgLink;
      let buttonMessaged = {
        image: { url: imageLink },
        caption: marriageMessage,
      };
      await Void.sendMessage(citel.chat, buttonMessaged, { quoted: citel });
    } else {
      citel.reply(`🚫 Failed to find information for ${waifu}. Please try again later.`);
    }
  } catch (error) {
    console.error("Error:", error);
    citel.reply("An error occurred while processing your request. Please try again later.");
  }
});

// Divorce Command
cmd({
  pattern: "divorce",
  desc: "Divorce from a waifu",
  category: "group",
  filename: __filename,
}, async (Void, citel, text, { isCreator }) => {
  if (!citel.isGroup) return citel.reply(tlang().group);

  const groupAdmins = await getAdmin(Void, citel);

  if (!citel.isGroup) return citel.reply("This command is only for groups");
  if (!text) return citel.reply(`👰From whom do you want to divorce?\n\n*🔰Example:* _<.divorce ${waifu}>_`);

  const waifu = text.split(" ")[0];

  const existingMarriage = await waifuCollection.findOne({ waifuName: waifu });

  if (!existingMarriage || existingMarriage.userId !== citel.sender) {
    citel.reply(`🚫 You can't divorce ${waifu} as you are not married to them.`);
    return;
  }

  const userId = citel.sender;
  const waifuName = waifu;

  await waifuCollection.deleteOne({ userId, waifuName });

  citel.reply(`💔 You are now divorced from ${waifu}.`);

  const divorcedUser = await waifuCollection.findOne({ waifuName: waifu });
  if (divorcedUser) {
    try {
      const divorceMessage = `💔 Your spouse @${parseJid(citel.sender).username} has divorced you. You are now free to marry again.`;
      await Void.sendMessage(divorcedUser.userId, divorceMessage);
    } catch (error) {
      console.error("Error notifying divorced user:", error);
    }
  }
});

// Summon Command
cmd({
  pattern: "summon",
 // alias: "sum",
  desc: "Summon your married waifu.",
  react: "👰",
  category: "Fun",
  filename: __filename,
}, async (Void, citel, text, { isCreator }) => {
  const user = citel.sender;

  const currentEngagement = await waifuCollection.findOne({ userId: user });

  if (!currentEngagement) {
    citel.reply("🚫 You are not married to any waifu. Use <.marry WaifuName> to marry a waifu.");
    return;
  }

  const waifu = currentEngagement.waifuName;

  const lowercasedText = text.toLowerCase();
  if (lowercasedText.includes(waifu.toLowerCase())) {
    let ter = `*✡️Summoning:* \`\`\`${waifu}\`\`\`\n\n_${marry()}_`;
    let buttonMessaged = {
      image: { url: `https://api-d4r1.onrender.com/random/${waifu}` },
      caption: ter,
    };
    await Void.sendMessage(citel.chat, buttonMessaged, { quoted: citel });
  } else {
    citel.reply(`🚫 You are married to ${waifu}. You can only summon ${waifu}. Use <.summon ${waifu}>.`);
  }
});

// Inventory Command
cmd({
  pattern: "inventory",
  desc: "View the waifus you are married to.",
  category: "group",
  filename: __filename,
}, async (Void, citel, text, { isCreator }) => {
  if (!citel.isGroup) return citel.reply(tlang().group);

  const userId = citel.sender;

  let meh = citel.sender;
  const userq = await Levels.fetch(userId, "RandomXP");
  const lvpoints = userq.level;
  var role = "*⚠️GOD OF MULTIVERSE*";
  if (lvpoints <= 1) {
    var role = "🏳Slime";
  } else if (lvpoints <= 4) {
    var role = "🧟Goblin";
  } else if (lvpoints <= 6) {
    var role = "👤Goblin Prime";
  } else if (lvpoints <= 8) {
    var role = "🧙‍♂️Goblin Lord";
  } else if (lvpoints <= 10) {
    var role = "🧚🏻Mage";
  } else if (lvpoints <= 12) {
    var role = "🧜Mage Prime";
  } else if (lvpoints <= 14) {
    var role = "🧜‍♂️Master of Mage";
  } else if (lvpoints <= 16) {
    var role = "🌬Nobel";
  } else if (lvpoints <= 18) {
    var role = "❄Nobel Lord";
  } else if (lvpoints <= 20) {
    var role = "⚡Monster";
  } else if (lvpoints <= 22) {
    var role = "🎭Monster Prime";
  } else if (lvpoints <= 24) {
    var role = "🥇Monster lord";
  } else if (lvpoints <= 26) {
    var role = "🥈Hero";
  } else if (lvpoints <= 28) {
    var role = "🥉Elite Hero";
  } else if (lvpoints <= 30) {
    var role = "🎖Supreme Hero";
  } else if (lvpoints <= 32) {
    var role = "🏅King of Heroes";
  } else if (lvpoints <= 34) {
    var role = "🏆God of Heroes";
  } else if (lvpoints <= 36) {
    var role = "💍Devil";
  } else if (lvpoints <= 38) {
    var role = "💎Supreme Devil";
  } else if (lvpoints <= 40) {
    var role = "🔮Devil Lord";
  } else if (lvpoints <= 42) {
    var role = "🛡Demon";
  } else if (lvpoints <= 44) {
    var role = "🎍Supreme Demon";
  } else if (lvpoints <= 46) {
    var role = "⚔Demon King";
  } else if (lvpoints <= 55) {
    var role = "🐉Demon Lord";
  } else if (lvpoints <= 400) {
    var role = "Fat ass🍑🍆";
  }

  const marriedWaifus = await waifuCollection.find({ userId }).toArray();

  let waifuList = "Not married";
  if (marriedWaifus.length > 0) {
    waifuList = marriedWaifus.map((waifu) => waifu.waifuName).join(", ");
  }

  citel.reply(`*👤User:* _${citel.pushName}_

*🛠️Your Inventory*

*🎗️Level:* _${userq.level}_
*🧧Role:* _${role}_
*👰Waifu:* _${waifuList}_
*☯️Familiar:* _Coming soon_

*Powered by ${tlang().title}*`);
});

// ResetWaifu Command
cmd({
  pattern: "r6789",
  desc: "Divorce everyone from their waifu",
  category: "group",
  filename: __filename,
}, async (Void, citel, text, { isCreator }) => {
  if (!citel.isGroup && !isCreator) return citel.reply("*This command is only for the Owner*");

  const userId = citel.sender;

  // Find all users with waifus
  const usersWithWaifus = await waifuCollection.find({}).toArray();

  if (usersWithWaifus.length === 0) {
    citel.reply("No users are married to any waifu.");
    return;
  }

  // Divorce each user from their waifu
  for (const userWaifu of usersWithWaifus) {
    await waifuCollection.deleteOne({ userId: userWaifu.userId, waifuName: userWaifu.waifuName });
  }

  citel.reply("All users have been divorced from their waifu.");
});

  
/*const { MongoClient } = require('mongodb');
const { cmd, getAdmin, RandomXP, tlang } = require('../lib/');
const waifus = require('../marry-waifu');
const Levels = require("discord-xp");
const { marry } = require('../lib/marry.js');
const schedule = require('node-schedule');
const moment = require('moment-timezone');

const uri = 'mongodb+srv://en:en@cluster0.lfqz6ie.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

const waifuNames = waifus.map((waifu) => waifu.Name).join('\n');

const waifuCollection = client.db('Marry').collection('waifus');

const userWaifuMap = new Map();

function sendGreetings(client, waifuName, userId) {
  const currentTime = moment().tz('Asia/Kolkata');
  const morningTime = moment({ hour: 6, minute: 0, second: 0 });
  const nightTime = moment({ hour: 22, minute: 0, second: 0 });

  if (currentTime.isSameOrAfter(morningTime) && currentTime.isBefore(nightTime)) {
    const morningImageLink = `https://api-d4r1.onrender.com/random/${waifuName}`;
    const morningMessage = `*${waifuName}:* Good morning @${citel.pushName} darling, I hope you have a nice day💖✨!`;
    client.sendMessage(userId, morningMessage, { image: morningImageLink });
  } else {
    const nightImageLink = `https://api-d4r1.onrender.com/random/${waifuName}`;
    const nightMessage = `*${waifuName}:* Good night @${citel.pushName} baby, Sleep well✨💗!`;
    client.sendMessage(userId, nightMessage, { image: nightImageLink });
  }
}

const morningJob = schedule.scheduleJob('0 6 * * *', () => {
  userWaifuMap.forEach((waifuName, userId) => {
    sendGreetings(client, waifuName, userId);
  });
});

const nightJob = schedule.scheduleJob('0 22 * * *', () => {
  userWaifuMap.forEach((waifuName, userId) => {
    sendGreetings(client, waifuName, userId);
  });
});

cmd({
  pattern: "marry",
  alias: ["my", "mine"],
  react: "💍",
  desc: "Marry a waifu from the given list",
  category: "group",
  filename: __filename,
}, async (Void, citel, text, { isCreator }) => {
  if (!citel.isGroup) return citel.reply(tlang().group);

  if (!text) return citel.reply(`👰Whom do you want to marry?\n\n${waifuNames}\n\n*🔰Example:* _<.marry Asuna>_\n\n*📄Note:* You can't marry a waifu who is already married to someone.`);

  const user = citel.sender;

  const currentEngagement = await waifuCollection.findOne({ userId: user });

  if (currentEngagement) {
    const waifuName = currentEngagement.waifuName;

    const marriageMessage = `*💍 You are already married to ${waifuName}.*\n\n_👰You can Summon ${waifuName} using the command <.summon ${waifuName}>_\n\nTo divorce, use _<.divorce ${waifuName}>_`;
    citel.reply(marriageMessage);

    return;
  }

  const waifu = text.split(" ")[0];

  if (!waifus.some((w) => w.Name === waifu)) {
    citel.reply(`🚫 *${waifu}* is not a valid waifu name. Choose from the following:\n\n${waifuNames}`);
    return;
  }

  const existingMarriage = await waifuCollection.findOne({ waifuName: waifu });
  if (existingMarriage) {
    citel.reply(`🚫 *${waifu}* is already married to *${existingMarriage.userId}*\n\nYou can't marry her until the user who is married to her divorces with her.\nPlease marry another waifu from the list. \n\n🎐Type: _<.marry>_ to get the waifu list`);
    return;
  }

  const waifuData = {
    userId: citel.sender,
    waifuName: waifu,
  };

  await waifuCollection.insertOne(waifuData);

  userWaifuMap.set(citel.sender, waifu);

  try {
    const userWaifu = waifus.find((w) => w.Name === waifu);
    if (userWaifu) {
      const marriageMessage = `*🎊Congratulations ${waifu} accepted your proposal.*\n*💖Now you two are officially Married*\n\n_👰Now you can Summon ${waifu} using the command <.summon ${waifu}>_\n\nTo divorce, use _<.divorce ${waifu}>_`;
      const imageLink = userWaifu.ImgLink;
      let buttonMessaged = {
        image: { url: imageLink },
        caption: marriageMessage,
      };
      await Void.sendMessage(citel.chat, buttonMessaged, { quoted: citel });
    } else {
      citel.reply(`🚫 Failed to find information for ${waifu}. Please try again later.`);
    }
  } catch (error) {
    console.error("Error:", error);
    citel.reply("An error occurred while processing your request. Please try again later.");
  }
});

cmd({
  pattern: "divorce",
  desc: "Divorce from a waifu",
  category: "group",
  filename: __filename,
}, async (Void, citel, text, { isCreator }) => {
  if (!citel.isGroup) return citel.reply(tlang().group);

  const groupAdmins = await getAdmin(Void, citel);

  if (!citel.isGroup) return citel.reply("This command is only for groups");
  if (!text) return citel.reply(`👰From whom do you want to divorce?\n\n*🔰Example:* _<.divorce ${waifu}>_`);

  const waifu = text.split(" ")[0];

  const existingMarriage = await waifuCollection.findOne({ waifuName: waifu });

  if (!existingMarriage || existingMarriage.userId !== citel.sender) {
    citel.reply(`🚫 You can't divorce ${waifu} as you are not married to them.`);
    return;
  }

  await waifuCollection.deleteOne({ userId, waifuName });

  userWaifuMap.delete(citel.sender);

  citel.reply(`💔 You are now divorced from ${waifu}.`);

  const divorcedUser = await waifuCollection.findOne({ waifuName: waifu });
  if (divorcedUser) {
    try {
      const divorceMessage = `💔 Your spouse @${parseJid(citel.sender).username} has divorced you. You are now free to marry again.`;
      await Void.sendMessage(divorcedUser.userId, divorceMessage);
    } catch (error) {
      console.error("Error notifying divorced user:", error);
    }
  }
});

cmd({
  pattern: "summon",
  alias: "sum",
  desc: "Summon your married waifu.",
  react: "👰",
  category: "Fun",
  filename: __filename,
}, async (Void, citel, text, { isCreator }) => {
  const user = citel.sender;

  const currentEngagement = await waifuCollection.findOne({ userId: user });

  if (!currentEngagement) {
    citel.reply("🚫 You are not married to any waifu. Use <.marry WaifuName> to marry a waifu.");
    return;
  }

  const waifu = currentEngagement.waifuName;

  const lowercasedText = text.toLowerCase();
  if (lowercasedText.includes(waifu.toLowerCase())) {
    let ter = `*✡️Summoning:* \`\`\`${waifu}\`\`\`\n\n_${marry()}_`;
    let buttonMessaged = {
      image: { url: `https://api-d4r1.onrender.com/random/${waifu}` },
      caption: ter,
    };
    await Void.sendMessage(citel.chat, buttonMessaged, { quoted: citel });
  } else {
    citel.reply(`🚫 You are married to ${waifu}. You can only summon ${waifu}. Use <.summon ${waifu}>.`);
  }
});

cmd({
  pattern: "inventory",
  desc: "View the waifus you are married to.",
  category: "group",
  filename: __filename,
}, async (Void, citel, text, { isCreator }) => {
  if (!citel.isGroup) return citel.reply(tlang().group);

  const userId = citel.sender;

  let meh = citel.sender;
  const userq = await Levels.fetch(userId, "RandomXP");
  const lvpoints = userq.level;
  var role = "*⚠️GOD OF MULTIVERSE*";
  if (lvpoints <= 1) {
    var role = "🏳Slime";
  } else if (lvpoints <= 4) {
    var role = "🧟Goblin";
  } else if (lvpoints <= 6) {
    var role = "👤Goblin Prime";
  } else if (lvpoints <= 8) {
    var role = "🧙‍♂️Goblin Lord";
  } else if (lvpoints <= 10) {
    var role = "🧚🏻Mage";
  } else if (lvpoints <= 12) {
    var role = "🧜Mage Prime";
  } else if (lvpoints <= 14) {
    var role = "🧜‍♂️Master of Mage";
  } else if (lvpoints <= 16) {
    var role = "🌬Nobel";
  } else if (lvpoints <= 18) {
    var role = "❄Nobel Lord";
  } else if (lvpoints <= 20) {
    var role = "⚡Monster";
  } else if (lvpoints <= 22) {
    var role = "🎭Monster Prime";
  } else if (lvpoints <= 24) {
    var role = "🥇Monster lord";
  } else if (lvpoints <= 26) {
    var role = "🥈Hero";
  } else if (lvpoints <= 28) {
    var role = "🥉Elite Hero";
  } else if (lvpoints <= 30) {
    var role = "🎖Supreme Hero";
  } else if (lvpoints <= 32) {
    var role = "🏅King of Heroes";
  } else if (lvpoints <= 34) {
    var role = "🏆God of Heroes";
  } else if (lvpoints <= 36) {
    var role = "💍Devil";
  } else if (lvpoints <= 38) {
    var role = "💎Supreme Devil";
  } else if (lvpoints <= 40) {
    var role = "🔮Devil Lord";
  } else if (lvpoints <= 42) {
    var role = "🛡Demon";
  } else if (lvpoints <= 44) {
    var role = "🎍Supreme Demon";
  } else if (lvpoints <= 46) {
    var role = "⚔Demon King";
  } else if (lvpoints <= 55) {
    var role = "🐉Demon Lord";
  } else if (lvpoints <= 400) {
    var role = "Fat ass🍑🍆";
  }

  const marriedWaifus = await waifuCollection.find({ userId }).toArray();

  let waifuList = "Not married";
  if (marriedWaifus.length > 0) {
    waifuList = marriedWaifus.map((waifu) => waifu.waifuName).join(", ");
  }

  citel.reply(`*👤User:* _${citel.pushName}_

*🛠️Your Inventory*

*🎗️Level:* _${userq.level}_
*🧧Role:* _${role}_
*👰Waifu:* _${waifuList}_
*☯️Familiar:* _Coming soon_

*Powered by ${tlang().title}*`);
});

cmd({
  pattern: "r6789",
  desc: "Divorce everyone from their waifu",
  category: "group",
  filename: __filename,
}, async (Void, citel, text, { isCreator }) => {
  if (!citel.isGroup && !isCreator) return citel.reply("*This command is only for the Owner*");

  const userId = citel.sender;

  const usersWithWaifus = await waifuCollection.find({}).toArray();

  if (usersWithWaifus.length === 0) {
    citel.reply("No users are married to any waifu.");
    return;
  }

  for (const userWaifu of usersWithWaifus) {
    await waifuCollection.deleteOne({ userId: userWaifu.userId, waifuName: userWaifu.waifuName });

    userWaifuMap.delete(userWaifu.userId);
  }

  citel.reply("All users have been divorced from their waifu.");
});*/

  
   
      
  
 
