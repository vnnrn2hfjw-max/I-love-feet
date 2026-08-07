const claimButton = require("./claimButton");
const closeTicket = require("./closeTicket");

module.exports = async function handleButtons(interaction) {

    try {

        if (interaction.customId === "ticket_claim") {
            return await claimButton(interaction);
        }


        if (interaction.customId === "ticket_close") {
            return await closeTicket(interaction);
        }


    } catch (error) {

        console.error("BUTTON ERROR:", error);

        if (!interaction.replied) {

            await interaction.reply({
                content: "❌ Button error.",
                ephemeral: true
            }).catch(() => {});

        }

    }

};
