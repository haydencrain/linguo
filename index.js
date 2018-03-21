// Check that node version is the required node version
if (process.version.slice(1).split(".")[0] < 8)
    throw new Error("Node 8.0.0 or higher is required. Please update Node on your system");

const Discord = require("discord.js");


const client = new Discord.Client();

client.config = require ("./config.js");