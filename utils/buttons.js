module.exports = async function handleButton(interaction) {


    if (
        interaction.customId === "ticket_claim"
    ) {

        const claim =
            require("./claimButton");


        return claim(
            interaction
        );

    }



    if (
        interaction.customId === "ticket_close"
    ) {

        const close =
            require("./closeTicket");


        return close(
            interaction
        );

    }



    return;

};
