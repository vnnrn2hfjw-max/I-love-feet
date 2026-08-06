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

    FOUNDER: "1526243744289128528",
    OWNER: "1502707190358605884",
    STAFF: "1502708624487616684",
    TRUSTED_SELLER: "1502723065795051693"

};



const ticketTypes = {

    buyer: {
        emoji: "💰",
        name: "Buyer Ticket",
        role: ROLES.TRUSTED_SELLER
    },

    support: {
        emoji: "🛠️",
        name: "Support Ticket",
        role: ROLES.STAFF
    },

    join: {
        emoji: "🪖",
        name: "Join NSC",
        role: ROLES.STAFF
    },

    alliance: {
        emoji: "🤝",
        name: "Alliance Ticket",
        role: ROLES.STAFF
    },

    report: {
        emoji: "🚨",
        name: "Report Ticket",
        role: ROLES.STAFF
    }

};



async function createTicket(interaction, type) {


    console.log(
        "Creating ticket:",
        type
    );


    const config =
        ticketTypes[type];


    if (!config) {

        throw new Error(
            "Invalid ticket type"
        );

    }



    if (
        hasOpenTicket(
            interaction.user.id,
            type
        )
    ) {

        return null;

    }



    let answers =
    "No information provided.";



    if (
        interaction.isModalSubmit()
    ) {

        answers =
        [...interaction.fields.fields.values()]
        .map(field =>

            `**${field.customId}**\n${field.value}`

        )
        .join("\n\n");

    }



    console.log(
        "Creating channel..."
    );



    const channel =
    await interaction.guild.channels.create({

        name:
        `${config.emoji}-${getChannelName(type)}`,

        type:
        ChannelType.GuildText,

        parent:
        CATEGORY_ID,


        permissionOverwrites:[


            {
                id:
                interaction.guild.id,

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
                ROLES.STAFF,

                allow:[

                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ReadMessageHistory

                ]
            },


            {
                id:
                ROLES.OWNER,

                allow:[

                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ManageChannels

                ]
            },


            {
                id:
                ROLES.FOUNDER,

                allow:[

                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ManageChannels

                ]
            }

        ]

    });



    console.log(
        "Channel created:",
        channel.id
    );



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

`Welcome ${interaction.user}

A staff member will assist you soon.

━━━━━━━━━━━━━━

👤 User:
${interaction.user}

📋 Information:

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
        `<@&${config.role}> ${interaction.user}`,

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
