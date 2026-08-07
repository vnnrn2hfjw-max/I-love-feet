const handleButtons = require("../utils/button");
const { createTicketModal } = require("../utils/ticketModals");
const { createTicket } = require("../utils/createTicket");
const closeTicket = require("../utils/closeTicket");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {

        console.log(
            `Interaction: ${interaction.type} | ${interaction.customId || interaction.commandName || "Unknown"}`
        );

        // Slash Commands
        if (interaction.isChatInputCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {

                await command.execute(interaction, client);

            } catch (err) {

                console.error("COMMAND ERROR:", err);

                if (!interaction.replied && !interaction.deferred) {

                    await interaction.reply({
                        content: "❌ Command failed.",
                        ephemeral: true
                    }).catch(() => {});

                } else {

                    await interaction.followUp({
                        content: "❌ Command failed.",
                        ephemeral: true
                    }).catch(() => {});

                }

            }

            return;
        }

        // Ticket Select Menu
        if (
            interaction.isStringSelectMenu() &&
            interaction.customId === "ticket_select"
        ) {

            console.log("Opening ticket modal:", interaction.values[0]);

            return interaction.showModal(
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

            try {

                console.log("Creating ticket:", type);

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

                console.error("CREATE TICKET ERROR:", err);

                return interaction.editReply({
                    content:
                    `❌ Ticket creation failed.\n\n${err.message}`
                });

            }

        }

        // Close Ticket Modal
        if (
            interaction.isModalSubmit() &&
            interaction.customId === "close_ticket_modal"
        ) {

            await interaction.deferReply({
                ephemeral: true
            });

            try {

                console.log("Closing ticket...");

                await closeTicket(interaction, true);

                return interaction.editReply({
                    content:
                    "✅ Ticket closed."
                });

            } catch (err) {

                console.error("CLOSE ERROR:", err);

                return interaction.editReply({
                    content:
                    `❌ ${err.message}`
                });

            }

        }

        // Buttons
        if (interaction.isButton()) {

            console.log("BUTTON RECEIVED:", interaction.customId);

            return await handleButtons(interaction);

        }

    }
};
