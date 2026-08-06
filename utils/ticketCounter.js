const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");


function createTicketModal(type) {


    const modal =
        new ModalBuilder()
        .setCustomId(
            `ticket_modal_${type}`
        )
        .setTitle(
            "NSC Ticket Form"
        );


    let questions = [];


    switch(type) {


        case "buyer":

            questions = [
                ["item", "What are you buying?"],
                ["payment", "Payment method?"]
            ];

            break;



        case "support":

            questions = [
                ["issue", "Explain your issue"]
            ];

            break;



        case "join":

            questions = [
                ["roblox", "Roblox username"]
            ];

            break;



        case "alliance":

            questions = [
                ["gang", "Gang name"],
                ["members", "Member count"]
            ];

            break;



        case "report":

            questions = [
                ["user", "Who are you reporting?"],
                ["reason", "Reason for report"]
            ];

            break;

    }



    for (const question of questions) {


        const input =
            new TextInputBuilder()

            .setCustomId(
                question[0]
            )

            .setLabel(
                question[1]
            )

            .setStyle(
                TextInputStyle.Paragraph
            )

            .setRequired(true);



        modal.addComponents(

            new ActionRowBuilder()

            .addComponents(
                input
            )

        );

    }



    return modal;

}



module.exports = {
    createTicketModal
};
