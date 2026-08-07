const {
    ChannelType,
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


const TYPES = {

    buyer: {
        name: "Buyer Ticket",
        emoji: "💰",
        role: "1502723065795051693"
    },

    support: {
        name: "Support Ticket",
        emoji: "🛠️",
        role: "1502708624487616684"
    },

    join: {
        name: "Join NSC",
        emoji: "🪖",
        role: "1502708624487616684"
    },

    alliance: {
        name: "Alliance Ticket",
        emoji: "🤝",
        role: "1502708624487616684"
    },

    report: {
        name: "Report Ticket",
        emoji: "🚨",
        role: "1502708624487616684"
    }

};


async function createTicket(interaction, type) {

    const ticket = TYPES[type];

    if (!ticket) {
        throw new Error("Invalid ticket type.");
    }


    if (hasOpenTicket(interaction.user.id, type)) {
        return false;
    }


    let info = "No information provided.";

    if (interaction.fields) {

        info = [...interaction.fields.fields.values()]
            .map(field =>
                `**${field.customId}**\n${field.value}`
            )
            .join("\n\n");

    }


    const channel = await interaction.guild.channels.create({

        name: `${ticket.emoji}-${getChannelName(type)}`,

        type: ChannelType.GuildText,

        parent: CATEGORY_ID

    });


    await channel.permissionOverwrites.edit(
        interaction.guild.id,
        {
            ViewChannel: false
        }
    );


    await channel.permissionOverwrites.edit(
        interaction.user.id,
        {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true
        }
    );


    if (ticket.role) {

        const role = interaction.guild.roles.cache.get(ticket.role);

        if (role) {

            await channel.permissionOverwrites.edit(
                role.id,
                {
                    ViewChannel: true,
                    SendMessages: true,
                    ReadMessageHistory: true
                }
            );

        }

    }


    addOpenTicket(
        interaction.user.id,
        channel.id,
        type
    );


    const embed = new EmbedBuilder()

        .setColor("#8B0000")

        .setTitle(
            `${ticket.emoji} ${ticket.name}`
        )

        .setDescription(
`Welcome ${interaction.user}

Staff will assist you soon.

━━━━━━━━━━━━━━

${info}

━━━━━━━━━━━━━━`
        )

        .setTimestamp();


    const buttons = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId("ticket_claim")
                .setLabel("Claim")
                .setEmoji("🟢")
                .setStyle(ButtonStyle.Success),


            new ButtonBuilder()
                .setCustomId("ticket_close")
                .setLabel("Close")
                .setEmoji("🔴")
                .setStyle(ButtonStyle.Danger)

        );


    await channel.send({

        content: `${interaction.user}`,

        embeds: [embed],

        components: [buttons]

    });


    return channel;

}


module.exports = {
    createTicket
};
