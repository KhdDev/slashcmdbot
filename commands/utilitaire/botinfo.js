const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const config = require('../../config.json');
module.exports = {
    name: 'botinfo',
    description: "Permet d'afficher les informations du bot.",

    run: async (client, interaction) => {
        const uptime = client.uptime;
        const days = Math.floor(uptime / 86400000);
        const hours = Math.floor(uptime / 3600000) % 24;
        const minutes = Math.floor(uptime / 60000) % 60;
        const seconds = Math.floor(uptime / 1000) % 60;
        const uptimeStr = `${days}j ${hours}h ${minutes}m ${seconds}s`;

        const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL({ size: 512 }))
            .setDescription(`> Voici les informations concernant **${client.user.username}**`)
            .addFields(
                { name: '\u{1F4CB} Informations Generales', value: `>>> **ID :** \`${client.user.id}\`\n**Developeur :** [kml69190](https://github.com/KhdDev)\n**Uptime :** \`${uptimeStr}\``, inline: false },
                { name: '\u{1F4CA} Statistiques', value: `>>> **Serveurs :** \`${client.guilds.cache.size}\`\n**Utilisateurs :** \`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}\`\n**Latence :** \`${client.ws.ping}ms\``, inline: false },
            )
            .setFooter({ text: `Demande par ${interaction.user.tag} | Creation du bot`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp(client.user.createdTimestamp)
            .setColor("#5865F2")

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("GitHub")
                    .setURL("https://github.com/KhdDev")
                    .setStyle(ButtonStyle.Link)
                    .setEmoji("\u{1F517}"),
            )

        interaction.reply({ embeds: [embed], components: [row], ephemeral: true }).catch(() => { })
    }
}
