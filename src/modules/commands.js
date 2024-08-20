const { REST, Routes } = require('discord.js');

class Command {
  constructor(data, execute) {
    this.data = data;
    this.execute = execute;
  }
}

async function CommandRegister(client, commands, options = { guilds: [] }) {
  const rest = new REST({ version: '10' }).setToken(client.token);
  const commandData = commands.map(cmd => cmd.data.toJSON());

  try {
    if (options.guilds.length > 0) {
      for (const guildId of options.guilds) {
        await rest.put(
          Routes.applicationGuildCommands(client.user.id, guildId),
          { body: commandData }
        );
        console.log(`Successfully registered commands for guild ${guildId}`);
      }
    } else {
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commandData }
      );
      console.log('Successfully registered global commands.');
    }
  } catch (error) {
    console.error(error);
  }
}

function CommandHandler(client, commands) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = commands.find(cmd => cmd.data.name === interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  });
}

module.exports = { Command, CommandRegister, CommandHandler };