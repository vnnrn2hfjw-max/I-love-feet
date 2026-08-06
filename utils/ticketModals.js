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
                "NSC Ticket"
            );



    const fields = [];



    if (type === "buyer") {

        fields.push(
            {
                id: "buying",
                label: "What are you buying?"
            },
            {
                id: "payment",
                label: "Payment method?"
            },
            {
                id: "info",
                label: "Additional information?"
            }
        );

    }



    if (type === "support") {

        fields.push(
            {
                id: "problem",
                label: "Explain your issue"
            }
        );

    }



    if (type === "join") {

        fields.push(
            {
                id: "roblox",
                label: "Roblox username"
            }
        );

    }



    if (type === "alliance") {

        fields.push(
            {
                id: "gang",
                label: "Gang name"
            },
            {
                id: "members",
                label: "Member count"
            }
        );

    }



    if (type === "report") {

        fields.push(
            {
                id: "reported",
                label: "Who are you reporting?"
            },
            {
                id: "reason",
                label: "What happened?"
            },
            {
                id: "evidence",
                label: "Evidence"
            }
        );

    }



    for (const field of fields) {


        const input =
            new TextInputBuilder()
                .setCustomId(
                    field.id
                )
                .setLabel(
                    field.label
                )
                .setStyle(
                    TextInputStyle.Paragraph
                )
                .setRequired(true);



        modal.addComponents(
            new ActionRowBuilder()
                .addComponents(input)
        );

    }



    return modal;

}



module.exports = {
    createTicketModal
};
