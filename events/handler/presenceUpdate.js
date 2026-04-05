const db = require('../../utils/jsondb')

module.exports = (client, oldPresence, newPresence) => {
    if (!oldPresence) return;

    const guild = oldPresence.guild
    const member = newPresence.member
    const role = guild.roles.cache.get(db.get(`role_${oldPresence.guild.id}`))
    const statut = db.get(`statut_${oldPresence.guild.id}`)?.trim();

    if ((!role && !statut) || (!role || !statut)) return;

    if (newPresence?.activities[0] && newPresence?.activities[0]?.state?.toLowerCase().includes(statut.toLowerCase())) {
        if (!member.roles.cache.has(role.id)) {
            member.roles.add(role);
        }
    } else {
        if (member.roles.cache.has(role.id)) {
            member.roles.remove(role);
        }
    }
}