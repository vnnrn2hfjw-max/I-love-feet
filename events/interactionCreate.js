module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {

        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            return interaction.reply({
                content: "❌ Command not found.",
                ephemeral: true
            });
        }

        try {

            await command.execute(interaction, client);

        } catch (error) {

            console.error(error);

            if (interaction.replied || interaction.deferred) {

                await interaction.followUp({
                    content: "❌ Something went wrong while executing this command.",
                    ephemeral: true
                });

            } else {

                await interaction.reply({
                    content: "❌ Something went wrong while executing this command.",
                    ephemeral: true
                });

            }

        }

    }

};
