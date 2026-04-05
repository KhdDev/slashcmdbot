const { EmbedBuilder, ApplicationCommandOptionType, ChannelType } = require('discord.js');
const db = require('../../utils/jsondb')
const config = require('../../config.json');

module.exports = {
    name: 'voicemove',
    description: "Permet de deplacer tout les utilisateurs dans un channel.",
    options: [
        {
            name: 'channel',
            description: 'channel',
            required: true,
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildVoice]
        },
    ],

    run: async (client, interaction) => {
        const channel = interaction.options.getChannel('channel');
        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous n'avez pas la permission d'executer cette commande.`).setColor("#ED4245")], ephemeral: true })

        const voc = interaction.member.voice.channel;
        if (!voc) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous devez etre dans un salon vocal.`).setColor("#ED4245")], ephemeral: true });

        const memberCount = voc.members.size;
        voc.members.forEach(async (m) => {
            m.voice.setChannel(channel)
        })

        const embed = new EmbedBuilder()
            .setDescription(`> \u{1F4E4} **${memberCount}** utilisateur(s) ont ete deplaces vers ${channel}.`)
            .setColor("#57F287")
            .setFooter({ text: `Par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()

        await interaction.reply({ embeds: [embed] })
    }
}
