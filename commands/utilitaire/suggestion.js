const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
const db = require('../../utils/jsondb');
const config = require('../../config.json');

const cooldowns = new Map();

module.exports = {
    name: 'suggestion',
    description: "Permet d'envoyez une suggestion.",
    options: [
        {
            name: 'message',
            description: 'Envoyez une suggestion.',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],

    run: async (client, interaction) => {
        const message = interaction.options.getString('message');

        let accepte = 0;
        let refuse = 0;

        const suggestionEmbed = new EmbedBuilder()
            .setAuthor({ name: `Suggestion de ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`\`\`\`${message}\`\`\``)
            .addFields(
                { name: '\u{2705} Accepter', value: `> **${accepte}** vote(s)`, inline: true },
                { name: '\u{274C} Refuser', value: `> **${refuse}** vote(s)`, inline: true }
            )
            .setThumbnail(interaction.user.displayAvatarURL())
            .setColor("#5865F2")
            .setFooter({ text: `ID : ${interaction.user.id}` })
            .setTimestamp();

        const oui = new ButtonBuilder()
            .setCustomId('accepter')
            .setLabel('Accepter')
            .setStyle(ButtonStyle.Success)
            .setEmoji('\u{2705}');

        const non = new ButtonBuilder()
            .setCustomId('refuser')
            .setLabel('Refuser')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('\u{274C}');

        const row = new ActionRowBuilder()
            .addComponents(oui, non);

        const suggestionChannelId = db.get(`setsuggest_${interaction.guild.id}`);
        const suggestionChannel = interaction.guild.channels.cache.get(suggestionChannelId);

        if (!suggestionChannel || !suggestionChannel.isTextBased()) {
            return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} La commande n'est pas configuree.`).setColor("#ED4245")], ephemeral: true });
        }

        if (interaction.channelId !== suggestionChannelId) {
            return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Veuillez soumettre votre suggestion dans <#${suggestionChannelId}>.`).setColor("#ED4245")], ephemeral: true });
        }

        if (cooldowns.has(interaction.user.id)) {
            const cooldownEnd = cooldowns.get(interaction.user.id);
            const timeRemaining = cooldownEnd - Date.now();

            if (timeRemaining > 0) {
                const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
                const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{23F0} Vous devez attendre encore **${hoursRemaining}h ${minutesRemaining}m** avant de pouvoir soumettre une nouvelle suggestion.`).setColor("#FEE75C")], ephemeral: true });
            }
        }

        suggestionChannel.send({ embeds: [suggestionEmbed], components: [row] })
            .then((message) => {
                const filter = (i) => i.customId === 'accepter' || i.customId === 'refuser';
                const collector = message.createMessageComponentCollector({ filter });
                const voters = new Set();

                collector.on('collect', (i) => {
                    if (voters.has(i.user.id)) {
                        i.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous avez deja vote.`).setColor("#ED4245")], ephemeral: true });
                        return;
                    }

                    voters.add(i.user.id);

                    if (i.customId === 'accepter') {
                        accepte++;
                    } else if (i.customId === 'refuser') {
                        refuse++;
                    }

                    const updatedEmbed = EmbedBuilder.from(suggestionEmbed).setFields(
                        { name: '\u{2705} Accepter', value: `> **${accepte}** vote(s)`, inline: true },
                        { name: '\u{274C} Refuser', value: `> **${refuse}** vote(s)`, inline: true }
                    );

                    i.update({ embeds: [updatedEmbed] });
                });
            });

        const cooldownEnd = Date.now() + 3 * 60 * 60 * 1000;
        cooldowns.set(interaction.user.id, cooldownEnd);

        setTimeout(() => {
            cooldowns.delete(interaction.user.id);
        }, 180 * 60 * 1000);

        interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{2705} Votre suggestion a bien ete envoyee dans <#${suggestionChannelId}>.`).setColor("#57F287")], ephemeral: true });
    }
};
