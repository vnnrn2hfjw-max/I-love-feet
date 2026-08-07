const claimButton = require("./claimButton");
const closeTicket = require("./closeTicket");

module.exports = async function handleButtons(interaction) {

    console.log("=================================");
    console.log("BUTTON DETECTED");
    console.log("Custom ID:", interaction.customId);
    console.log("=================================");

    try {

        if (interaction.customId === "ticket_claim") {

            console.log("➡ Running claimButton()");

            return await claimButton(interaction);

        }

        if (interaction.customId === "ticket_close") {

            console.log("➡ Running closeTicket()");

            return await closeTicket(interaction);

        }

        console.log("⚠ Unknown button:", interaction.customId);

    } catch (error) {

        console.error("BUTTON ERROR:");
        console.error(error);

        try {

            if (!interaction.replied && !interaction.deferred) {

                await interaction.reply({
                    content: "❌ Button error.",
                    ephemeral: true
                });

            } else {

                await interaction.followUp({
                    content: "❌ Button error.",
                    ephemeral: true
                });

            }

        } catch (e) {

            console.error("Failed to send button error:", e);

        }

    }

};
