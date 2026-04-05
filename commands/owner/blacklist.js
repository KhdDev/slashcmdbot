const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
const config = require('../../config.json');
const db = require('../../utils/jsondb');

module.exports = {
    name: 'blacklist',
    description: "Permet de blacklist un utilisateur.",
    options: [
        {
            name: 'type',
            description: 'blacklist un utilisateur',
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
            required: false,
            type: ApplicationCommandOptionType.User,
        },
    ],

    run: async (client, interaction) => {

        const type = interaction.options.getString('type')
        const user = interaction.options.getUser('user');

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous devez etre \`owner\` pour executer cette commande.`).setColor("#ED4245")], ephemeral: true })

        if (type === 'add') {
            if (user === null) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous devez specifier un utilisateur.`).setColor("#ED4245")], ephemeral: true })
            if (user.id === interaction.user.id) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous ne pouvez pas vous blacklist vous-meme.`).setColor("#ED4245")], ephemeral: true })
            if (db.get(`Owner_${interaction.guild.id}-${user.id}`) !== null) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Impossible de blacklist un \`owner\`.`).setColor("#ED4245")], ephemeral: true })
            if (db.get(`blmd_${interaction.guild.id}-${user.id}`) === null) {
                db.set(`blmd_${interaction.guild.id}-${user.id}`, { DogID: user.id, AuthorTag: interaction.user.tag, AuthorID: interaction.user.id, Date: `<t:${Math.floor(Date.now() / 1000)}:R>` })
                client.guilds.cache.forEach(g => {
                    if (g.members.cache.get(user.id)) {
                        g.members.cache.get(user.id).ban({ reason: `Blacklist par (${interaction.user.tag})` }).then(() => { }).catch(err => { })
                    }
                });
                interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setAuthor({ name: 'Utilisateur blacklist', iconURL: user.displayAvatarURL() })
                        .setDescription(`> \u{26D4} **${user.tag}** a ete ajoute dans la **blacklist**.`)
                        .addFields(
                            { name: '\u{1F464} Moderateur', value: `>>> ${interaction.user}`, inline: true },
                        )
                        .setColor("#ED4245")
                        .setFooter({ text: `ID : ${user.id}` })
                        .setTimestamp()
                    ]
                }).catch(() => { })
                const dbLogs = db.get(`LogsAddRemove_${interaction.guild.id}`)
                if (dbLogs === null) return;
                client.channels.cache.get(dbLogs).send({
                    embeds: [new EmbedBuilder()
                        .setAuthor({ name: 'Ajout Blacklist', iconURL: 'https://cdn.discordapp.com/attachments/1025145344352325693/1037244926846570556/verifee.png' })
                        .setDescription(`> \u{1F464} **Auteur :** \`${interaction.user.tag}\` (\`${interaction.user.id}\`)\n> \u{1F465} **Utilisateur :** \`${user.tag}\` (\`${user.id}\`)`)
                        .setColor("#ED4245")
                        .setTimestamp()
                    ]
                }).catch(() => { })
            } else {
                interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Cet utilisateur est deja dans la blacklist.`).setColor("#ED4245")], ephemeral: true })
            }
        }
        if (type === 'remove') {
            if (user === null) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous devez specifier un utilisateur.`).setColor("#ED4245")], ephemeral: true })

            const t = db.get(`blmd_${interaction.guild.id}-${user.id}`)
            if (t === null) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Cet utilisateur n'est pas dans la blacklist.`).setColor("#ED4245")], ephemeral: true }).catch(() => { })

            if (config.owners.includes(interaction.user.id) && interaction.user.id === interaction.guild.ownerId) {

                if (db.get(`blmd_${interaction.guild.id}-${user.id}`) !== null) {
                    db.delete(`blmd_${interaction.guild.id}-${user.id}`)
                    interaction.guild.bans.remove(user.id, 'Membre retire de la Blacklist').catch(err => err)
                    interaction.reply({
                        embeds: [new EmbedBuilder()
                            .setDescription(`> \u{2705} **${user.tag}** a ete retire de la **blacklist**.`)
                            .setColor("#57F287")
                            .setFooter({ text: `Par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                            .setTimestamp()
                        ]
                    }).catch(() => { })
                    const dbLogs = db.get(`LogsAddRemove_${interaction.guild.id}`)
                    if (dbLogs === null) return;
                    client.channels.cache.get(dbLogs).send({
                        embeds: [new EmbedBuilder()
                            .setAuthor({ name: 'Retrait Blacklist', iconURL: 'https://cdn.discordapp.com/attachments/1025145344352325693/1037245036330496020/1034400786463064104_1.png' })
                            .setDescription(`> \u{1F464} **Auteur :** \`${interaction.user.tag}\` (\`${interaction.user.id}\`)\n> \u{1F465} **Utilisateur :** \`${user.tag}\` (\`${user.id}\`)`)
                            .setColor("#57F287")
                            .setTimestamp()
                        ]
                    }).catch(() => { })
                } else {
                    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Cet utilisateur n'est pas dans la blacklist.`).setColor("#ED4245")], ephemeral: true }).catch(() => { })
                }
            }

            if (!t.AuthorID.includes(interaction.user.id)) return interaction.reply({
                embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous ne pouvez pas retirer **${user.tag}** de la blacklist car vous n'etes pas l'auteur.`).setColor("#ED4245")],
                ephemeral: true
            })

            if (db.get(`blmd_${interaction.guild.id}-${user.id}`) !== null) {
                db.delete(`blmd_${interaction.guild.id}-${user.id}`)
                interaction.guild.bans.remove(user.id, 'Membre retire de la Blacklist').catch(err => err)
                interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setDescription(`> \u{2705} **${user.tag}** a ete retire de la **blacklist**.`)
                        .setColor("#57F287")
                        .setFooter({ text: `Par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                        .setTimestamp()
                    ]
                }).catch(() => { })
                const dbLogs = db.get(`LogsAddRemove_${interaction.guild.id}`)
                if (dbLogs === null) return;
                client.channels.cache.get(dbLogs).send({
                    embeds: [new EmbedBuilder()
                        .setAuthor({ name: 'Retrait Blacklist', iconURL: 'https://cdn.discordapp.com/attachments/1025145344352325693/1037245036330496020/1034400786463064104_1.png' })
                        .setDescription(`> \u{1F464} **Auteur :** \`${interaction.user.tag}\` (\`${interaction.user.id}\`)\n> \u{1F465} **Utilisateur :** \`${user.tag}\` (\`${user.id}\`)`)
                        .setColor("#57F287")
                        .setTimestamp()
                    ]
                }).catch(() => { })
            } else {
                interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Cet utilisateur n'est pas dans la blacklist.`).setColor("#ED4245")], ephemeral: true }).catch(() => { })
            }
        }
        if (type === 'list') {
            if (user !== null) {
                if (db.get(`blmd_${interaction.guild.id}-${user.id}`) !== null) {
                    let infoData = db.get(`blmd_${interaction.guild.id}-${user.id}`)
                    interaction.reply({
                        ephemeral: true,
                        embeds: [new EmbedBuilder()
                            .setAuthor({ name: 'Informations Blacklist', iconURL: user.displayAvatarURL() })
                            .setDescription(`> \u{26D4} Details de la blacklist de **${user.tag}**`)
                            .addFields(
                                { name: '\u{1F464} Auteur', value: `>>> **Tag :** \`${infoData.AuthorTag}\`\n**ID :** \`${infoData.AuthorID}\``, inline: true },
                                { name: '\u{1F465} Utilisateur', value: `>>> **Tag :** \`${user.tag}\`\n**ID :** \`${user.id}\``, inline: true },
                                { name: '\u{1F4C5} Date', value: `>>> ${infoData.Date}`, inline: true },
                            )
                            .setColor("#ED4245")
                            .setTimestamp()
                        ]
                    }).catch(() => { })
                } else {
                    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Cet utilisateur n'est pas dans la blacklist.`).setColor("#ED4245")], ephemeral: true }).catch(() => { })
                }
            }
            if (user === null) {
                var content = ""
                const owner = db
                    .all()
                    .filter((data) => data.ID.startsWith(`blmd_${interaction.guild.id}-`))
                    .sort((a, b) => b.data - a.data);
                for (let i in owner) {
                    if (owner[i].data === null) owner[i].data = 0;
                    let userData = await client.users.fetch(owner[i].ID.split(`-`)[1])

                    const t = db.get(`blmd_${interaction.guild.id}-${userData.id}`)
                    let authorData = await client.users.fetch(t.AuthorID)

                    content += `\n> \u{26D4} \`${userData.tag}\` \u{2500} \`${userData.id}\``
                }
                interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setAuthor({ name: 'Liste Blacklist', iconURL: interaction.guild.iconURL() })
                        .setDescription(content || '> Aucun utilisateur dans la blacklist.')
                        .setColor("#ED4245")
                        .setFooter({ text: `Demande par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                        .setTimestamp()
                    ]
                })
            }
        }
        if (type === 'clear') {
            if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous devez etre \`owner\` pour executer cette commande.`).setColor("#ED4245")], ephemeral: true })
            const row = new ActionRowBuilder()
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
                .setDescription(`> \u{26A0}\u{FE0F} Voulez-vous supprimer **toute la blacklist** du serveur ?`)
                .setColor("#FEE75C");

            const confirmMessage = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true, });

            const filter = (i) => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async (i) => {
                if (i.customId === 'yes') {
                    const ownerKeys = db.all().filter((data) => data.ID.startsWith(`blmd_${interaction.guild.id}-`)).map((data) => data.ID);
                    const zzz = ownerKeys.length;
                    ownerKeys.forEach((key) => {
                        db.delete(key);
                    });

                    const embed = new EmbedBuilder()
                        .setDescription(`> \u{2705} **${zzz}** utilisateur(s) ont ete supprimes de la blacklist.`)
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
