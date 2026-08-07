const claimButton = require("./claimButton");
const closeTicket = require("./closeTicket");

module.exports = async function handleButton(interaction) {

    try {

        switch (interaction.customId) {

            case "ticket_claim":
                return await claimButton(interaction);

            case "ticket_close":
                return await closeTicket(interaction);

            default:
                return;

        }

    } catch (err) {

        console.error("BUTTON ERROR:", err);

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: "❌ Something went wrong while processing this button.",
                ephemeral: true
            }).catch(() => {});
        } else {
            await interaction.followUp({
                content: "❌ Something went wrong while processing this button.",
                ephemeral: true
            }).catch(() => {});
        }

    }

};
