const { EmbedBuilder, ApplicationCommandOptionType, ChannelType, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/jsondb')
const config = require('../../config.json');

module.exports = {
    name: 'lock',
    description: "Permet de lock un channel.",
    options: [
        {
            name: 'channel',
            description: 'channel',
            required: true,
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText]
        },
    ],

    run: async (client, interaction) => {
        const channel = interaction.options.getChannel('channel');
        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !db.get(`Wl_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous n'avez pas la permission d'executer cette commande.`).setColor("#ED4245")], ephemeral: true })

        if (channel.permissionsFor(interaction.guild.id).has(PermissionFlagsBits.SendMessages) === false) {
            return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Le salon ${channel} est deja verrouille.`).setColor("#ED4245")] });
        }
        channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: false })

        const embed = new EmbedBuilder()
            .setDescription(`> \u{1F512} Le salon ${channel} a ete **verrouille** avec succes.`)
            .setColor("#ED4245")
            .setFooter({ text: `Par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()

        await interaction.reply({ embeds: [embed] })
    }
}
