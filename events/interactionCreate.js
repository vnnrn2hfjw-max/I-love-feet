const handleButtons = require("../utils/button");
const { createTicketModal } = require("../utils/ticketModals");
const { createTicket } = require("../utils/createTicket");
const closeTicket = require("../utils/closeTicket");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {

        // Slash Commands
        if (interaction.isChatInputCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (err) {
                console.error(err);

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content: "❌ Command failed.",
                        ephemeral: true
                    }).catch(() => {});
                } else {
                    await interaction.reply({
                        content: "❌ Command failed.",
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

            try {

                const channel = await createTicket(
                    interaction,
                    type
                );

                if (!channel) {

                    return interaction.editReply({
                        content:
                        "❌ You already have this ticket open."
                    });

                }

                return interaction.editReply({
                    content:
                    `✅ Ticket created: ${channel}`
                });

            } catch (err) {

                console.error(err);

                return interaction.editReply({
                    content:
                    `❌ Ticket creation failed.\n\n${err.message}`
                });

            }

        }

        // Close Modal
        if (
            interaction.isModalSubmit() &&
            interaction.customId === "close_ticket_modal"
        ) {

            await interaction.deferReply({
                ephemeral: true
            });

            try {

                await closeTicket(interaction, true);

                return interaction.editReply({
                    content:
                    "✅ Ticket closed."
                });

            } catch (err) {

                console.error(err);

                return interaction.editReply({
                    content:
                    `❌ ${err.message}`
                });

            }

        }

        // Buttons
        if (
            interaction.isButton()
        ) {

            return handleButtons(interaction);

        }

    }
}; 
