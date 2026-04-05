const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const db = require('../../utils/jsondb');
const config = require('../../config.json');
module.exports = {
    name: 'soutien',
    description: "Permet de configurer la commande soutien.",
    options: [
        {
            name: 'type',
            description: 'Configurer la commande soutien.',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: 'set', value: 'set' },
                { name: 'remove', value: 'remove' },
            ],
        },
        {
            name: 'role',
            description: 'role a mettre',
            required: true,
            type: ApplicationCommandOptionType.Role,
        },
        {
            name: 'statut',
            description: 'statut a mettre',
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    run: async (client, interaction) => {
        const type = interaction.options.getString('type')
        const statut = interaction.options.getString('statut')
        const role = interaction.options.getRole('role');

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous devez etre \`owner\` pour executer cette commande.`).setColor("#ED4245")], ephemeral: true })
        if (type === 'set') {
            await db.set(`role_${interaction.guild.id}`, role.id);
            await db.set(`statut_${interaction.guild.id}`, statut);
            const embed = new EmbedBuilder()
                .setDescription(`> \u{2705} Les membres avec le statut \`${statut}\` recevront le role ${role}.`)
                .setColor("#57F287")
                .setFooter({ text: `Par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()
            return interaction.reply({ embeds: [embed] })

        } else if (type === "remove") {

            await db.delete(`role_${interaction.guild.id}`);
            await db.delete(`statut_${interaction.guild.id}`);
            const embed = new EmbedBuilder()
                .setDescription(`> \u{2705} Le systeme de soutien a ete supprime avec succes.`)
                .setColor("#57F287")
                .setFooter({ text: `Par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()
            return interaction.reply({ embeds: [embed], ephemeral: true })

        }
    }
}
