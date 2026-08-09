const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");
const path = require("path");
const ms = require("ms");

const config = require("../config");

const DATA_FILE = path.join(
  __dirname,
  "..",
  "Data",
  "giveaways.json"
);


function loadGiveaways() {

  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }

  return JSON.parse(
    fs.readFileSync(DATA_FILE, "utf8")
  );

}


function saveGiveaways(giveaways) {

  fs.mkdirSync(
    path.dirname(DATA_FILE),
    { recursive: true }
  );

  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(giveaways, null, 2)
  );

}


module.exports = {

  data: new SlashCommandBuilder()

    .setName("giveaway")

    .setDescription("Create an NSC giveaway")

    .addStringOption(option =>
      option
        .setName("prize")
        .setDescription("Giveaway prize")
        .setRequired(true)
    )

    .addStringOption(option =>
      option
        .setName("duration")
        .setDescription("Example: 10m, 1h, 1d")
        .setRequired(true)
    )

    .addIntegerOption(option =>
      option
        .setName("winners")
        .setDescription("Number of winners")
        .setMinValue(1)
        .setRequired(true)
    ),


  async execute(interaction) {

    if (
      !interaction.member.permissions.has(
        PermissionFlagsBits.ManageGuild
      )
    ) {

      return interaction.reply({
        content: "❌ You don't have permission to create giveaways.",
        ephemeral: true
      });

    }


    const prize =
      interaction.options.getString("prize");

    const duration =
      interaction.options.getString("duration");

    const winnerCount =
      interaction.options.getInteger("winners");


    const durationMs = ms(duration);


    if (!durationMs || durationMs <= 0) {

      return interaction.reply({
        content:
          "❌ Invalid duration. Use something like `10m`, `1h`, or `1d`.",
        ephemeral: true
      });

    }


    const giveaways =
      loadGiveaways();


    const giveaway = {

      id: Date.now().toString(),

      prize,

      winners: winnerCount,

      end: Date.now() + durationMs,

      entries: [],

      ended: false,

      channelId: interaction.channel.id,

      messageId: null

    };


    giveaways.push(giveaway);

    saveGiveaways(giveaways);


    const embed = new EmbedBuilder()

      .setColor(config.COLORS.PRIMARY)

      .setTitle("🎉 NSC GIVEAWAY")

      .setDescription(

        `**Prize:** ${prize}\n\n` +

        `🏆 **Winners:** ${winnerCount}\n` +

        `⏰ **Ends:** <t:${Math.floor(giveaway.end / 1000)}:R>\n` +

        `👥 **Entries:** 0\n\n` +

        `Click the button below to enter!`

      )

      .setFooter({
        text: config.BRANDING.FOOTER,
        iconURL: config.BRANDING.ICON
      });


    const row = new ActionRowBuilder()

      .addComponents(

        new ButtonBuilder()

          .setCustomId(
            `giveaway_enter_${giveaway.id}`
          )

          .setLabel("Enter Giveaway")

          .setEmoji("🎉")

          .setStyle(ButtonStyle.Danger)

      );


    const message =
      await interaction.channel.send({

        embeds: [embed],

        components: [row]

      });


    giveaway.messageId =
      message.id;


    saveGiveaways(giveaways);


    await interaction.reply({

      content:
        `✅ Giveaway created successfully!`,

      ephemeral: true

    });

  }

};
