const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js")
const db = require('../../utils/jsondb')
const config = require('../../config.json');

module.exports = {
    name: "unban",
    description: "Permet de unban un utilisateur.",
    options: [
        {
            name: 'user',
            description: 'user',
            required: true,
            type: ApplicationCommandOptionType.User,
        },
    ],

    run: async (client, interaction) => {

        const user = interaction.options.getUser('user')

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !db.get(`Wl_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous n'avez pas la permission d'executer cette commande.`).setColor("#ED4245")], ephemeral: true })

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Membre unban', iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`> \u{2705} **${user.tag}** a ete unban avec succes.`)
            .addFields(
                { name: '\u{1F464} Moderateur', value: `>>> ${interaction.user}`, inline: true },
            )
            .setColor("#57F287")
            .setFooter({ text: `ID : ${user.id}` })
            .setTimestamp()

        await interaction.guild.bans.fetch().then(async (bans) => {
            if (bans.size == 0) return await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Aucun membre banni sur ce serveur.`).setColor("#ED4245")], ephemeral: true }).catch(() => { })
            let bannedID = bans.find(ban => ban.user.id == user);
            if (!bannedID) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Cet utilisateur n'est pas dans les bannissements.`).setColor("#ED4245")], ephemeral: true }).catch(() => { })
            await interaction.guild.bans.remove(user).catch(err => {
                return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Je ne peux pas unban cet utilisateur.`).setColor("#ED4245")] }).catch(() => { })
            })
        })

        await interaction.reply({ embeds: [embed] }).catch(() => { })
    }
}
