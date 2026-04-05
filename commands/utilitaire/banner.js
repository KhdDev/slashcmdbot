const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType } = require("discord.js")
const config = require('../../config.json');
const axios = require('axios')

module.exports = {
    name: 'banner',
    description: "Permet de voir la banniere d'un utilisateur.",
    options: [
        {
            name: 'user',
            description: 'user',
            required: false,
            type: ApplicationCommandOptionType.User,
        },
    ],

    run: async (client, interaction) => {
        const user = interaction.options.getUser('user') || interaction.user;

        const fetchedUser = await client.users.fetch(user.id, { force: true });
        const bannerUrl = fetchedUser.bannerURL({ size: 4096 });

        if (bannerUrl) {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Telecharger")
                        .setURL(bannerUrl)
                        .setStyle(ButtonStyle.Link)
                        .setEmoji("\u{1F4E5}"))

            const embed = new EmbedBuilder()
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .setDescription(`> \u{1F3A8} Banniere de **${user.username}**`)
                .setColor("#5865F2")
                .setImage(bannerUrl)
                .setFooter({ text: `Demande par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()

            interaction.reply({ embeds: [embed], components: [row] })

        } else {
            const embed = new EmbedBuilder()
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .setDescription(`> \u{274C} **${user.username}** n'a pas de banniere`)
                .setColor("#ED4245")
                .setFooter({ text: `Demande par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()

            interaction.reply({ embeds: [embed] })
        }
    }
}
