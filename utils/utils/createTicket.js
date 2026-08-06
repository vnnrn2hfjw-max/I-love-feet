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

// =========================
// CHANNEL IDS
// =========================

const CATEGORY_ID = "1502731974513786961";
const TICKET_LOGS = "1509800744767721503";

// =========================
// ROLE IDS
// =========================

const ROLES = {
    founder: "1526243744289128528",
    owner: "1502707190358605884",
    member: "1502718828965265499",
    staff: "1502708624487616684",
    trustedSeller: "1502723065795051693"
};

// =========================
// TICKET TYPES
// =========================

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
}; // =========================
// CREATE TICKET
// =========================

async function createTicket(interaction, type) {

    const config = ticketTypes[type];

    if (!config) {
        throw new Error("Invalid ticket type.");
    }

    if (hasOpenTicket(interaction.user.id, type)) {
        return interaction.reply({
            content: `❌ You already have an open **${config.name}** ticket.`,
            ephemeral: true
        });
    }

    const channelName =
        `${config.emoji}┃${getChannelName(type)}`;

    const channel = await interaction.guild.channels.create({

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
                    PermissionFlagsBits.ManageChannels,
                    PermissionFlagsBits.ManageMessages
                ]
            },

            {
                id: ROLES.owner,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ManageChannels,
                    PermissionFlagsBits.ManageMessages
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
    );     // =========================
    // TICKET EMBED
    // =========================

    const ticketEmbed = new EmbedBuilder()
        .setColor("#8B0000")
        .setTitle(`🎟️ ${config.name} Ticket`)
        .setDescription(
`Welcome ${interaction.user}!

A member of our staff will assist you as soon as possible.

━━━━━━━━━━━━━━━━━━

**Status**
🟢 Open

**Claimed By**
Nobody

**Opened By**
${interaction.user}

━━━━━━━━━━━━━━━━━━`
        )
        .setFooter({
            text: "NSC | No Second Chances"
        })
        .setTimestamp();

    const buttons = new ActionRowBuilder().addComponents(
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
        content: `<@&${config.pingRole}> ${interaction.user}`,
        embeds: [ticketEmbed],
        components: [buttons]
    });

    await interaction.reply({
        content: `✅ Your ${config.name} ticket has been created: ${channel}`,
        ephemeral: true
    });

    return channel;
}

module.exports = {
    createTicket
}; 
