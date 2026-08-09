const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const config = require("../config");

const DATA_FILE = path.join(
  __dirname,
  "..",
  "Data",
  "staffcases.json"
);


// ======================
// 📂 DATA FUNCTIONS
// ======================

function loadCases() {

  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }

  return JSON.parse(
    fs.readFileSync(DATA_FILE, "utf8")
  );

}


function saveCases(cases) {

  fs.mkdirSync(
    path.dirname(DATA_FILE),
    { recursive: true }
  );

  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(cases, null, 2)
  );

}


// ======================
// 🔨 STAFF PUNISHMENT
// ======================

module.exports = {

  data: new SlashCommandBuilder()

    .setName("staffpunish")

    .setDescription("Punish a staff member")

    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Staff member to punish")
        .setRequired(true)
    )

    .addStringOption(option =>
      option
        .setName("punishment")
        .setDescription("Type of punishment")
        .setRequired(true)
        .addChoices(
          {
            name: "Strike 1",
            value: "Strike 1"
          },
          {
            name: "Strike 2",
            value: "Strike 2"
          },
          {
            name: "Strike 3",
            value: "Strike 3"
          },
          {
            name: "Fired",
            value: "Fired"
          }
        )
    )

    .addStringOption(option =>
      option
        .setName("reason")
        .setDescription("Reason for the punishment")
        .setRequired(true)
    ),


  async execute(interaction) {

    // ======================
    // 🔐 PERMISSION CHECK
    // ======================

    if (
      !interaction.member.roles.cache.has(
        config.STAFF_PUNISH.ADMIN_ROLE
      )
    ) {

      return interaction.reply({
        content:
          "❌ You don't have permission to use the staff punishment system.",
        ephemeral: true
      });

    }


    // ======================
    // 👤 GET INFORMATION
    // ======================

    const user =
      interaction.options.getUser("user");

    const punishment =
      interaction.options.getString("punishment");

    const reason =
      interaction.options.getString("reason");


    // ======================
    // 📝 CREATE CASE
    // ======================

    const cases =
      loadCases();

    const caseNumber =
      cases.length + 1;


    const newCase = {

      case: caseNumber,

      userId: user.id,

      username: user.username,

      punishment: punishment,

      reason: reason,

      moderatorId: interaction.user.id,

      createdAt: Date.now()

    };


    cases.push(newCase);

    saveCases(cases);


    // ======================
    // 📋 EMBED
    // ======================

    const embed = new EmbedBuilder()

      .setColor(
        punishment === "Fired"
          ? config.COLORS.ERROR
          : config.COLORS.PRIMARY
      )

      .setTitle("🔨 NSC Staff Punishment")

      .addFields(

        {
          name: "👤 Staff Member",
          value: `<@${user.id}>`,
          inline: true
        },

        {
          name: "⚠️ Punishment",
          value: punishment,
          inline: true
        },

        {
          name: "📝 Reason",
          value: reason,
          inline: false
        },

        {
          name: "👮 Issued By",
          value: `<@${interaction.user.id}>`,
          inline: true
        },

        {
          name: "📁 Case",
          value: `#${caseNumber}`,
          inline: true
        }

      )

      .setFooter({
        text: config.BRANDING.FOOTER,
        iconURL: config.BRANDING.ICON
      })

      .setTimestamp();


    // ======================
    // 📢 LOG
    // ======================

    const logChannel =
      interaction.guild.channels.cache.get(
        config.STAFF_PUNISH.LOG_CHANNEL
      );


    if (logChannel) {

      await logChannel.send({
        embeds: [embed]
      });

    }


    // ======================
    // ✅ RESPONSE
    // ======================

    await interaction.reply({

      content:
        `✅ Staff punishment recorded as **Case #${caseNumber}**.`,

      ephemeral: true

    });

  }

};
