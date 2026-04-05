const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType } = require("discord.js")
const config = require('../../config.json');

module.exports = {
    name: 'avatar',
    description: "Permet de voir la photo de profil d'un utilisateur.",
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

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("PNG")
                    .setURL(user.displayAvatarURL({ extension: "png", size: 512 }))
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setLabel("JPG")
                    .setURL(user.displayAvatarURL({ extension: "jpg", size: 512 }))
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setLabel("WEBP")
                    .setURL(user.displayAvatarURL({ extension: "webp", size: 512 }))
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setLabel("GIF")
                    .setURL(user.displayAvatarURL({ extension: "gif", size: 512 }))
                    .setStyle(ButtonStyle.Link),
            )

        const embed = new EmbedBuilder()
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setDescription(`> \u{1F5BC}\u{FE0F} Avatar de **${user.username}**`)
            .setColor("#5865F2")
            .setImage(user.displayAvatarURL({ size: 512 }))
            .setFooter({ text: `Demande par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()

        interaction.reply({ embeds: [embed], components: [row] })
    },
};
