const { EmbedBuilder } = require("discord.js")
const config = require('../../config.json');
module.exports = {
    name: 'snipe',
    description: "Permet de snipe un message supprimer.",

    run: async (client, interaction) => {

        const msg = client.snipes.get(interaction.channel.id)
        if (!msg) return await interaction.reply({
            embeds: [new EmbedBuilder()
                .setDescription(`> \u{274C} Aucun message supprime trouve dans ce salon`)
                .setColor("#ED4245")
            ], ephemeral: true
        })

        const ID = msg.author.id;
        const member = interaction.guild.members.cache.get(ID)
        const URL = member.displayAvatarURL();

        const embed = new EmbedBuilder()
            .setAuthor({ name: member.user.tag, iconURL: URL })
            .setDescription(`> \u{1F4AC} Message supprime :\n\`\`\`${msg.content}\`\`\``)
            .setColor("#5865F2")
            .setFooter({ text: `Snipe par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()

        if (msg.image) await interaction.reply({
            embeds: [new EmbedBuilder()
                .setDescription(`> \u{274C} Aucun message supprime trouve`)
                .setColor("#ED4245")
            ], ephemeral: true
        })
        await interaction.reply({ embeds: [embed] })
    }
}
