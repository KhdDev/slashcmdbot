const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js")
const ms = require("ms")
const db = require('../../utils/jsondb')
const config = require('../../config.json');

module.exports = {
    name: "slowmode",
    description: "Permet de mettre un ralentissement au channel.",
    options: [
        {
            name: "time",
            description: "time",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    run: async (client, interaction) => {
        const time = interaction.options.getString("time")

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous devez etre \`owner\` pour executer cette commande.`).setColor("#ED4245")], ephemeral: true })
        const DejaSlowmode = interaction.channel.rateLimitPerUser;
        const slowmode = ms(time) / 1000

        if (time >= 21600) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Le mode lent ne peut pas depasser \`6 heures\`.`).setColor("#ED4245")], ephemeral: true })
        if (DejaSlowmode === slowmode) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Le mode lent est deja defini sur \`${time}\`.`).setColor("#ED4245")], ephemeral: true });

        interaction.channel.setRateLimitPerUser(slowmode).then(() => {
            const embed = new EmbedBuilder()
                .setDescription(`> \u{1F422} Le mode lent a ete defini sur **${time}**.`)
                .setColor("#5865F2")
                .setFooter({ text: `Par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()
            interaction.reply({ embeds: [embed] })
        }).catch(error => {
            console.error(error);
        });
    }
}
