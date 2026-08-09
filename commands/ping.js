const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const config = require("../config");

module.exports = {

  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check if the NSC bot is online"),

  async execute(interaction) {

    const embed = new EmbedBuilder()

      .setColor(config.COLORS.PRIMARY)

      .setTitle("🏓 NSC Bot Ping")

      .setDescription(
        `**Bot Latency:** ${interaction.client.ws.ping}ms\n` +
        `**Status:** 🟢 Online`
      )

      .setFooter({
        text: config.BRANDING.FOOTER,
        iconURL: config.BRANDING.ICON
      });

    await interaction.reply({
      embeds: [embed]
    });

  }

};
