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

        try {

            const embed = new EmbedBuilder()
                .setColor("#8B0000")
                .setTitle("🎟️ NSC | SUPPORT CENTER")
                .setDescription(
`Welcome to **NSC | No Second Chances**

Select a ticket type below.

━━━━━━━━━━━━━━

💰 Buyer Ticket
🛠️ Support Ticket
🪖 Join NSC
🤝 Alliance
🚨 Report

━━━━━━━━━━━━━━`
                )
                .setFooter({
                    text: "NSC | No Second Chances"
                })
                .setTimestamp();


            const menu = new StringSelectMenuBuilder()
                .setCustomId("ticket_select")
                .setPlaceholder("📂 Select ticket type")
                .addOptions([

                    {
                        label: "Buyer Ticket",
                        value: "buyer",
                        emoji: "💰"
                    },

                    {
                        label: "Support Ticket",
                        value: "support",
                        emoji: "🛠️"
                    },

                    {
                        label: "Join NSC",
                        value: "join",
                        emoji: "🪖"
                    },

                    {
                        label: "Alliance",
                        value: "alliance",
                        emoji: "🤝"
                    },

                    {
                        label: "Report",
                        value: "report",
                        emoji: "🚨"
                    }

                ]);


            const row = new ActionRowBuilder()
                .addComponents(menu);


            await interaction.reply({

                embeds: [embed],

                components: [row]

            });


        } catch(error) {

            console.error("TICKET COMMAND ERROR:", error);


            if (!interaction.replied) {

                await interaction.reply({

                    content:
                    "❌ Ticket command crashed.",

                    ephemeral: true

                }).catch(()=>{});

            }

        }

    }

};
