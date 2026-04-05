const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js")
const config = require('../../config.json');
const db = require('../../utils/jsondb')
const axios = require('axios')

module.exports = {
    name: 'emoji',
    description: "Permet de creer des emoji sur le serveur.",
    options: [
        {
            name: 'type',
            description: 'Creation d\'emoji.',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: 'add', value: 'add' },
            ],
        },
        {
            name: 'emoji',
            description: 'emoji',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'name',
            description: 'name',
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],

    run: async (client, interaction) => {
        let type = interaction.options.getString('type')
        let emoji = interaction.options.getString('emoji')?.trim()
        const name = interaction.options.getString('name')
        if (type === 'add') {
            if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous devez etre \`owner\` pour executer cette commande.`).setColor("#ED4245")], ephemeral: true })

            if (emoji.startsWith("<") && emoji.endsWith(">")) {
                const id = emoji.match(/\d{15,}/g)[0]

                const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
                    .then(image => {
                        if (image) return "gif"
                        else return "png"
                    }).catch(err => {
                        return "png"
                    })

                emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
            }

            interaction.guild.emojis.create({ attachment: emoji, name: name })
                .then(emoji => {
                    const embed = new EmbedBuilder()
                        .setDescription(`> \u{2705} L'emoji ${emoji.toString()} a ete ajoute avec le nom **\`${emoji.name}\`**.`)
                        .setColor("#57F287")
                        .setFooter({ text: `Par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                        .setTimestamp()

                    return interaction.reply({ embeds: [embed] })
                }).catch(err => {
                    return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Impossible d'ajouter l'emoji.`).setColor("#ED4245")], ephemeral: true })
                })
        }
    }
}
