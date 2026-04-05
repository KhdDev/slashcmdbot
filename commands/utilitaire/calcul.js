const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const config = require('../../config.json');
const math = require('mathjs');

module.exports = {
    name: 'calcul',
    description: "Permet de resoudre n'importe quelle calcul.",

    run: async (client, interaction) => {
        const rows = [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('clear').setStyle(ButtonStyle.Danger).setLabel("AC"),
                new ButtonBuilder().setCustomId('(').setStyle(ButtonStyle.Primary).setLabel("("),
                new ButtonBuilder().setCustomId(')').setStyle(ButtonStyle.Primary).setLabel(")"),
                new ButtonBuilder().setCustomId('/').setStyle(ButtonStyle.Primary).setLabel("\u{2797}"),
            ),
            new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('7').setStyle(ButtonStyle.Secondary).setLabel("7"),
                new ButtonBuilder().setCustomId('8').setStyle(ButtonStyle.Secondary).setLabel("8"),
                new ButtonBuilder().setCustomId('9').setStyle(ButtonStyle.Secondary).setLabel("9"),
                new ButtonBuilder().setCustomId('*').setStyle(ButtonStyle.Primary).setLabel("\u{2716}\u{FE0F}"),
            ),
            new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('4').setStyle(ButtonStyle.Secondary).setLabel("4"),
                new ButtonBuilder().setCustomId('5').setStyle(ButtonStyle.Secondary).setLabel("5"),
                new ButtonBuilder().setCustomId('6').setStyle(ButtonStyle.Secondary).setLabel("6"),
                new ButtonBuilder().setCustomId('-').setStyle(ButtonStyle.Primary).setLabel("\u{2796}"),
            ),
            new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('1').setStyle(ButtonStyle.Secondary).setLabel("1"),
                new ButtonBuilder().setCustomId('2').setStyle(ButtonStyle.Secondary).setLabel("2"),
                new ButtonBuilder().setCustomId('3').setStyle(ButtonStyle.Secondary).setLabel("3"),
                new ButtonBuilder().setCustomId('+').setStyle(ButtonStyle.Primary).setLabel("\u{2795}"),
            ),
            new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('backspace').setStyle(ButtonStyle.Primary).setLabel("\u{2B05}\u{FE0F}"),
                new ButtonBuilder().setCustomId('0').setStyle(ButtonStyle.Secondary).setLabel("0"),
                new ButtonBuilder().setCustomId('.').setStyle(ButtonStyle.Primary).setLabel("."),
                new ButtonBuilder().setCustomId('result').setStyle(ButtonStyle.Success).setLabel("="),
            ),
        ];

        const msg = await interaction.reply({
            components: rows,
            embeds: [{
                author: { name: '\u{1F5A9} Calculatrice', icon_url: interaction.user.displayAvatarURL() },
                description: "```\n\u{1F4DD} Les resultats seront affiches ici !\n```",
                color: 0x5865F2
            }],
            fetchReply: true,
            ephemeral: true,
        });

        let data = "";

        const col = msg.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id,
            time: 600000
        });

        col.on('collect', async (i) => {
            let extra = "";

            if (i.customId === "result") {
                try {
                    data = math.evaluate(data).toString();
                } catch (e) {
                    data = "";
                    extra = "\u{26A0}\u{FE0F} Erreur ! Cliquez sur AC pour recommencer";
                }
            } else if (i.customId === "clear") {
                data = "";
                extra = "\u{1F4DD} Les resultats seront affiches ici"
            } else if (i.customId === "backspace") {
                data = data.slice(0, data.length - 2);
            } else {
                const lc = data[data.length - 1];

                data += `${(
                    (parseInt(i.customId) == i.customId || i.customId === ".")
                    &&
                    (lc == parseInt(lc) || lc === ".")
                ) || data.length === 0 ? "" : " "}` + i.customId;
            }

            i.update({
                embeds: [{
                    color: 0x5865F2,
                    author: { name: '\u{1F5A9} Calculatrice', icon_url: interaction.user.displayAvatarURL() },
                    description: `\`\`\`\n${data || extra}\n\`\`\``
                }]
            })
        })

        col.on('end', () => {
            msg.edit({
                components: [new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel("\u{23F0} Calculatrice expiree")
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId("_1_")
                )]
            })
        })
    }
}
