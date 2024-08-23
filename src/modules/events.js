const { console } = require("./index");
const { Events } =  require("discord.js");


module.exports = function(client) {
    client.once(Events.ClientReady, readyClient => {
        console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });
}