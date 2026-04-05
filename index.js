const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const db = require("./utils/jsondb");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

const fs = require("fs");
const config = require("./config.json");
client.config = config;

const loadCommands = (directory) => {
  fs.readdir(directory, (_err, files) => {
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`${directory}/${file}`);
      let commandName = file.split(".")[0];
      client.interactions.set(commandName, {
        name: commandName,
        ...props
      });
      client.register_arr.push(props);
    });
  });
};

const loadEvents = (directory) => {
  fs.readdir(directory, (_err, files) => {
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      const event = require(`${directory}/${file}`);
      let eventName = file.split(".")[0];
      console.log(`[Event]   Loaded: ${eventName}`);
      client.on(eventName, event.bind(null, client));
      delete require.cache[require.resolve(`${directory}/${file}`)];
    });
  });
};

const directories = [
  "./commands/mods",
  "./commands/owner",
  "./commands/utilitaire",
  "./commands/gestion"
];

loadEvents("./events/handler");

client.interactions = new Collection();
client.register_arr = [];

directories.forEach(directory => {
  loadCommands(directory);
});

client.snipes = new Map();

client.on("messageDelete", function (message, channel) {
  client.snipes.set(message.channel.id, {
    content: message.content,
    author: message.author,
    image: message.attachments.first() ? message.attachments.first().proxyURL : null
  });
});

client.login(config.token);
