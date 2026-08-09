const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const config = require("../config");

const DATA_FILE = path.join(
  __dirname,
  "..",
  "Data",
  "stats.json"
);


function loadStats() {

  if (!fs.existsSync(DATA_FILE)) {
    return {};
  }

  try {

    return JSON.parse(
      fs.readFileSync(DATA_FILE, "utf8")
    );

  } catch {

    return {};

  }

}


module.exports = {

  data: new SlashCommandBuilder()

    .setName("stats")

    .setDescription("View activity statistics")

    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User to view")
        .setRequired(false)
    ),


  async execute(interaction) {

    const user =
      interaction.options.getUser("user")
      || interaction.user;


    const stats =
      loadStats();


    const userStats =
      stats[user.id] || {

        messages: 0,

        lastMessage: null,

        firstMessage: null

      };


    const lastMessage =
      userStats.lastMessage

        ? `<t:${Math.floor(
            userStats.lastMessage / 1000
          )}:R>`

        : "Never";


    const firstMessage =
      userStats.firstMessage

        ? `<t:${Math.floor(
            userStats.firstMessage / 1000
          )}:R>`

        : "Never";


    const embed =
      new EmbedBuilder()

        .setColor(
          config.COLORS.PRIMARY
        )

        .setTitle("📊 NSC Activity Stats")

        .setThumbnail(
          user.displayAvatarURL()
        )

        .addFields(

          {
            name: "👤 User",
            value: `${user}`,
            inline: true
          },

          {
            name: "💬 Messages",
            value: `${userStats.messages}`,
            inline: true
          },

          {
            name: "📅 First Message",
            value: firstMessage,
            inline: false
          },

          {
            name: "🕐 Last Message",
            value: lastMessage,
            inline: false
          }

        )

        .setFooter({

          text:
            config.BRANDING.FOOTER,

          iconURL:
            config.BRANDING.ICON

        })

        .setTimestamp();


    await interaction.reply({

      embeds: [embed]

    });

  }

};
