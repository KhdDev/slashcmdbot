const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
const config = require('../../config.json');
const db = require('../../utils/jsondb');

module.exports = {
    name: 'warn',
    description: "Permet de warn un utilisateur.",
    options: [
        {
            name: 'type',
            description: 'Warn un utilisateur.',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: 'add', value: 'add' },
                { name: 'remove', value: 'remove' },
                { name: 'list', value: 'list' },
                { name: 'clear', value: 'clear' },
            ],
        },
        {
            name: 'user',
            description: 'user',
            required: true,
            type: ApplicationCommandOptionType.User
        },
        {
            name: 'raison',
            description: 'raison',
            required: false,
            type: ApplicationCommandOptionType.String
        }
    ],

    run: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const type = interaction.options.getString('type');
        const raison = interaction.options.getString('raison') || "Aucune raison donnee";

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !db.get(`Wl_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous n'avez pas la permission d'executer cette commande.`).setColor("#ED4245")], ephemeral: true })
        if (user.id === interaction.user.id) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous ne pouvez pas vous warn vous-meme.`).setColor("#ED4245")], ephemeral: true })
        const guildId = interaction.guild.id;
        const member = user.id;
        if (config.owners.includes(member) || db.get(`Owner_${interaction.guild.id}-${member}`)) { return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Impossible de warn un owner.`).setColor("#ED4245")], ephemeral: true }) }
        const avertissement = db.get(`warn_${guildId}-${member}`) || [];

        if (type === 'add') {
            avertissement.push({
                moderator: interaction.user.id,
                reason: raison,
                timestamp: Date.now()
            });
            db.set(`warn_${guildId}-${member}`, avertissement);

            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Avertissement ajoute', iconURL: user.displayAvatarURL() })
                .setDescription(`> \u{26A0}\u{FE0F} **${user.tag}** a recu un avertissement.`)
                .addFields(
                    { name: '\u{1F464} Moderateur', value: `>>> ${interaction.user}`, inline: true },
                    { name: '\u{1F4DD} Raison', value: `>>> \`${raison}\``, inline: true },
                    { name: '\u{1F4CA} Total warns', value: `>>> \`${avertissement.length}\``, inline: true },
                )
                .setColor("#FEE75C")
                .setFooter({ text: `ID : ${user.id}` })
                .setTimestamp()

            interaction.reply({ embeds: [embed] })
        }

        if (type === 'remove') {
            if (avertissement.length === 0) {
                return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} **${user.tag}** n'a aucun avertissement.`).setColor("#ED4245")], ephemeral: true });
            }

            const filter = (response) => response.author.id === interaction.user.id;
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{2753} Quel est le numero de l'avertissement a retirer pour **${user.tag}** ?`).setColor("#5865F2")], ephemeral: true });
            const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 15000 });

            collector.on('collect', (message) => {
                const slm = parseInt(message.content);
                if (isNaN(slm) || slm < 1 || slm > avertissement.length) {
                    return interaction.followUp({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Veuillez fournir un numero valide.`).setColor("#ED4245")], ephemeral: true });
                }

                avertissement.splice(slm - 1, 1);
                db.set(`warn_${guildId}-${member}`, avertissement);
                interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`> \u{2705} L'avertissement **#${slm}** de **${user.tag}** a ete retire.`).setColor("#57F287")], ephemeral: true });
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`> \u{23F0} Temps ecoule. Veuillez reessayer.`).setColor("#ED4245")], ephemeral: true });
                }
            });
        }

        if (type === 'list') {
            if (avertissement.length === 0) {
                return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{2705} **${user.tag}** n'a aucun avertissement.`).setColor("#57F287")], ephemeral: true });
            }

            const warnlist = avertissement.map((warning, index) => `> **#${index + 1}** \u{2500} <@${warning.moderator}>\n> \u{1F4DD} \`${warning.reason}\`\n> \u{1F4C5} <t:${Math.floor(warning.timestamp / 1000)}:R>`);
            const members = interaction.guild.members.cache.get(member);

            const embed = new EmbedBuilder()
                .setAuthor({ name: `Avertissements de ${members.displayName}`, iconURL: members.displayAvatarURL() })
                .setDescription(`> \u{1F4CB} Total : **${avertissement.length}** avertissement(s)\n\n${warnlist.join('\n\n')}`)
                .setColor("#5865F2")
                .setFooter({ text: `Demande par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()
            interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (type === 'clear') {
            if (avertissement.length === 0) {
                return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} **${user.tag}** n'a aucun avertissement.`).setColor("#ED4245")], ephemeral: true });
            }

            const confirmRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('yes')
                        .setLabel('Confirmer')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('\u{2705}'),
                    new ButtonBuilder()
                        .setCustomId('no')
                        .setLabel('Annuler')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('\u{274C}')
                );

            const embed = new EmbedBuilder()
                .setDescription(`> \u{26A0}\u{FE0F} Voulez-vous supprimer **${avertissement.length}** avertissement(s) de **${user.tag}** ?`)
                .setColor("#FEE75C");

            const confirmMessage = await interaction.reply({ embeds: [embed], components: [confirmRow], fetchReply: true, });

            const filter = (i) => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async (i) => {
                if (i.customId === 'yes') {
                    db.delete(`warn_${guildId}-${member}`);
                    const embed = new EmbedBuilder()
                        .setDescription(`> \u{2705} Tous les avertissements de **${user.tag}** ont ete supprimes.`)
                        .setColor("#57F287");
                    confirmMessage.edit({ embeds: [embed], components: [] }).catch(console.error);

                } else if (i.customId === 'no') {
                    const embed = new EmbedBuilder()
                        .setDescription(`> \u{274C} Suppression annulee.`)
                        .setColor("#ED4245");
                    confirmMessage.edit({ embeds: [embed], components: [] }).catch(console.error);
                }
            });

            collector.on('end', () => {
                confirmMessage.edit({ components: [] }).catch(console.error);
            });
        }
    }
};
