module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {


        // =========================
        // SLASH COMMANDS
        // =========================

        if (interaction.isChatInputCommand()) {


            const command =
                client.commands.get(
                    interaction.commandName
                );


            if (!command) return;


            try {

                await command.execute(
                    interaction,
                    client
                );

            } catch (error) {

                console.error(error);


                if (!interaction.replied) {

                    await interaction.reply({
                        content:
                            "❌ Command error.",
                        ephemeral: true
                    });

                }

            }

            return;
        }



        // =========================
        // TICKET DROPDOWN
        // =========================

        if (
            interaction.isStringSelectMenu() &&
            interaction.customId === "ticket_select"
        ) {


            const {
                createTicketModal
            } = require("../utils/ticketModals");


            const modal =
                createTicketModal(
                    interaction.values[0]
                );


            return interaction.showModal(modal);

        }



        // =========================
        // TICKET INFORMATION MODAL
        // =========================

        if (
            interaction.isModalSubmit() &&
            interaction.customId.startsWith(
                "ticket_modal_"
            )
        ) {


            const type =
                interaction.customId.replace(
                    "ticket_modal_",
                    ""
                );


            const {
                createTicket
            } = require("../utils/createTicket");


            return createTicket(
                interaction,
                type
            );

        }



        // =========================
        // BUTTONS
        // =========================

        if (interaction.isButton()) {


            if (
                interaction.customId ===
                "ticket_claim"
            ) {


                const claim =
                    require("../utils/claimButton");


                return claim(
                    interaction
                );

            }



            if (
                interaction.customId ===
                "ticket_close"
            ) {


                const close =
                    require("../utils/closeTicket");


                return close(
                    interaction
                );

            }

        }



        // =========================
        // CLOSE MODAL
        // =========================

        if (
            interaction.isModalSubmit() &&
            interaction.customId ===
            "close_ticket_modal"
        ) {


            const close =
                require("../utils/closeTicket");


            return close(
                interaction,
                true
            );

        }

    }
};
