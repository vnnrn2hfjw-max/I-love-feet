const claimButton = require("./claimButton");
const closeTicket = require("./closeTicket");

module.exports = async function handleButtons(interaction) {

    console.log("BUTTON:", interaction.customId);

    if (interaction.customId === "ticket_claim") {
        console.log("➡ CLAIM FUNCTION");
        return claimButton(interaction);
    }

    if (interaction.customId === "ticket_close") {
        console.log("➡ CLOSE FUNCTION");
        return closeTicket(interaction);
    }

    console.log("UNKNOWN BUTTON:", interaction.customId);

};
