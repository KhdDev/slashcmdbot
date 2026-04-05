module.exports = (client, interaction) => {

  if (!interaction.guild) {
    return interaction.reply({ content: 'Desole, je ne prends pas en compte les commandes en message prive.', ephemeral: true });
  }

  if (interaction.isChatInputCommand()) {

    const command = client.interactions.get(interaction.commandName);

    if (!command) return interaction.reply({
      content: "Quelque chose s'est mal passe, peut-etre que la commande n'a pas ete enregistree ?",
      ephemeral: true
    });

    command.run(client, interaction);
  }
}
