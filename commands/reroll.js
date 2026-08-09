const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const config = require("../config");

const DATA_FILE = path.join(
  __dirname,
  "..",
  "Data",
  "giveaways.json"
);

function loadGiveaways() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveGiveaways(giveaways) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(giveaways, null, 2)
  );
}

module.exports = {

  data: new SlashCommandBuilder()

    .setName("reroll")

    .setDescription("Reroll the winner of a giveaway")

    .addStringOption(option =>
      option
        .setName("id")
        .setDescription("Giveaway ID")
        .setRequired(true)
    ),

  async execute(interaction) {

    if (
      !interaction.member.permissions.has(
        PermissionFlagsBits.ManageGuild
      )
    ) {

      return interaction.reply({
        content:
          "❌ You don't have permission to reroll giveaways.",
        ephemeral: true
      });

    }

    const id =
      interaction.options.getString("id");

    const giveaways =
      loadGiveaways();

    const giveaway =
      giveaways.find(g => g.id === id);

    if (!giveaway) {

      return interaction.reply({
        content: "❌ Giveaway not found.",
        ephemeral: true
      });

    }

    if (!giveaway.entries || giveaway.entries.length === 0) {

      return interaction.reply({
        content:
          "❌ This giveaway has no entries.",
        ephemeral: true
      });

    }

    const shuffled =
      [...giveaway.entries].sort(
        () => Math.random() - 0.5
      );

    const winner =
      shuffled[0];

    const embed = new EmbedBuilder()

      .setColor(config.COLORS.PRIMARY)

      .setTitle("🔄 Giveaway Rerolled")

      .setDescription(
        `🎁 **Prize:** ${giveaway.prize}\n\n` +
        `🏆 **New Winner:** <@${winner}>`
      )

      .setFooter({
        text: config.BRANDING.FOOTER,
        iconURL: config.BRANDING.ICON
      });

    await interaction.reply({
      embeds: [embed]
    });

    saveGiveaways(giveaways);
  }

};
