const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js")
const db = require('../../utils/jsondb')
const config = require('../../config.json');

module.exports = {
    name: "kick",
    description: "Permet de kick un utilisateur.",
    options: [
        {
            name: 'user',
            description: 'user',
            required: true,
            type: ApplicationCommandOptionType.User,
        },
        {
            name: "raison",
            description: "Ajouter la raison du kick.",
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    run: async (client, interaction) => {

        const user = interaction.options.getUser('user')
        const raison = interaction.options.getString('raison') || "Aucune raison donnee"
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => { })

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !db.get(`Wl_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous n'avez pas la permission d'executer cette commande.`).setColor("#ED4245")], ephemeral: true })

        if (config.owners.includes(member.id) || db.get(`Owner_${interaction.guild.id}-${member.id}`)) { return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Impossible de kick un owner.`).setColor("#ED4245")], ephemeral: true }) }

        if (!member) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Impossible d'obtenir les details du membre.`).setColor("#ED4245")], ephemeral: true });
        if (!member.kickable || member.user.id === client.user.id)
            return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Je n'arrive pas a kick ce membre.`).setColor("#ED4245")], ephemeral: true });

        if (interaction.member.roles.highest.position <= member.roles.highest.position)
            return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Ce membre a un rang superieur ou egal au votre.`).setColor("#ED4245")], ephemeral: true });

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Membre kick', iconURL: member.user.displayAvatarURL() })
            .setDescription(`> \u{1F462} **${member.user.tag}** a ete kick du serveur.`)
            .addFields(
                { name: '\u{1F464} Moderateur', value: `>>> ${interaction.user}`, inline: true },
                { name: '\u{1F4DD} Raison', value: `>>> \`${raison}\``, inline: true },
            )
            .setColor("#FEE75C")
            .setFooter({ text: `ID : ${member.user.id}` })
            .setTimestamp()

        member.kick(raison).catch(() => { })

        return interaction.reply({ embeds: [embed] })

    },
};
