const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows all NSC BOT commands."),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor("#8B0000")
            .setTitle("🔥 NSC BOT Help")
            .setDescription(
`## Main
/ping
/help
/serverinfo
/userinfo
/avatar
/stats

## Tickets
/ticket

## Giveaways
/giveaway

## Staff
/staffpunish
/warn

## Applications
/application`
            )
            .setFooter({
                text: "NSC | No Second Chances"
            });

        await interaction.reply({
            embeds: [embed]
        });
    }
};
