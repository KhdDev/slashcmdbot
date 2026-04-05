const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const db = require('../../utils/jsondb')
const config = require('../../config.json');

module.exports = {
    name: 'clear',
    description: "Permet de clear des messages.",
    options: [
        {
            name: 'amount',
            description: 'amount',
            required: true,
            type: ApplicationCommandOptionType.Integer,
        },
    ],

    run: async (client, interaction) => {

        const amount = interaction.options.getInteger('amount')

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !db.get(`Wl_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous n'avez pas la permission d'executer cette commande.`).setColor("#ED4245")], ephemeral: true })
        if (isNaN(amount)) {
            return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Veuillez specifier une valeur entre \`1\` et \`100\`.`).setColor("#ED4245")], ephemeral: true })
        }

        if (parseInt(amount) > 100) {
            return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Je ne peux supprimer que \`100\` messages maximum.`).setColor("#ED4245")], ephemeral: true })
        } else {
            try {
                let { size } = await interaction.channel.bulkDelete(amount)
                await interaction.reply({ embeds: [new EmbedBuilder()
                    .setDescription(`> \u{1F9F9} **${size}** messages ont ete supprimes avec succes.`)
                    .setColor("#57F287")
                    .setFooter({ text: `Par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                    .setTimestamp()
                ], ephemeral: true })
            } catch (e) {
                console.log(e)
                interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Impossible de supprimer les messages datant de plus de 14 jours.`).setColor("#ED4245")], ephemeral: true })
            }
        }
    }
}
