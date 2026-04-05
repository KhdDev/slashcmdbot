const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const db = require('../../utils/jsondb')
const config = require('../../config.json');

module.exports = {
    name: "allbot",
    description: "Permet de voir la liste des bots.",

    run: async (client, interaction) => {

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous devez etre \`owner\` pour executer cette commande.`).setColor("#ED4245")], ephemeral: true })
        const bots = interaction.guild.members.cache.filter(member => member.user.bot);
        if (bots.size === 0) {
            return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{2705} Aucun bot trouve sur ce serveur.`).setColor("#57F287")], ephemeral: true });
        }

        let p1 = 15;
        let page = 0;
        const botList = bots.map(bot => `> \u{1F916} <@${bot.user.id}> \u{2500} \`${bot.user.id}\``)
        const pages = botList.reduce((acc, curr, i) => {
            if (i % p1 === 0) {
                acc.push([]);
            }
            const pageIndex = acc.length - 1;
            acc[pageIndex].push(curr);
            return acc;
        }, []).map(page => page.join('\n'));

        const banEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Liste des Bots', iconURL: interaction.guild.iconURL() })
            .setDescription(pages[page])
            .setColor("#5865F2")
            .setFooter({ text: `Total : ${bots.size} bot(s) | Page ${page + 1}/${pages.length}` })
            .setTimestamp()

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('retour')
                    .setLabel('\u{25C0} Retour')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('suivant')
                    .setLabel('Suivant \u{25B6}')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(pages.length === 1)
            );

        const msg = await interaction.reply({ embeds: [banEmbed], components: [row], ephemeral: true }).catch(() => { })
        const filter = (interaction) => ['retour', 'suivant'].includes(interaction.customId) && interaction.user.id === interaction.member.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 300000 });

        collector.on('collect', async interaction => {

            if (interaction.user.id !== interaction.member.user.id) {
                return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous n'etes pas l'auteur de cette interaction.`).setColor("#ED4245")], ephemeral: true }).catch(() => { })
            }

            if (interaction.customId === 'suivant') {
                p1 += 15;
                page++;
                banEmbed.setDescription(pages[page + 1]);
                banEmbed.setColor("#5865F2");
                banEmbed.setFooter({ text: `Total : ${bots.size} bot(s) | Page ${page + 1}/${pages.length}` });
                row.components[0].setDisabled(false);
                if (page === pages.length) {
                    row.components[1].setDisabled(true);
                }

            } else if (interaction.customId === 'retour') {
                p1 -= 15;
                page--;
                banEmbed.setDescription(pages[page - 1]);
                banEmbed.setColor("#5865F2");
                banEmbed.setFooter({ text: `Total : ${bots.size} bot(s) | Page ${page + 1}/${pages.length}` });
                row.components[1].setDisabled(false);
                if (page === 1) {
                    row.components[0].setDisabled(true);
                }
            }
            await interaction.update({ embeds: [banEmbed], components: [row], ephemeral: true }).catch(() => { })
        });

        collector.on('end', async () => {
            row.components.forEach(button => button.setDisabled(true));
            await msg.edit({ components: [row] }).catch(() => { })
        });
    }
}
