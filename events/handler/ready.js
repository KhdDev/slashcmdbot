const { ApplicationCommandType } = require('discord.js');
const register = require('../../utils/slashsync');
module.exports = async (client) => {
  await register(client, client.register_arr.map((command) => ({
    name: command.name,
    description: command.description,
    options: command.options,
    type: ApplicationCommandType.ChatInput
  })), {
    debug: true,
    guildId: '1415035663648030722'
  });
  console.log(`[ / | Slash Command ] - Loaded all slash commands!`)
  console.log(`Connecte sur ${client.user.tag}`);
};
