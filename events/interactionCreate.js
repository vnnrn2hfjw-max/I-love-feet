if (
    interaction.isModalSubmit() &&
    interaction.customId.startsWith("ticket_modal_")
) {


    const type =
        interaction.customId.replace(
            "ticket_modal_",
            ""
        );


    await interaction.deferReply({
        ephemeral:true
    });



    const {
        createTicket
    } = require("../utils/createTicket");



    const channel =
        await createTicket(
            interaction,
            type
        );



    if (!channel) {

        return interaction.editReply({

            content:
            "❌ You already have this ticket open."

        });

    }



    await interaction.editReply({

        content:
        `✅ Ticket created: ${channel}`

    });


    return;

}
