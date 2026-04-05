const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js")
const db = require('../../utils/jsondb')
const config = require('../../config.json');

module.exports = {
    name: "adminrole",
    description: "Permet de voir la liste de tout les roles administrateur du serveur.",

    run: async (client, interaction) => {

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous devez etre \`owner\` pour executer cette commande.`).setColor("#ED4245")], ephemeral: true })
        const str_filtrer = interaction.guild.roles.cache.filter(role => role.permissions.has(PermissionFlagsBits.Administrator))
        if (str_filtrer.size === 0) {
            return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{2705} Aucun role administrateur trouve.`).setColor("#57F287")], ephemeral: true });
        }

        let p1 = 15;
        let page = 0;
        const adminList = str_filtrer.map(role => `> \u{1F3F7}\u{FE0F} ${role} \u{2500} \`${role.id}\``)
        const pages = adminList.reduce((acc, curr, i) => {
            if (i % p1 === 0) {
                acc.push([]);
            }
            const pageIndex = acc.length - 1;
            acc[pageIndex].push(curr);
            return acc;
        }, []).map(page => page.join('\n'));

        const banEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Roles Administrateur', iconURL: interaction.guild.iconURL() })
            .setDescription(pages[page])
            .setColor("#5865F2")
            .setFooter({ text: `Total : ${str_filtrer.size} role(s) | Page ${page + 1}/${pages.length}` })
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
                banEmbed.setFooter({ text: `Total : ${str_filtrer.size} role(s) | Page ${page + 1}/${pages.length}` });
                row.components[0].setDisabled(false);
                if (page === pages.length) {
                    row.components[1].setDisabled(true);
                }

            } else if (interaction.customId === 'retour') {
                p1 -= 15;
                page--;
                banEmbed.setDescription(pages[page - 1]);
                banEmbed.setColor("#5865F2");
                banEmbed.setFooter({ text: `Total : ${str_filtrer.size} role(s) | Page ${page + 1}/${pages.length}` });
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
