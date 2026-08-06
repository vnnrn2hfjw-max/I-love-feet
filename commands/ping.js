const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Check the bot's latency."),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor("#8B0000")
            .setTitle("🏓 Pong!")
            .setDescription(`**Gateway Ping:** \`${interaction.client.ws.ping}ms\``)
            .setFooter({ text: "NSC | No Second Chances" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
