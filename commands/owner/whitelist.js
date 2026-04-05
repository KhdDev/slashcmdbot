const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
const config = require('../../config.json');
const db = require('../../utils/jsondb')

module.exports = {
    name: 'whitelist',
    description: "Permet de whitelist un utilisateur.",
    options: [
        {
            name: 'type',
            description: 'Whitelist un utilisateur.',
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
            type: ApplicationCommandOptionType.User
        }
    ],

    run: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const type = interaction.options.getString('type')
        if (type === 'add') {
            if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous devez etre \`owner\` pour executer cette commande.`).setColor("#ED4245")], ephemeral: true })

            if (user === null) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous devez specifier un utilisateur.`).setColor("#ED4245")], ephemeral: true })

            if (db.get(`Wl_${interaction.guild.id}-${user.id}`) === null) {
                db.set(`Wl_${interaction.guild.id}-${user.id}`, { AuthorTag: interaction.user.tag, AuthorID: interaction.user.id, Date: `<t:${Math.floor(Date.now() / 1000)}:R>` })
                interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setDescription(`> \u{2705} ${user} a ete ajoute dans la **whitelist**.`)
                        .setColor("#57F287")
                        .setFooter({ text: `Par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                        .setTimestamp()
                    ]
                })
            } else {
                interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Cet utilisateur est deja dans la whitelist.`).setColor("#ED4245")], ephemeral: true })
            }
        }

        if (type === 'remove') {
            if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous devez etre \`owner\` pour executer cette commande.`).setColor("#ED4245")], ephemeral: true })

            if (user === null) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous devez specifier un utilisateur.`).setColor("#ED4245")], ephemeral: true })
            if (db.get(`Wl_${interaction.guild.id}-${user.id}`) !== null) {
                db.delete(`Wl_${interaction.guild.id}-${user.id}`)
                interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setDescription(`> \u{2705} ${user} a ete retire de la **whitelist**.`)
                        .setColor("#57F287")
                        .setFooter({ text: `Par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                        .setTimestamp()
                    ]
                })
            } else {
                interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Cet utilisateur n'est pas dans la whitelist.`).setColor("#ED4245")], ephemeral: true })
            }
        }

        if (type === 'list') {
            if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous devez etre \`owner\` pour executer cette commande.`).setColor("#ED4245")], ephemeral: true })
            if (user !== null) {
                if (db.get(`Wl_${interaction.guild.id}-${user.id}`) !== null) {
                    let infoData = db.get(`Wl_${interaction.guild.id}-${user.id}`)
                    interaction.reply({
                        ephemeral: true,
                        embeds: [new EmbedBuilder()
                            .setAuthor({ name: 'Informations Whitelist', iconURL: user.displayAvatarURL() })
                            .setDescription(`> \u{2705} Details de la whitelist de **${user.tag}**`)
                            .addFields(
                                { name: '\u{1F464} Auteur', value: `>>> **Tag :** \`${infoData.AuthorTag}\`\n**ID :** \`${infoData.AuthorID}\``, inline: true },
                                { name: '\u{1F465} Utilisateur', value: `>>> **Tag :** \`${user.tag}\`\n**ID :** \`${user.id}\``, inline: true },
                                { name: '\u{1F4C5} Date', value: `>>> ${infoData.Date}`, inline: true },
                            )
                            .setColor("#5865F2")
                            .setTimestamp()
                        ]
                    })
                } else {
                    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Cet utilisateur n'est pas dans la whitelist.`).setColor("#ED4245")], ephemeral: true })
                }
            }
            if (user === null) {
                if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous devez etre \`owner\` pour executer cette commande.`).setColor("#ED4245")], ephemeral: true })
                var content = ""
                const owner = db
                    .all()
                    .filter((data) => data.ID.startsWith(`Wl_${interaction.guild.id}-`))
                    .sort((a, b) => b.data - a.data);
                for (let i in owner) {
                    if (owner[i].data === null) owner[i].data = 0;
                    let userData = await client.users.fetch(owner[i].ID.split(`-`)[1])

                    const t = db.get(`Wl_${interaction.guild.id}-${userData.id}`)
                    let authorData = await client.users.fetch(t.AuthorID)

                    content += `\n> \u{2705} \`${userData.tag}\` \u{2500} \`${userData.id}\``
                }
                interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setAuthor({ name: 'Liste Whitelist', iconURL: interaction.guild.iconURL() })
                        .setDescription(content || '> Aucun utilisateur dans la whitelist.')
                        .setColor("#5865F2")
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
                .setDescription(`> \u{26A0}\u{FE0F} Voulez-vous supprimer **toute la whitelist** du serveur ?`)
                .setColor("#FEE75C");

            const confirmMessage = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true, });

            const filter = (i) => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async (i) => {
                if (i.customId === 'yes') {
                    const ownerKeys = db.all().filter((data) => data.ID.startsWith(`Wl_${interaction.guild.id}-`)).map((data) => data.ID);
                    const zzz = ownerKeys.length;
                    ownerKeys.forEach((key) => {
                        db.delete(key);
                    });

                    const embed = new EmbedBuilder()
                        .setDescription(`> \u{2705} **${zzz}** utilisateur(s) ont ete supprimes de la whitelist.`)
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
