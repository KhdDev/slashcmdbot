const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js")
const ms = require("ms")
const config = require("../../config.json")
const db = require('../../utils/jsondb')

module.exports = {
    name: "mute",
    description: "Permet de mute un utilisateur.",
    options: [
        {
            name: 'user',
            description: "user",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'time',
            description: "time",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'reason',
            description: 'la raison du mute',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async (client, interaction) => {

        let user = interaction.options.getUser("user")
        let member = interaction.guild.members.cache.get(user.id)
        let time = interaction.options.getString("time")
        let convertedTime = ms(time)
        let reason = interaction.options.getString('reason') || "Aucune raison donnee"

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !db.get(`Wl_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous n'avez pas la permission d'executer cette commande.`).setColor("#ED4245")], ephemeral: true })
        if (config.owners.includes(member.id) || db.get(`Owner_${interaction.guild.id}-${member.id}`)) { return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Impossible de mute un owner.`).setColor("#ED4245")], ephemeral: true }) }

        if (!convertedTime) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Le temps specifie n'est pas valide.`).setColor("#ED4245")], ephemeral: true })

        member.timeout(convertedTime, reason).then(() => {
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Membre mute', iconURL: user.displayAvatarURL() })
                .setDescription(`> \u{1F507} **${user.tag}** a ete mute.`)
                .addFields(
                    { name: '\u{1F464} Moderateur', value: `>>> ${interaction.user}`, inline: true },
                    { name: '\u{23F0} Duree', value: `>>> \`${time}\``, inline: true },
                    { name: '\u{1F4DD} Raison', value: `>>> \`${reason}\``, inline: true },
                )
                .setColor("#FEE75C")
                .setFooter({ text: `ID : ${user.id}` })
                .setTimestamp()

            interaction.reply({ embeds: [embed] })
        })
    }
}
