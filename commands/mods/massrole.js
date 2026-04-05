const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const config = require('../../config.json');
const db = require('../../utils/jsondb')

module.exports = {
    name: 'massrole',
    description: "Permet de donner un role a tous les utilisateurs du serveur.",
    options: [
        {
            name: 'type',
            description: 'mass role.',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: 'add', value: 'add' },
                { name: 'remove', value: 'remove' },
            ],
        },
        {
            name: 'role',
            description: 'role',
            required: true,
            type: ApplicationCommandOptionType.Role
        }
    ],

    run: async (client, interaction) => {
        const type = interaction.options.getString('type')
        const role = interaction.options.getRole('role');
        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous devez etre \`owner\` pour executer cette commande.`).setColor("#ED4245")], ephemeral: true })

        if (type === "add") {
            let count = 0
            const msg = await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{23F3} Ajout du role \`${role.name}\` a **${interaction.guild.memberCount}** utilisateurs en cours...`).setColor("#FEE75C")], fetchReply: true }).catch(() => { })
            interaction.guild.members.cache.forEach(async (member) => {
                try {
                    await member.roles.add(role, `Massrole (add) par ${interaction.user.tag}`)
                    count++
                    if (count === interaction.guild.memberCount) {
                        msg.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{2705} Le role \`${role.name}\` a ete ajoute a **${interaction.guild.memberCount}** utilisateurs.`).setColor("#57F287").setTimestamp()] })
                    }
                } catch (error) {
                    console.error(`${error}`)
                }
            })

        } else if (type === "remove") {
            let count = 0
            const msg = await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{23F3} Retrait du role \`${role.name}\` a **${interaction.guild.memberCount}** utilisateurs en cours...`).setColor("#FEE75C")], fetchReply: true }).catch(() => { })
            for (const member of interaction.guild.members.cache) {
                try {
                    await member[1].roles.remove(role, `Massrole (remove) par ${interaction.user.tag}`)
                    count++
                    if (count === interaction.guild.memberCount) {
                        msg.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{2705} Le role \`${role.name}\` a ete retire a **${interaction.guild.memberCount}** utilisateurs.`).setColor("#57F287").setTimestamp()] })
                    }
                } catch (error) {
                    console.error(`${error}`)
                }
            }
        }
    }
}
