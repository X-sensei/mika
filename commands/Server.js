const { cmd, tlang, sleep } = require('../lib');
const fetch = require('node-fetch');

// Create a variable to track the automatic restart status
let autoRestartEnabled = true;
const apiKey = '4a703e1c-518d-4d1f-86bf-ae418e902e99'; // Replace with your Heroku API key
const appName = 'gojo01'; // Replace with your Heroku app name

cmd({
    pattern: "autorestart",
    react: "☑️",
    desc: "Enable or disable automatic app restart every 30 minutes",
    category: "tools",
    filename: __filename,
},
async (Void, citel, text, { isCreator }) => {
    if (!isCreator) return citel.reply(tlang().owner);

    autoRestartEnabled = !autoRestartEnabled; // Toggle the automatic restart status

    if (autoRestartEnabled) {
        citel.reply('*⬜Automatic server restart for Gojo Bot every 30 minutes is now enabled.*');
        // Start the automatic restart loop
        startAutoRestartLoop(citel);
    } else {
        citel.reply('*⬛Automatic server restart for Gojo Bot is now disabled.*');
    }
});

// Function to restart the Heroku app
async function restartHerokuApp() {
    // Check the status of the Heroku app
    const statusResponse = await fetch(`https://api.heroku.com/apps/${appName}/dynos`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'application/vnd.heroku+json; version=3'
        }
    });

    if (statusResponse.status === 200) {
        console.log(`*✔️Server for '${appName}' is online.*`);
    } else {
        console.log(`*❌Server for '${appName}' is offline.*`);
    }

    console.log('Restarting');

    // Restart the Heroku app
    const restartResponse = await fetch(`https://api.heroku.com/apps/${appName}/dynos`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'application/vnd.heroku+json; version=3',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'restart': 'true' }),
    });

    if (restartResponse.status === 202) {
        console.log(`Heroku app '${appName}' has been restarted.`);
    } else {
        console.error(`❌Error restarting Server for: ${restartResponse.status}`);
    }
}

// Function to start the automatic restart loop
async function startAutoRestartLoop(citel) {
    while (autoRestartEnabled) {
        // Restart the Heroku app
        restartHerokuApp();
        citel.reply(`*⬜Server for '${appName}' has been automatically restarted.*`);

        // Sleep for 30 minutes (30 minutes * 60 seconds * 1000 milliseconds)
        await sleep(30 * 60 * 1000);
    }
}
