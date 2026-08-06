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


const TICKET_LOGS = "1509800744767721503";


const STAFF_ROLES = [
    "1502708624487616684", // Staff Team
    "1502707190358605884", // Owner
    "1526243744289128528"  // Founder
];


module.exports = async function closeTicket(interaction, modalSubmit = false) {


    // =========================
    // OPEN CLOSE MODAL
    // =========================

    if (!modalSubmit) {

        const modal =
            new ModalBuilder()
                .setCustomId("close_ticket_modal")
                .setTitle("Close Ticket");


        const reason =
            new TextInputBuilder()
                .setCustomId("close_reason")
                .setLabel("Close Reason")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder(
                    "Explain why this ticket is being closed..."
                )
                .setRequired(true);


        const row =
            new ActionRowBuilder()
                .addComponents(reason);


        modal.addComponents(row);


        return interaction.showModal(modal);

    }



    // =========================
    // HANDLE MODAL
    // =========================

    const member = interaction.member;


    const hasPermission =
        member.roles.cache.some(role =>
            STAFF_ROLES.includes(role.id)
        );


    if (!hasPermission) {

        return interaction.reply({
            content:
                "❌ You do not have permission to close tickets.",
            ephemeral: true
        });

    }



    const ticket =
        getTicket(interaction.channel.id);


    if (!ticket) {

        return interaction.reply({
            content:
                "❌ This ticket was not found.",
            ephemeral: true
        });

    }


    const closeReason =
        interaction.fields.getTextInputValue(
            "close_reason"
        );



    const logChannel =
        interaction.guild.channels.cache.get(
            TICKET_LOGS
        );


    const logEmbed =
        new EmbedBuilder()

            .setColor("#8B0000")

            .setTitle("🔒 Ticket Closed")

            .setDescription(
`**Ticket Type**
${ticket.type}

**Opened By**
<@${ticket.userId}>

**Closed By**
${interaction.user}

**Reason**
${closeReason}`
            )

            .setTimestamp();



    if (logChannel) {

        await logChannel.send({
            embeds: [logEmbed]
        });

    }



    removeOpenTicket(
        interaction.channel.id
    );


    await interaction.reply({
        content:
            "🔒 Ticket closed. Deleting channel...",
        ephemeral: false
    });



    setTimeout(() => {

        interaction.channel.delete()
            .catch(() => {});

    }, 5000);

};
