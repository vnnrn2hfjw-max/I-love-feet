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
    founder: "1526243744289128528",
    owner: "1502707190358605884",
    staff: "1502708624487616684",
    trustedSeller: "1502723065795051693"
};


const ticketTypes = {

    buyer: {
        emoji: "💰",
        name: "Buyer",
        pingRole: ROLES.trustedSeller
    },

    support: {
        emoji: "🛠️",
        name: "Support",
        pingRole: ROLES.staff
    },

    join: {
        emoji: "🪖",
        name: "Join NSC",
        pingRole: ROLES.staff
    },

    alliance: {
        emoji: "🤝",
        name: "Alliance",
        pingRole: ROLES.staff
    },

    report: {
        emoji: "🚨",
        name: "Report",
        pingRole: ROLES.staff
    }

};



async function createTicket(interaction, type) {


    const config = ticketTypes[type];


    if (!config) {
        return;
    }


    if (hasOpenTicket(
        interaction.user.id,
        type
    )) {

        return interaction.reply({
            content:
                "❌ You already have this type of ticket open.",
            ephemeral: true
        });

    }


    const answers = [];


    if (interaction.isModalSubmit()) {

        for (const field of interaction.fields.fields.values()) {

            answers.push(
                `**${field.customId}**\n${field.value}`
            );

        }

    }     const channelName =
        `${config.emoji}┃${getChannelName(type)}`;


    const channel =
        await interaction.guild.channels.create({

            name: channelName,

            type: ChannelType.GuildText,

            parent: CATEGORY_ID,


            permissionOverwrites: [

                {
                    id: interaction.guild.roles.everyone.id,

                    deny: [
                        PermissionFlagsBits.ViewChannel
                    ]
                },


                {
                    id: interaction.user.id,

                    allow: [

                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.AttachFiles,
                        PermissionFlagsBits.EmbedLinks

                    ]

                },


                {
                    id: ROLES.founder,

                    allow: [

                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ManageChannels

                    ]

                },


                {
                    id: ROLES.owner,

                    allow: [

                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ManageChannels

                    ]

                },


                {
                    id: config.pingRole,

                    allow: [

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



    const answerText =
        answers.length > 0
        ? answers.join("\n\n")
        : "No information provided.";



    const embed =
        new EmbedBuilder()

        .setColor("#8B0000")

        .setTitle(
            `${config.emoji} ${config.name} Ticket`
        )

        .setDescription(

`Welcome ${interaction.user}!

A staff member will assist you shortly.

━━━━━━━━━━━━━━━━━━

**Status**
🟢 Open

**Opened By**
${interaction.user}

**Ticket Type**
${config.name}

━━━━━━━━━━━━━━━━━━

📋 **Information Provided**

${answerText}

━━━━━━━━━━━━━━━━━━`

        )

        .setFooter({
            text:
            "NSC | No Second Chances"
        })

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
        `<@&${config.pingRole}> ${interaction.user}`,

        embeds:[
            embed
        ],

        components:[
            buttons
        ]

    });



    await interaction.reply({

        content:
        `✅ Your ticket has been created: ${channel}`,

        ephemeral:true

    });



    return channel;

}



module.exports = {
    createTicket
};
