const handleButtons = require("../utils/button");
const { createTicketModal } = require("../utils/ticketModals");
const { createTicket } = require("../utils/createTicket");
const closeTicket = require("../utils/closeTicket");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {

        try {

            // Slash Commands
            if (interaction.isChatInputCommand()) {

                const command = client.commands.get(interaction.commandName);

                if (!command) return;

                return await command.execute(interaction, client);

            }

            // Ticket Select Menu
            if (
                interaction.isStringSelectMenu() &&
                interaction.customId === "ticket_select"
            ) {

                return await interaction.showModal(
                    createTicketModal(interaction.values[0])
                );

            }

            // Ticket Creation Modal
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
                    `✅ Your ticket has been created: ${channel}`
                );

            }

            // Close Ticket Modal
            if (
                interaction.isModalSubmit() &&
                interaction.customId === "close_ticket_modal"
            ) {

                return await closeTicket(
                    interaction,
                    true
                );

            }

            // Buttons
            if (interaction.isButton()) {

                console.log("Button Pressed:", interaction.customId);

                return await handleButtons(interaction);

            }

        } catch (err) {

            console.error("INTERACTION ERROR:");
            console.error(err);

            try {

                if (!interaction.replied && !interaction.deferred) {

                    await interaction.reply({
                        content: "❌ Something went wrong.",
                        ephemeral: true
                    });

                } else {

                    await interaction.followUp({
                        content: "❌ Something went wrong.",
                        ephemeral: true
                    });

                }

            } catch {}

        }

    }

};
