const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js")
const db = require('../../utils/jsondb')
const config = require('../../config.json');

module.exports = {
    name: 'derank',
    description: "Permet de retirer les role d'un utilisateur.",
    options: [
        {
            name: 'user',
            description: 'user',
            required: true,
            type: ApplicationCommandOptionType.User,
        },
    ],

    run: async (client, interaction) => {

        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => { })
        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !db.get(`Wl_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous n'avez pas la permission d'executer cette commande.`).setColor("#ED4245")], ephemeral: true })

        if (config.owners.includes(member.id) || db.get(`Owner_${interaction.guild.id}-${member.id}`)) { return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Impossible de derank un owner.`).setColor("#ED4245")], ephemeral: true }) }

        if (interaction.member.roles.highest.position <= member.roles.highest.position)
            return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Ce membre a un rang superieur ou egal au votre.`).setColor("#ED4245")], ephemeral: true });

        member.roles.set([], `Derank par ${interaction.user.tag}`)
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Membre derank', iconURL: member.user.displayAvatarURL() })
            .setDescription(`> \u{1F4C9} **${member.user.tag}** a ete derank avec succes.`)
            .addFields(
                { name: '\u{1F464} Moderateur', value: `>>> ${interaction.user}`, inline: true },
            )
            .setColor("#ED4245")
            .setFooter({ text: `ID : ${member.user.id}` })
            .setTimestamp()
        interaction.reply({ embeds: [embed] })
    }
}
