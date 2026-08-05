const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Shows the bot latency."),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor("#8B0000")
            .setTitle("🏓 Pong!")
            .setDescription(
                `**Latency:** ${interaction.client.ws.ping}ms`
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
};
