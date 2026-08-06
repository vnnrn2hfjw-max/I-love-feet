const {
    EmbedBuilder
} = require("discord.js");

const {
    getTicket
} = require("./ticketCounter");

const STAFF_ROLES = [
    "1502708624487616684", // Staff Team
    "1502707190358605884", // Owner
    "1526243744289128528"  // Founder
];


module.exports = async function claimTicket(interaction) {

    const member = interaction.member;


    const hasPermission =
        member.roles.cache.some(role =>
            STAFF_ROLES.includes(role.id)
        );


    if (!hasPermission) {

        return interaction.reply({
            content:
                "❌ You do not have permission to claim tickets.",
            ephemeral: true
        });

    }


    const ticket =
        getTicket(interaction.channel.id);


    if (!ticket) {

        return interaction.reply({
            content:
                "❌ This is not a registered ticket.",
            ephemeral: true
        });

    }


    if (interaction.channel.topic?.includes("CLAIMED")) {

        return interaction.reply({
            content:
                "❌ This ticket has already been claimed.",
            ephemeral: true
        });

    }


    await interaction.channel.setTopic(
        `CLAIMED | ${interaction.user.id} | ${ticket.type}`
    );


    const messages =
        await interaction.channel.messages.fetch({
            limit: 10
        });


    const ticketMessage =
        messages.find(msg =>
            msg.embeds.length > 0 &&
            msg.components.length > 0
        );


    if (ticketMessage) {

        const oldEmbed =
            ticketMessage.embeds[0];


        const newEmbed =
            EmbedBuilder.from(oldEmbed)
                .setDescription(
`Welcome <@${ticket.userId}>!

A staff member is handling your ticket.

━━━━━━━━━━━━━━━━━━

**Status**
🟡 Claimed

**Claimed By**
${interaction.user}

**Opened By**
<@${ticket.userId}>

**Ticket Type**
${ticket.type}

━━━━━━━━━━━━━━━━━━`
                );


        await ticketMessage.edit({
            embeds: [newEmbed]
        });

    }


    await interaction.reply({
        content:
            `🟢 Ticket claimed by ${interaction.user}.`,
        ephemeral: false
    });

};
