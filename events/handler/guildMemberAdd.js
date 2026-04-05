const db = require('../../utils/jsondb')

module.exports = (client, member) => {

    if (!db.get(`blmd_${member.guild.id}-${member.id}`)) return;
    member.ban({ reason: `Blacklist` }).then(() => { }).catch(err => { })
}