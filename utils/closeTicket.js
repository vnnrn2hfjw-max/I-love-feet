const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const {
    createTranscript
} = require("./transcript");


module.exports = async function closeTicket(interaction, modal=false) {


    if (!modal) {


        const form =
        new ModalBuilder()

        .setCustomId(
            "close_ticket_modal"
        )

        .setTitle(
            "Close Ticket"
        );


        const reason =
        new TextInputBuilder()

        .setCustomId(
            "reason"
        )

        .setLabel(
            "Close reason"
        )

        .setStyle(
            TextInputStyle.Paragraph
        )

        .setRequired(true);



        return interaction.showModal(

            new ActionRowBuilder()
            .addComponents(reason)

        );

    }



    const transcript =
    await createTranscript(
        interaction.channel
    );


    await interaction.channel.send({

        content:
        "🔒 Ticket closed.",

        files:[
            transcript
        ]

    });



    setTimeout(()=>{

        interaction.channel.delete()
        .catch(()=>{});

    },3000);


};
