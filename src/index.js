const modules = require("./modules/index");
const console = modules.console;
const startTime = new Date().getTime();


function exit(issue) {
    console.fatal(issue);
    console.notice(`Fatal Error Occurred, Exiting...`);

    return process.exit(1);
}

function initConfig() {
    try {
        process.config = require("./../config");
    } catch {
        return exit("Error loading config.js");
    }
}

function initCore() {
    try {
    } catch (error) {
        return exit("Error loading core");
    }
}

try {
    console.log("Initializing...");

    // Get Packages
    const { Client, Events, GatewayIntentBits } = require("discord.js");
    require('dotenv').config();

    // Get Config Data
    initConfig();

    // Start Discord Client
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });

    client.config = process.config;
    client.modules = modules;
    client.database = modules.database();
    client.api = modules.api(client);

    client.login(process.env.BOT_TOKEN).then(initCore).catch(exit).finally(function() {
        console.info(`Bot Is Online, Took ${(new Date().getTime() - startTime)} Seconds!`);
    })
} catch (error) {
    return exit(`Failed To Initialize Due To: ${error.stack ? error.stack : error}`);
}