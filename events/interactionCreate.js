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


            if (!command) {

                return interaction.reply({
                    content:
                    "❌ Command not found.",
                    ephemeral: true
                });

            }


            try {

                await command.execute(
                    interaction,
                    client
                );


            } catch (error) {

                console.error(error);


                if (interaction.replied || interaction.deferred) {

                    await interaction.followUp({

                        content:
                        "❌ Something went wrong while executing this command.",

                        ephemeral:true

                    });


                } else {

                    await interaction.reply({

                        content:
                        "❌ Something went wrong while executing this command.",

                        ephemeral:true

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

            try {

                const {
                    createTicketModal
                } = require("../utils/ticketModals");


                const modal =
                    createTicketModal(
                        interaction.values[0]
                    );


                await interaction.showModal(
                    modal
                );


            } catch (error) {

                console.error(error);


                await interaction.reply({

                    content:
                    "❌ Failed to open ticket form.",

                    ephemeral:true

                });

            }


            return;
        }



        // =========================
        // TICKET MODAL SUBMIT
        // =========================

        if (
            interaction.isModalSubmit() &&
            interaction.customId.startsWith(
                "ticket_modal_"
            )
        ) {


            try {

                const type =
                    interaction.customId.replace(
                        "ticket_modal_",
                        ""
                    );


                const {
                    createTicket
                } = require("../utils/createTicket");


                await interaction.deferReply({
                    ephemeral:true
                });


                await createTicket(
                    interaction,
                    type
                );


                await interaction.editReply({

                    content:
                    "✅ Ticket created!"

                });


            } catch(error) {

                console.error(error);


                if (!interaction.replied) {

                    await interaction.reply({

                        content:
                        "❌ Failed to create ticket.",

                        ephemeral:true

                    });

                }

            }


            return;
        }



        // =========================
        // BUTTONS
        // =========================

        if (interaction.isButton()) {


            try {


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



                if (
                    interaction.customId ===
                    "staff_apply"
                ) {

                    const modal =
                        require("../utils/staffApplicationModal");


                    return modal(
                        interaction
                    );

                }



            } catch(error) {

                console.error(error);


                if (!interaction.replied) {

                    await interaction.reply({

                        content:
                        "❌ Button error.",

                        ephemeral:true

                    });

                }

            }

        }



        // =========================
        // CLOSE TICKET MODAL
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
