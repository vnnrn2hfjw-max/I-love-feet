const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");


module.exports = {

    data: new SlashCommandBuilder()

        .setName("ticket")

        .setDescription(
            "Create an NSC ticket panel"
        ),



    async execute(interaction) {


        const embed =
            new EmbedBuilder()

            .setColor("#8B0000")

            .setTitle(
                "🎟️ NSC Ticket System"
            )

            .setDescription(

`Welcome to **NSC | No Second Chances**

Choose the ticket type that matches your request.

━━━━━━━━━━━━━━━━━━

💰 **Buyer Ticket**
For purchases and sellers.

🛠️ **Support Ticket**
For help and problems.

🪖 **Join NSC**
Apply to join NSC.

🤝 **Alliance Ticket**
Partnership requests.

🚨 **Report Ticket**
Report a player or issue.

━━━━━━━━━━━━━━━━━━

Our staff team will assist you as soon as possible.`

            )

            .setFooter({

                text:
                "NSC | No Second Chances"

            })

            .setTimestamp();



        const menu =
            new StringSelectMenuBuilder()

            .setCustomId(
                "ticket_select"
            )

            .setPlaceholder(
                "Select a ticket type..."
            )

            .addOptions(

                {
                    label:
                    "Buyer Ticket",

                    description:
                    "Purchase or seller help",

                    value:
                    "buyer",

                    emoji:
                    "💰"
                },


                {
                    label:
                    "Support Ticket",

                    description:
                    "Need help?",

                    value:
                    "support",

                    emoji:
                    "🛠️"
                },


                {
                    label:
                    "Join NSC",

                    description:
                    "Apply to join NSC",

                    value:
                    "join",

                    emoji:
                    "🪖"
                },


                {
                    label:
                    "Alliance Ticket",

                    description:
                    "Create an alliance",

                    value:
                    "alliance",

                    emoji:
                    "🤝"
                },


                {
                    label:
                    "Report Ticket",

                    description:
                    "Report a problem",

                    value:
                    "report",

                    emoji:
                    "🚨"
                }

            );



        const row =
            new ActionRowBuilder()
            .addComponents(menu);



        await interaction.reply({

            embeds:[
                embed
            ],

            components:[
                row
            ]

        });

    }

};
