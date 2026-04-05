const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType } = require("discord.js")
const config = require('../../config.json')
module.exports = {
    name: 'userinfo',
    description: "Permet d'afficher les informations de l'utilisateur.",
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
        const member = await interaction.guild.members.cache.get(user.id)
        let nm = ""
        client.guilds.cache.map(r => {
            const list = client.guilds.cache.get(r.id);
            list.members.cache.map(m => (m.user.id == user.id ? nm++ : nm = nm))
        })

        const fetchedUser = await client.users.fetch(user.id, { force: true });
        const bannerUrl = fetchedUser.bannerURL({ size: 2048 });

        const emoji = {
            online: '\u{1F7E2}',
            idle: '\u{1F7E0}',
            dnd: '\u{1F534}',
            offline: '\u{26AB}'
        };
        const status = member.presence?.status;
        const statusText = status ? status.toUpperCase() : 'OFFLINE';

        const embed = new EmbedBuilder()
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setThumbnail(user.displayAvatarURL({ size: 512 }))
            .setDescription(`> \u{1F464} Informations sur <@${user.id}>`)
            .addFields(
                { name: '\u{1F4C5} Compte cree le', value: `>>> <t:${parseInt(user.createdTimestamp / 1000)}:D>\n<t:${parseInt(user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: '\u{1F4E5} A rejoint le', value: `>>> <t:${parseInt(member.joinedTimestamp / 1000)}:D>\n<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: '\u{1F310} Serveurs en commun', value: `>>> \`${nm}\``, inline: true },
                { name: '\u{1F4AC} Statut', value: `>>> ${emoji[status] || emoji.offline} \`${statusText}\``, inline: true },
            )
            .setColor("#5865F2")
            .setFooter({ text: `Demande par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()

        if (bannerUrl) embed.setImage(bannerUrl);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Voir le profil")
                    .setURL("discord://-/users/" + user.id)
                    .setStyle(ButtonStyle.Link)
                    .setEmoji("\u{1F464}"))

        interaction.reply({ embeds: [embed], components: [row] })
    }
}
