const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js")
const db = require('../../utils/jsondb')
const config = require('../../config.json');
module.exports = {
    name: 'roleinfo',
    description: "Permet d'afficher les informations d'un role.",
    options: [
        {
            name: 'role',
            description: 'role',
            required: true,
            type: ApplicationCommandOptionType.Role,
        },
    ],

    run: async (client, interaction) => {

        const role = interaction.options.getRole('role');

        if (!db.get(`Owner_${interaction.guild.id}-${interaction.user.id}`) && !db.get(`Wl_${interaction.guild.id}-${interaction.user.id}`) && !config.owners.includes(interaction.user.id) && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> \u{274C} Vous n'avez pas la permission d'executer cette commande.`).setColor("#ED4245")], ephemeral: true })
        let oldStr = `${role.hexColor}`
        let hex = oldStr.substring(1);

        const status = {
            false: "Non",
            true: "Oui"
        }

        const permissions = {
            "Administrator": "Administrateur",
            "ViewAuditLog": "Voir les logs du serveur",
            "ViewGuildInsights": "Voir le vue d'ensemble",
            "ManageGuild": "Gerer le serveur",
            "ManageRoles": "Gerer les roles",
            "ManageChannels": "Gerer les channels",
            "KickMembers": "Kick des membres",
            "BanMembers": "Ban des membres",
            "CreateInstantInvite": "Creer des invitations",
            "ChangeNickname": "Change Nickname",
            "ManageNicknames": "Manage Nicknames",
            "ManageGuildExpressions": "Gerer les emojis",
            "ManageWebhooks": "Gerer les Webhooks",
            "ViewChannel": "Lire les salons de texte et voir les salons vocaux",
            "SendMessages": "Envoyer des messages",
            "SendTTSMessages": "Envoyer des messages TTS",
            "ManageMessages": "Gerer les messages",
            "EmbedLinks": "Embed Links",
            "AttachFiles": "Joindre des fichiers ",
            "ReadMessageHistory": "Lire l'historique des messages",
            "MentionEveryone": "Mentionner @everyone, @here, et tous les roles",
            "UseExternalEmojis": "Utiliser des emojis externes",
            "AddReactions": "Ajouter des reactions",
            "Connect": "Connecter",
            "Speak": "Parler",
            "Stream": "Video",
            "MuteMembers": "Mute des membres",
            "DeafenMembers": "Rendre sourd les membres",
            "MoveMembers": "Deplacer les membres",
            "UseVAD": "Utiliser l'activite vocale",
            "PrioritySpeaker": "Voix prioritaire",
        }

        const rolePermissions = role.permissions.toArray();
        const finalPermissions = [];
        for (const permission in permissions) {
            if (rolePermissions.includes(permission)) finalPermissions.push(`+ ${permissions[permission]}`);
            else finalPermissions.push(`- ${permissions[permission]}`);
        }

        let embed = new EmbedBuilder()
            .setAuthor({ name: `Informations du role : ${role.name}`, iconURL: interaction.guild.iconURL() })
            .setDescription(`> \u{1F3F7}\u{FE0F} Details du role **${role.name}**`)
            .setColor(role.hexColor || "#5865F2")
            .addFields(
                { name: '\u{1F4CB} Informations', value: `>>> **ID :** \`${role.id}\`\n**Nom :** ${role.name}\n**Couleur :** [\`${role.hexColor}\`](https://www.color-hex.com/color/${hex})\n**Membres :** \`${role.members.size}\`\n**Position :** \`${role.position}\`\n**Mentionable :** \`${status[role.mentionable]}\`\n**Creation :** <t:${Math.floor(role.createdTimestamp / 1000)}:D> (<t:${Math.floor(role.createdTimestamp / 1000)}:R>)`, inline: false },
                { name: '\u{1F6E1}\u{FE0F} Permissions', value: `\`\`\`diff\n${finalPermissions.join('\n')}\`\`\``, inline: false },
            )
            .setFooter({ text: `Demande par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
