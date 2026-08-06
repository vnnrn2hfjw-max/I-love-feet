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

                if (interaction.replied || interaction.deferred) {

                    await interaction.followUp({
                        content:
                            "❌ An error occurred while executing this command.",
                        ephemeral: true
                    });

                } else {

                    await interaction.reply({
                        content:
                            "❌ An error occurred while executing this command.",
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

            const type =
                interaction.values[0];


            const {
                createTicket
            } = require("../utils/createTicket");


            try {

                await createTicket(
                    interaction,
                    type
                );


            } catch (error) {

                console.error(error);


                if (!interaction.replied) {

                    await interaction.reply({
                        content:
                            "❌ Failed to create ticket.",
                        ephemeral: true
                    });

                }

            }

            return;
        }



        // =========================
        // BUTTONS
        // =========================

        if (interaction.isButton()) {



            // CLAIM

            if (
                interaction.customId === "ticket_claim"
            ) {

                const claim =
                    require("../utils/claimButton");


                return claim(
                    interaction
                );

            }



            // CLOSE

            if (
                interaction.customId === "ticket_close"
            ) {

                const close =
                    require("../utils/closeTicket");


                return close(
                    interaction
                );

            }

        }



        // =========================
        // MODALS
        // =========================

        if (interaction.isModalSubmit()) {



            // CLOSE REASON

            if (
                interaction.customId === "close_ticket_modal"
            ) {

                const close =
                    require("../utils/closeTicket");


                return close(
                    interaction,
                    true
                );

            }

        }

    }
};
