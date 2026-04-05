const { EmbedBuilder, ApplicationCommandOptionType, ChannelType } = require('discord.js');
const db = require('../../utils/jsondb')
const config = require('../../config.json');

module.exports = {
    name: 'channelinfo',
    description: "Permet d'afficher les information d'un channel.",
    options: [
        {
            name: 'channel',
            description: 'channel',
            required: true,
            type: ApplicationCommandOptionType.Channel
        },
    ],

    run: async (client, interaction) => {
        const channel = interaction.options.getChannel('channel');

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !db.get(`Wl_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous n'avez pas la permission d'executer cette commande.`).setColor("#ED4245")], ephemeral: true })

        if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncement) {

            const embed = new EmbedBuilder()
                .setAuthor({ name: `Informations : #${channel.name}`, iconURL: interaction.guild.iconURL() })
                .setDescription(`> \u{1F4DD} Details du salon **${channel.name}**`)
                .addFields(
                    { name: '\u{1F4CB} Generales', value: `>>> **Nom :** \`${channel.name}\`\n**ID :** \`${channel.id}\`\n**Description :** ${channel.topic || '\`Aucune\`'}\n**NSFW :** \`${channel.nsfw ? 'Oui' : 'Non'}\``, inline: false },
                    { name: '\u{1F4C1} Organisation', value: `>>> **Categorie :** ${channel.parent || '\`Non categorise\`'}\n**Position :** \`${channel.position + 1}\``, inline: true },
                    { name: '\u{1F4C5} Creation', value: `>>> <t:${Date.parse(channel.createdAt) / 1000}:D>\n<t:${Date.parse(channel.createdAt) / 1000}:R>`, inline: true },
                )
                .setColor("#5865F2")
                .setFooter({ text: `Demande par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()

            interaction.reply({ embeds: [embed], ephemeral: true })
        }

        if (channel.type === ChannelType.GuildCategory) {

            const embed = new EmbedBuilder()
                .setAuthor({ name: `Informations : ${channel.name}`, iconURL: interaction.guild.iconURL() })
                .setDescription(`> \u{1F4C1} Details de la categorie **${channel.name}**`)
                .addFields(
                    { name: '\u{1F4CB} Generales', value: `>>> **Nom :** \`${channel.name}\`\n**ID :** \`${channel.id}\`\n**Salons :** \`${channel.children.cache.size}\`\n**Position :** \`${channel.rawPosition}\``, inline: true },
                    { name: '\u{1F4C5} Creation', value: `>>> <t:${Date.parse(channel.createdAt) / 1000}:D>\n<t:${Date.parse(channel.createdAt) / 1000}:R>`, inline: true },
                )
                .setColor("#5865F2")
                .setFooter({ text: `Demande par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()

            interaction.reply({ embeds: [embed], ephemeral: true })
        }

        if (channel.type === ChannelType.GuildVoice) {

            const embed = new EmbedBuilder()
                .setAuthor({ name: `Informations : ${channel.name}`, iconURL: interaction.guild.iconURL() })
                .setDescription(`> \u{1F50A} Details du salon vocal **${channel.name}**`)
                .addFields(
                    { name: '\u{1F4CB} Generales', value: `>>> **Nom :** \`${channel.name}\`\n**ID :** \`${channel.id}\`\n**Bitrate :** \`${channel.bitrate / 1000}kbps\``, inline: true },
                    { name: '\u{1F465} Connexion', value: `>>> **Connectes :** \`${channel.members.size}\`\n**Limite :** \`${channel.userLimit === 0 ? 'Aucune' : channel.userLimit}\``, inline: true },
                    { name: '\u{1F4C5} Creation', value: `>>> <t:${Date.parse(channel.createdAt) / 1000}:D>\n<t:${Date.parse(channel.createdAt) / 1000}:R>`, inline: true },
                )
                .setColor("#5865F2")
                .setFooter({ text: `Demande par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()

            interaction.reply({ embeds: [embed], ephemeral: true })

        }
    }
}
