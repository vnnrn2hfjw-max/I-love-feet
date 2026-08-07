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
            .setDescription(`
Welcome to **NSC | No Second Chances**

Please select the type of ticket you would like to open.

━━━━━━━━━━━━━━━━━━

💰 **Buyer Ticket**
Purchase items or services.

🛠️ **Support Ticket**
Need help from staff.

🪖 **Join NSC**
Apply to join NSC.

🤝 **Alliance**
Request an alliance.

🚨 **Report**
Report a player or staff member.

━━━━━━━━━━━━━━━━━━
            `)
            .setFooter({
                text: "NSC | No Second Chances"
            })
            .setTimestamp();

        const menu = new StringSelectMenuBuilder()
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

        const row = new ActionRowBuilder().addComponents(menu);

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};
