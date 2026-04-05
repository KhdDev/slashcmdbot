const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'ping',
    description: "Permet de voir la latence du bot.",

    run: async (client, interaction) => {

        try {
            const mesg = await interaction.reply({ content: "\u{23F3} Calcul en cours...", fetchReply: true });

            const botLatency = mesg.createdTimestamp - interaction.createdTimestamp;
            const wsLatency = client.ws.ping;

            const getStatus = (ms) => ms < 100 ? '\u{1F7E2}' : ms < 200 ? '\u{1F7E1}' : '\u{1F534}';

            const embed = new EmbedBuilder()
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setDescription(`> \u{1F3D3} Voici la latence du bot`)
                .addFields(
                    { name: '\u{1F4E1} Bot', value: `>>> ${getStatus(botLatency)} \`${botLatency}ms\``, inline: true },
                    { name: '\u{1F310} Websocket', value: `>>> ${getStatus(wsLatency)} \`${wsLatency}ms\``, inline: true },
                )
                .setColor("#5865F2")
                .setFooter({ text: `Demande par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()

            await interaction.editReply({ content: null, embeds: [embed] });
        } catch (err) {
            console.log(err);
        }
    }
}
