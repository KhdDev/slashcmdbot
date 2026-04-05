const { EmbedBuilder } = require("discord.js")
const db = require('../../utils/jsondb')
const config = require('../../config.json')
module.exports = {
    name: 'serverinfo',
    description: "Permet d'afficher les informations du serveur.",

    run: async (client, interaction) => {
        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !db.get(`Wl_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous n'avez pas la permission d'executer cette commande.`).setColor("#ED4245")], ephemeral: true })
        const guild = interaction.guild;
        const owner = await interaction.guild.fetchOwner()

        const embed = new EmbedBuilder()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
            .setThumbnail(guild.iconURL({ size: 512 }))
            .setDescription(`> \u{1F3E0} Informations sur **${guild.name}**`)
            .addFields(
                { name: '\u{1F4CB} Generales', value: `>>> **ID :** \`${guild.id}\`\n**Proprietaire :** ${owner}\n**Creation :** <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: false },
                { name: '\u{1F465} Membres', value: `>>> **Total :** \`${guild.memberCount}\`\n**En vocal :** \`${guild.members.cache.filter(m => m.voice.channel).size}\``, inline: true },
                { name: '\u{1F4AC} Salons', value: `>>> **Total :** \`${guild.channels.cache.size}\`\n**Roles :** \`${guild.roles.cache.size}\``, inline: true },
                { name: '\u{2728} Extras', value: `>>> **Boosts :** \`${guild.premiumSubscriptionCount}\`\n**Emojis :** \`${guild.emojis.cache.size}\``, inline: true },
            )
            .setColor("#5865F2")
            .setFooter({ text: `Demande par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()

        if (guild.bannerURL()) embed.setImage(guild.bannerURL({ size: 512 }));

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}
