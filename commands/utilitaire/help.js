const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")
const config = require('../../config.json');
module.exports = {
    name: 'help',
    description: "Permet de voir les commandes du bot.",

    run: async (client, interaction) => {
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("select")
                    .setPlaceholder("\u{1F4D6} Choisissez une categorie")
                    .addOptions([
                        {
                            label: "Administration",
                            description: "Commandes reservees aux owners du bot.",
                            value: "owner",
                            emoji: "\u{1F451}"
                        },
                        {
                            label: "Gestion",
                            description: "Configuration et gestion du serveur.",
                            value: "gestion",
                            emoji: "\u{2699}\u{FE0F}"
                        },
                        {
                            label: "Moderation",
                            description: "Outils de moderation du serveur.",
                            value: "moderation",
                            emoji: "\u{1F6E1}\u{FE0F}"
                        },
                        {
                            label: "Utilitaire",
                            description: "Commandes utilitaires et informations.",
                            value: "utilitaire",
                            emoji: "\u{1F4CC}"
                        },
                    ])
            )

        const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL({ size: 512 }))
            .setDescription(`> Bienvenue dans le panneau d'aide de **${client.user.username}** !\n> Selectionnez une categorie ci-dessous.\n\n\u{1F451} **Administration** \u{2500} \`3 commandes\`\n\u{2699}\u{FE0F} **Gestion** \u{2500} \`3 commandes\`\n\u{1F6E1}\u{FE0F} **Moderation** \u{2500} \`23 commandes\`\n\u{1F4CC} **Utilitaire** \u{2500} \`10 commandes\``)
            .setColor("#5865F2")
            .setFooter({ text: `Demande par ${interaction.user.tag} | Total : 39 commandes`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()

        interaction.reply({ ephemeral: true, embeds: [embed], components: [row] }).catch(() => { })

        const embed1 = new EmbedBuilder()
            .setAuthor({ name: "Administration", iconURL: client.user.displayAvatarURL() })
            .setDescription(`> \u{1F451} **Commandes reservees aux owners du bot.**\n\n\`\`\`\n\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\n\`\`\``)
            .addFields(
                { name: '\u{1F451} `/owner`', value: '> Gerer les owners du bot.', inline: true },
                { name: '\u{2705} `/whitelist`', value: '> Gerer la whitelist.', inline: true },
                { name: '\u{26D4} `/blacklist`', value: '> Gerer la blacklist.', inline: true },
            )
            .setColor("#ED4245")
            .setFooter({ text: `Demande par ${interaction.user.tag} | 3 commandes`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()

        const embed2 = new EmbedBuilder()
            .setAuthor({ name: "Gestion", iconURL: client.user.displayAvatarURL() })
            .setDescription(`> \u{2699}\u{FE0F} **Configuration et gestion du serveur.**\n\n\`\`\`\n\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\n\`\`\``)
            .addFields(
                { name: '\u{1F600} `/emoji`', value: '> Creer des emoji sur le serveur.', inline: true },
                { name: '\u{1F4A1} `/setsuggest`', value: '> Configurer le salon suggestions.', inline: true },
                { name: '\u{1F91D} `/soutien`', value: '> Configurer le systeme soutien.', inline: true },
            )
            .setColor("#FEE75C")
            .setFooter({ text: `Demande par ${interaction.user.tag} | 3 commandes`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()

        const embed3 = new EmbedBuilder()
            .setAuthor({ name: "Moderation", iconURL: client.user.displayAvatarURL() })
            .setDescription(`> \u{1F6E1}\u{FE0F} **Outils de moderation du serveur.**\n\n\`\`\`\n\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\n\`\`\``)
            .addFields(
                { name: '\u{1F528} Sanctions', value: '>>> `/ban` `/kick` `/mute` `/unmute`\n`/unban` `/warn` `/derank`', inline: true },
                { name: '\u{1F4E2} Gestion salon', value: '>>> `/clear` `/lock` `/unlock`\n`/renew` `/slowmode` `/say`', inline: true },
                { name: '\u{1F50D} Informations', value: '>>> `/serverinfo` `/roleinfo`\n`/channelinfo` `/banlist`', inline: true },
                { name: '\u{1F465} Membres & Roles', value: '>>> `/alladmin` `/allbot` `/adminrole`\n`/massrole` `/voicemove`', inline: true },
                { name: '\u{1F310} Serveurs', value: '>>> `/server`', inline: true },
            )
            .setColor("#57F287")
            .setFooter({ text: `Demande par ${interaction.user.tag} | 23 commandes`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()

        const embed4 = new EmbedBuilder()
            .setAuthor({ name: "Utilitaire", iconURL: client.user.displayAvatarURL() })
            .setDescription(`> \u{1F4CC} **Commandes utilitaires et informations.**\n\n\`\`\`\n\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\n\`\`\``)
            .addFields(
                { name: '\u{1F5BC}\u{FE0F} Profil', value: '>>> `/avatar` `/banner`\n`/userinfo` `/botinfo`', inline: true },
                { name: '\u{1F6E0}\u{FE0F} Outils', value: '>>> `/ping` `/calcul`\n`/snipe` `/voice`', inline: true },
                { name: '\u{1F4AC} Communaute', value: '>>> `/suggestion` `/help`', inline: true },
            )
            .setColor("#5865F2")
            .setFooter({ text: `Demande par ${interaction.user.tag} | 10 commandes`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()

        const collector = interaction.channel.createMessageComponentCollector()

        collector.on("collect", async (collected) => {
            const value = collected.values[0]

            let category;
            if (value === "owner") {
                category = embed1;
            } else if (value === "gestion") {
                category = embed2;
            } else if (value === "moderation") {
                category = embed3;
            } else if (value === "utilitaire") {
                category = embed4;
            }

            if (category) {
                collected.deferUpdate().catch(() => { });
                interaction.editReply({ embeds: [category] }).catch(() => { });
            }
        });
    }
};
