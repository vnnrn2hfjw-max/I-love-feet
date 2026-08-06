const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    getTicket,
    removeOpenTicket
} = require("./ticketCounter");

const {
    isTicket
} = require("./isTicket");

const {
    createTranscript
} = require("./transcript");


const TICKET_LOGS = "1509800744767721503";


const STAFF_ROLES = [
    "1502708624487616684",
    "1502707190358605884",
    "1526243744289128528"
];


module.exports = async function closeTicket(
    interaction,
    modalSubmit = false
) {


    // OPEN MODAL

    if (!modalSubmit) {


        const modal =
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
                "close_reason"
            )
            .setLabel(
                "Close Reason"
            )
            .setStyle(
                TextInputStyle.Paragraph
            )
            .setRequired(true);



        modal.addComponents(

            new ActionRowBuilder()
            .addComponents(
                reason
            )

        );


        return interaction.showModal(
            modal
        );

    }



    // CHECK TICKET

    const ticket =
        isTicket(
            interaction.channel.id
        );


    if (!ticket) {

        return interaction.reply({

            content:
            "❌ This is not a ticket.",

            ephemeral:true

        });

    }



    const allowed =
        interaction.member.roles.cache.some(
            role =>
            STAFF_ROLES.includes(role.id)
        );



    if (!allowed) {

        return interaction.reply({

            content:
            "❌ You cannot close tickets.",

            ephemeral:true

        });

    }



    const reason =
        interaction.fields.getTextInputValue(
            "close_reason"
        );



    const transcript =
        await createTranscript(

            interaction.channel,

            {

                openedBy:
                `<@${ticket.userId}>`,

                closedBy:
                interaction.user.tag,

                reason

            }

        );



    const logChannel =
        interaction.guild.channels.cache.get(
            TICKET_LOGS
        );



    const embed =
        new EmbedBuilder()

        .setColor("#8B0000")

        .setTitle(
            "🔒 Ticket Closed"
        )

        .setDescription(

`**Ticket**
${interaction.channel.name}

**Opened By**
<@${ticket.userId}>

**Closed By**
${interaction.user}

**Reason**
${reason}`

        )

        .setTimestamp();



    if (logChannel) {

        await logChannel.send({

            embeds:[
                embed
            ],

            files:[
                transcript
            ]

        });

    }



    removeOpenTicket(
        interaction.channel.id
    );



    await interaction.reply({

        content:
        "🔒 Ticket closed. Transcript saved.",

    });



    setTimeout(() => {

        interaction.channel.delete()
        .catch(() => {});

    },5000);


};
