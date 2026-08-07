module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {

        // Slash Commands
        if (interaction.isChatInputCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {

                await command.execute(interaction, client);

            } catch (error) {

                console.error("COMMAND ERROR:", error);

                if (interaction.replied || interaction.deferred) {

                    await interaction.followUp({
                        content: "❌ An error occurred while executing this command.",
                        ephemeral: true
                    }).catch(() => {});

                } else {

                    await interaction.reply({
                        content: "❌ An error occurred while executing this command.",
                        ephemeral: true
                    }).catch(() => {});

                }

            }

            return;
        }

        // Ticket Menu
        if (
            interaction.isStringSelectMenu() &&
            interaction.customId === "ticket_select"
        ) {

            const {
                createTicketModal
            } = require("../utils/ticketModals");

            return interaction.showModal(
                createTicketModal(interaction.values[0])
            );
        }

        // Ticket Modal
        if (
            interaction.isModalSubmit() &&
            interaction.customId.startsWith("ticket_modal_")
        ) {

            await interaction.deferReply({
                ephemeral: true
            });

            const type = interaction.customId.replace(
                "ticket_modal_",
                ""
            );

            const {
                createTicket
            } = require("../utils/createTicket");

            try {

                const channel = await createTicket(
                    interaction,
                    type
                );

                if (!channel) {

                    return interaction.editReply({
                        content: "❌ You already have this ticket open."
                    });

                }

                return interaction.editReply({
                    content: `✅ Your ticket has been created: ${channel}`
                });

            } catch (error) {

                console.error("CREATE TICKET ERROR:", error);

                return interaction.editReply({
                    content:
                        `❌ Ticket creation failed.\n\`\`\`\n${error.message}\n\`\`\``
                });

            }

        }

        // Ticket Buttons
        if (interaction.isButton()) {

            const handleButton = require("../utils/button");

            try {

                return await handleButton(interaction);

            } catch (error) {

                console.error("BUTTON ERROR:", error);

                if (!interaction.replied && !interaction.deferred) {

                    await interaction.reply({
                        content: "❌ Button failed.",
                        ephemeral: true
                    }).catch(() => {});

                }

            }

        }

    }
};
