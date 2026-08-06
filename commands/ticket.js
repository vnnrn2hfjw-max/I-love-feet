const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket")
        .setDescription("Open the NSC ticket panel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor("#8B0000")
            .setTitle("🎟️ NSC | SUPPORT CENTER")
            .setDescription(
`Welcome to **NSC | No Second Chances**.

Please choose a ticket type from the menu below.

━━━━━━━━━━━━━━━━━━

💰 **Buyer Ticket**
Purchase items or services.

🛠️ **Support Ticket**
Need help from staff.

🪖 **Join NSC**
Join the gang.

🤝 **Alliance**
Request an alliance.

🚨 **Report**
Report a player.

━━━━━━━━━━━━━━━━━━`
            )
            .setFooter({
                text: "NSC | No Second Chances"
            })
            .setTimestamp();

        const menu =
            new StringSelectMenuBuilder()
                .setCustomId("ticket_select")
                .setPlaceholder("📂 Select a ticket type...")
                .addOptions([
                    {
                        label: "Buyer Ticket",
                        description: "Purchase from NSC.",
                        emoji: "💰",
                        value: "buyer"
                    },
                    {
                        label: "Support Ticket",
                        description: "Get help from staff.",
                        emoji: "🛠️",
                        value: "support"
                    },
                    {
                        label: "Join NSC",
                        description: "Apply to join NSC.",
                        emoji: "🪖",
                        value: "join"
                    },
                    {
                        label: "Alliance",
                        description: "Request an alliance.",
                        emoji: "🤝",
                        value: "alliance"
                    },
                    {
                        label: "Report",
                        description: "Report a player.",
                        emoji: "🚨",
                        value: "report"
                    }
                ]);

        const row =
            new ActionRowBuilder()
                .addComponents(menu);

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};
