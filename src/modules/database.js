const { console } = require("./index");
const SuchDB = require("@sectly-studios/suchdb");

function createDatabase(type) {
    const database = SuchDB.SuchDB({
        master: `./src/data/${type}`,
        autosave: true,
        autoload: true,
        encrypt: {
            enabled: true,
            key: process.env.DATABASE_KEY || "Venue",
        },
        autobackup: true,
        logging: false,
    });

    database.set("Venue", true);

    return database;
}

module.exports = function () {
    return {
        servers: createDatabase("servers"), // Per Server
        users: createDatabase("users"), // Shared
    }
}