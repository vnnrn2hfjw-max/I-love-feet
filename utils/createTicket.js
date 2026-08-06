// =========================
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
