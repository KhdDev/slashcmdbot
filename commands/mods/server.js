const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType, ChannelType, PermissionFlagsBits } = require('discord.js')
const config = require('../../config.json');
const db = require('../../utils/jsondb')
module.exports = {
    name: 'server',
    description: 'Permet de voir la liste des serveurs ou le bot se trouve.',
    options: [
        {
            name: 'type',
            description: 'Type d\'action a effectuer sur le serveur.',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: 'list', value: 'list' },
                { name: 'invite', value: 'invite' },
                { name: 'leave', value: 'leave' },
            ],
        },
        {
            name: 'serveur',
            description: 'Nom du serveur concerne par l\'action (optionnel).',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],

    run: async (client, interaction) => {
        const type = interaction.options.getString('type');
        const serveur = interaction.options.getString('serveur');

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous devez etre \`owner\` pour executer cette commande.`).setColor("#ED4245")], ephemeral: true })


        if (type === 'invite') {
            if (!serveur) {
                return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Veuillez entrer l'ID d'un serveur.`).setColor("#ED4245")] });
            }

            const guild = client.guilds.cache.get(serveur);

            if (!guild) {
                return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Aucun serveur trouve pour l'ID \`${serveur}\`.`).setColor("#ED4245")] });
            }

            const tChannel = guild.channels.cache.find((ch) => ch.type === ChannelType.GuildText && ch.permissionsFor(guild.members.me).has(PermissionFlagsBits.CreateInstantInvite));

            if (!tChannel) {
                return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Aucun salon trouve pour creer une invitation sur **${guild.name}**.`).setColor("#ED4245")] });
            }

            const invite = await tChannel.createInvite({ temporary: false, maxAge: 0 });

            const embed = new EmbedBuilder()
                .setAuthor({ name: `Invitation : ${guild.name}`, iconURL: guild.iconURL() })
                .setThumbnail(guild.iconURL())
                .setDescription(`> \u{1F517} Lien d'invitation : ${invite.url}`)
                .addFields(
                    { name: '\u{1F4CB} ID', value: `>>> \`${guild.id}\``, inline: true },
                    { name: '\u{1F465} Membres', value: `>>> \`${guild.memberCount}\``, inline: true },
                )
                .setColor("#57F287")
                .setTimestamp()

            return interaction.reply({ embeds: [embed] });
        }

        if (type === 'leave') {
            const guild = serveur ? client.guilds.cache.get(serveur) : interaction.guild;

            if (!guild) {
                return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Aucun serveur trouve pour \`${serveur}\`.`).setColor("#ED4245")] });
            }

            guild.leave();
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{2705} J'ai quitte le serveur **${guild.name}**.`).setColor("#57F287").setTimestamp()] });
        }

        if (type === 'list') {
            var str_filtrer = client.guilds.cache

            let p0 = 0;
            let p1 = 15;
            let page = 0;

            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Liste des serveurs', iconURL: client.user.displayAvatarURL() })
                .setDescription(str_filtrer
                    .map(r => r)
                    .map((m, i) => `> \`${i + 1}.\` **${m.name}** \u{2500} \`${m.id}\` \u{2500} \`${m.memberCount}\` membres`)
                    .slice(p0, p1).join("\n")
                )
                .setColor("#5865F2")
                .setFooter({ text: `Total : ${str_filtrer.size} serveur(s) | Page ${page + 1}` })
                .setTimestamp()

            if (str_filtrer.size <= 15) {
                return interaction.reply({ embeds: [embed] });
            }

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('allserv1')
                        .setLabel('\u{25C0}')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('allserv2')
                        .setLabel('\u{25B6}')
                        .setStyle(ButtonStyle.Secondary)
                );

            const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

            const collector = msg.createMessageComponentCollector({ time: 300000 });

            collector.on('collect', async (i) => {
                if (i.user.id !== interaction.user.id) return;

                if (i.customId === 'allserv1') {
                    p0 -= 15;
                    p1 -= 15;
                    page--;
                } else if (i.customId === 'allserv2') {
                    p0 += 15;
                    p1 += 15;
                    page++;
                }

                row.components[0].setDisabled(p0 <= 0);
                row.components[1].setDisabled(p1 >= str_filtrer.size);

                embed.setDescription(str_filtrer
                    .map(r => r)
                    .map((m, i) => `> \`${i + 1}.\` **${m.name}** \u{2500} \`${m.id}\` \u{2500} \`${m.memberCount}\` membres`)
                    .slice(p0, p1).join("\n")
                );
                embed.setFooter({ text: `Total : ${str_filtrer.size} serveur(s) | Page ${page + 1}` });

                await i.update({ embeds: [embed], components: [row] });
            });

            collector.on('end', () => {
                row.components.forEach(b => b.setDisabled(true));
                msg.edit({ components: [row] }).catch(() => { });
            });
        }
    }
}
