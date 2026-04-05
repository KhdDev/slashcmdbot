const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js")
const config = require("../../config.json")
const db = require('../../utils/jsondb')

module.exports = {
    name: "unmute",
    description: "Permet de unmute un utilisateur.",
    options: [
        {
            name: 'user',
            description: "user",
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],

    run: async (client, interaction) => {
        let user = interaction.options.getUser("user")
        let member = interaction.guild.members.cache.get(user.id)

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !db.get(`Wl_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous n'avez pas la permission d'executer cette commande.`).setColor("#ED4245")], ephemeral: true })

        member.timeout(null).then(() => {
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Membre unmute', iconURL: user.displayAvatarURL() })
                .setDescription(`> \u{1F50A} **${user.tag}** a ete unmute avec succes.`)
                .addFields(
                    { name: '\u{1F464} Moderateur', value: `>>> ${interaction.user}`, inline: true },
                )
                .setColor("#57F287")
                .setFooter({ text: `ID : ${user.id}` })
                .setTimestamp()

            interaction.reply({ embeds: [embed] })
        })
    }
}
