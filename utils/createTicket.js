const {
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    getChannelName,
    hasOpenTicket,
    addOpenTicket
} = require("./ticketCounter");


const CATEGORY_ID = "1502731974513786961";


const ROLES = {

    FOUNDER:
    "1526243744289128528",

    OWNER:
    "1502707190358605884",

    STAFF:
    "1502708624487616684",

    TRUSTED_SELLER:
    "1502723065795051693"

};



const ticketTypes = {

    buyer: {

        emoji: "💰",

        name: "Buyer Ticket",

        pingRole:
        ROLES.TRUSTED_SELLER

    },


    support: {

        emoji: "🛠️",

        name: "Support Ticket",

        pingRole:
        ROLES.STAFF

    },


    join: {

        emoji: "🪖",

        name: "Join NSC",

        pingRole:
        ROLES.STAFF

    },


    alliance: {

        emoji: "🤝",

        name: "Alliance Ticket",

        pingRole:
        ROLES.STAFF

    },


    report: {

        emoji: "🚨",

        name: "Report Ticket",

        pingRole:
        ROLES.STAFF

    }

};



async function createTicket(
    interaction,
    type
) {


    const config =
        ticketTypes[type];


    if (!config) {

        return interaction.editReply({

            content:
            "❌ Invalid ticket type."

        });

    }



    if (
        hasOpenTicket(
            interaction.user.id,
            type
        )
    ) {

        return interaction.editReply({

            content:
            "❌ You already have this type of ticket open."

        });

    }



    let answers =
    "No information provided.";



    if (
        interaction.isModalSubmit()
    ) {

        const fields =
        interaction.fields.fields;


        answers =
        [...fields.values()]
        .map(field =>

`**${field.customId}**
${field.value}`

        )
        .join("\n\n");

    }




    const channelName =
        `${config.emoji}-${getChannelName(type)}`;



    const channel =
    await interaction.guild.channels.create({

        name:
        channelName,

        type:
        ChannelType.GuildText,

        parent:
        CATEGORY_ID,


        permissionOverwrites:[


            {

                id:
                interaction.guild.roles.everyone.id,

                deny:[
                    PermissionFlagsBits.ViewChannel
                ]

            },


            {

                id:
                interaction.user.id,

                allow:[

                    PermissionFlagsBits.ViewChannel,

                    PermissionFlagsBits.SendMessages,

                    PermissionFlagsBits.ReadMessageHistory

                ]

            },


            {

                id:
                ROLES.FOUNDER,

                allow:[

                    PermissionFlagsBits.ViewChannel,

                    PermissionFlagsBits.SendMessages

                ]

            },


            {

                id:
                ROLES.OWNER,

                allow:[

                    PermissionFlagsBits.ViewChannel,

                    PermissionFlagsBits.SendMessages

                ]

            },


            {

                id:
                config.pingRole,

                allow:[

                    PermissionFlagsBits.ViewChannel,

                    PermissionFlagsBits.SendMessages,

                    PermissionFlagsBits.ReadMessageHistory

                ]

            }

        ]

    });



    addOpenTicket(

        interaction.user.id,

        channel.id,

        type

    );




    const embed =
    new EmbedBuilder()

    .setColor("#8B0000")

    .setTitle(
        `${config.emoji} ${config.name}`
    )

    .setDescription(

`Welcome ${interaction.user}!

A staff member will assist you soon.

━━━━━━━━━━━━━━

👤 **User**
${interaction.user}

📂 **Type**
${config.name}

📋 **Information**

${answers}

━━━━━━━━━━━━━━

NSC | No Second Chances`

    )

    .setTimestamp();





    const buttons =
    new ActionRowBuilder()

    .addComponents(


        new ButtonBuilder()

        .setCustomId(
            "ticket_claim"
        )

        .setLabel(
            "Claim"
        )

        .setEmoji(
            "🟢"
        )

        .setStyle(
            ButtonStyle.Success
        ),



        new ButtonBuilder()

        .setCustomId(
            "ticket_close"
        )

        .setLabel(
            "Close"
        )

        .setEmoji(
            "🔴"
        )

        .setStyle(
            ButtonStyle.Danger
        )

    );





    await channel.send({

        content:
        `<@${config.pingRole}> ${interaction.user}`,

        embeds:[
            embed
        ],

        components:[
            buttons
        ]

    });



    return channel;

}



module.exports = {

    createTicket

};
