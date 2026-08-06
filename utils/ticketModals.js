const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");


function createTicketModal(type) {

    const modal = new ModalBuilder()
        .setCustomId(`ticket_modal_${type}`)
        .setTitle("NSC Ticket Form");


    let questions = [];


    if (type === "buyer") {
        questions = [
            ["item", "What are you buying?"],
            ["payment", "Payment method?"]
        ];
    }


    if (type === "support") {
        questions = [
            ["issue", "Explain your issue"]
        ];
    }


    if (type === "join") {
        questions = [
            ["roblox", "Roblox username"]
        ];
    }


    if (type === "alliance") {
        questions = [
            ["gang", "Gang name"],
            ["members", "Member count"]
        ];
    }


    if (type === "report") {
        questions = [
            ["user", "Who are you reporting?"],
            ["reason", "Reason"]
        ];
    }



    for (const question of questions) {

        const input = new TextInputBuilder()
            .setCustomId(question[0])
            .setLabel(question[1])
            .setStyle(TextInputStyle.Paragraph)
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
