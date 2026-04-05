const { EmbedBuilder, ApplicationCommandOptionType, ChannelType } = require('discord.js');
const db = require('../../utils/jsondb')
const config = require('../../config.json');

module.exports = {
    name: 'renew',
    description: "Permet de renew un channel.",
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
        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous n'avez pas la permission d'executer cette commande.`).setColor("#ED4245")], ephemeral: true })

        if (channel === interaction.channel) {
            try {
                let ee = await channel.clone({
                    name: channel.name,
                    permissions: channel.permissionOverwrites,
                    type: channel.type,
                    topic: channel.topic,
                    nsfw: channel.nsfw,
                    bitrate: channel.bitrate,
                    userLimit: channel.userLimit,
                    rateLimitPerUser: channel.rateLimitPerUser,
                    position: channel.rawPosition,
                    reason: `Salon recree par ${interaction.user.tag} (${interaction.user.id})`
                })
                channel.delete()
                const embed = new EmbedBuilder()
                    .setDescription(`> \u{1F504} Salon recree avec succes par ${interaction.user}.`)
                    .setColor("#57F287")
                    .setTimestamp()
                ee.send({ embeds: [embed] })
            } catch (error) {
                return;
            }
        } else {

            try {
                let ee = await channel.clone({
                    name: channel.name,
                    permissions: channel.permissionOverwrites,
                    type: channel.type,
                    topic: channel.topic,
                    nsfw: channel.nsfw,
                    bitrate: channel.bitrate,
                    userLimit: channel.userLimit,
                    rateLimitPerUser: channel.rateLimitPerUser,
                    position: channel.rawPosition,
                    reason: `Salon recree par ${interaction.user.tag} (${interaction.user.id})`
                })
                channel.delete()
                const embed = new EmbedBuilder()
                    .setDescription(`> \u{1F504} Salon recree avec succes par ${interaction.user}.`)
                    .setColor("#57F287")
                    .setTimestamp()
                ee.send({ embeds: [embed] })

            } catch (error) {
                return;
            }

            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{2705} Le salon **${channel.name}** a ete recree.`).setColor("#57F287")], ephemeral: true })
        }
    }
}
