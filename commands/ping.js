// ======================
// 📦 IMPORTS
// ======================

const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const config = require("../config");


// ======================
// 🏓 PING COMMAND
// ======================

module.exports = {

  data: new SlashCommandBuilder()

    .setName("ping")

    .setDescription(
      "Check bot latency"
    ),



  async execute(interaction) {


    const ping = Date.now() - interaction.createdTimestamp;


    const embed = new EmbedBuilder()

      .setColor(
        config.COLORS.PRIMARY
      )

      .setTitle(
        "🏓 NSC Bot Ping"
      )

      .setDescription(`

🔴 **Bot Latency**
> ${ping}ms

🤖 **API Latency**
> ${interaction.client.ws.ping}ms

⚫ **Status**
> Online

      `)

      .setFooter({

        text:
        config.BRANDING.FOOTER,

        iconURL:
        config.BRANDING.ICON

      })

      .setTimestamp();



    await interaction.reply({

      embeds:[
        embed
      ]

    });


  }

};
