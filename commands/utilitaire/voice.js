const { EmbedBuilder, ChannelType } = require("discord.js")
const config = require('../../config.json');
module.exports = {
    name: 'voice',
    description: "Permet de voir les statistique vocaux.",

    run: async (client, interaction) => {
        var streamingCount = 0;
        var mutedCount = 0;
        var mutedMic = 0;
        var cameraCount = 0;
        var connectedCount = 0;

        const channels = interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice);
        channels.forEach(c => {
            connectedCount += c.members.size;
            c.members.forEach(m => {
                if (m.voice.streaming) streamingCount++;
                if (m.voice.selfDeaf || m.voice.serverDeaf) mutedCount++;
                if (m.voice.selfMute || m.voice.serverMute) mutedMic++;
                if (m.voice.selfVideo) cameraCount++;
            })
        })

        const total = interaction.guild.members.cache.filter(m => m.voice.channel).size;

        const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            .setDescription(`> \u{1F50A} Statistiques vocales du serveur`)
            .addFields(
                { name: '\u{1F3A4} En vocal', value: `>>> \`${total}\` ${total > 1 ? 'personnes' : 'personne'}`, inline: true },
                { name: '\u{1F507} Mute micro', value: `>>> \`${mutedMic}\` ${mutedMic > 1 ? 'personnes' : 'personne'}`, inline: true },
                { name: '\u{1F508} Mute casque', value: `>>> \`${mutedCount}\` ${mutedCount > 1 ? 'personnes' : 'personne'}`, inline: true },
                { name: '\u{1F4FA} En stream', value: `>>> \`${streamingCount}\` ${streamingCount > 1 ? 'personnes' : 'personne'}`, inline: true },
                { name: '\u{1F4F7} En camera', value: `>>> \`${cameraCount}\` ${cameraCount > 1 ? 'personnes' : 'personne'}`, inline: true },
            )
            .setColor("#5865F2")
            .setFooter({ text: `Demande par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()

        interaction.reply({ embeds: [embed] }).catch(() => { })
    }
}
