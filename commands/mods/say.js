const { ApplicationCommandOptionType } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const db = require('../../utils/jsondb')
const config = require('../../config.json');

module.exports = {
    name: 'say',
    description: "Permet de faire dire une phrase au bot.",
    options: [
        {
            name: 'message',
            description: 'message',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
    run: async (client, interaction) => {
        const message = interaction.options.getString('message')

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous devez etre \`owner\` pour executer cette commande.`).setColor("#ED4245")], ephemeral: true })
        await interaction.deferReply();
        await interaction.deleteReply();
        await interaction.channel.send(message)
    }
}
