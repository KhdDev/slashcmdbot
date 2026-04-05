const { EmbedBuilder, ApplicationCommandOptionType, ChannelType } = require('discord.js');
const db = require('../../utils/jsondb');
const config = require('../../config.json');

module.exports = {
    name: 'setsuggest',
    description: "Permet de configurer le salon des suggestions.",
    options: [
        {
            name: 'type',
            description: 'Configurer ou supprimer le salon des suggestions.',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: 'set', value: 'set' },
            ],
        },
        {
            name: 'channel',
            description: 'Salon de suggestions',
            required: true,
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
        },
    ],

    run: async (client, interaction) => {
        const type = interaction.options.getString('type');
        const channel = interaction.options.getChannel('channel');

        if (type === 'set') {
            if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) {
                return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous devez etre \`owner\` pour executer cette commande.`).setColor("#ED4245")], ephemeral: true });
            }

            db.set(`setsuggest_${interaction.guild.id}`, channel.id);
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription(`> \u{2705} Le salon de suggestions a ete configure sur ${channel}.`)
                    .setColor("#57F287")
                    .setFooter({ text: `Par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                    .setTimestamp()
                ], ephemeral: true
            });
        }
    }
}
