const {
    EmbedBuilder
} = require("discord.js");

const {
    getTicket
} = require("./ticketCounter");

const {
    isTicket
} = require("./isTicket");


const STAFF_ROLES = [
    "1502708624487616684", // Staff Team
    "1502707190358605884", // Owner
    "1526243744289128528"  // Founder
];


module.exports = async function claimTicket(interaction) {


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
            "❌ You cannot claim tickets.",

            ephemeral:true

        });

    }



    if (
        interaction.channel.topic &&
        interaction.channel.topic.includes(
            "CLAIMED"
        )
    ) {

        return interaction.reply({

            content:
            "❌ This ticket is already claimed.",

            ephemeral:true

        });

    }



    await interaction.channel.setTopic(
        `CLAIMED | ${interaction.user.id} | ${ticket.type}`
    );



    const messages =
        await interaction.channel.messages.fetch({
            limit:20
        });



    const ticketMessage =
        messages.find(
            msg =>
            msg.embeds.length &&
            msg.components.length
        );



    if (ticketMessage) {


        const embed =
            EmbedBuilder.from(
                ticketMessage.embeds[0]
            );



        embed.setDescription(

`Welcome <@${ticket.userId}>!

A staff member is now handling your ticket.

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

            embeds:[
                embed
            ]

        });

    }



    await interaction.reply({

        content:
        `🟢 Ticket claimed by ${interaction.user}.`

    });

};
