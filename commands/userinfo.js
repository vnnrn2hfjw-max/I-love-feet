const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const config = require("../config");

module.exports = {

  data: new SlashCommandBuilder()

    .setName("userinfo")

    .setDescription("View information about a user")

    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("The user you want to view")
        .setRequired(false)
    ),


  async execute(interaction) {

    const user =
      interaction.options.getUser("user")
      || interaction.user;


    const member =
      await interaction.guild.members
        .fetch(user.id);


    const roles =
      member.roles.cache
        .filter(role =>
          role.id !== interaction.guild.id
        )
        .sort(
          (a, b) => b.position - a.position
        );


    const roleText =
      roles.size > 0
        ? roles.map(role => `${role}`).join(", ")
        : "None";


    const embed =
      new EmbedBuilder()

        .setColor(
          config.COLORS.PRIMARY
        )

        .setTitle(
          `👤 ${user.username}`
        )

        .setThumbnail(
          user.displayAvatarURL({
            size: 1024
          })
        )

        .addFields(

          {
            name: "👤 User",
            value: `${user}`,
            inline: true
          },

          {
            name: "🆔 User ID",
            value: `\`${user.id}\``,
            inline: true
          },

          {
            name: "🤖 Bot",
            value: user.bot ? "Yes" : "No",
            inline: true
          },

          {
            name: "📅 Account Created",
            value: `<t:${Math.floor(
              user.createdTimestamp / 1000
            )}:F>`,
            inline: false
          },

          {
            name: "📥 Joined Server",
            value: member.joinedTimestamp
              ? `<t:${Math.floor(
                  member.joinedTimestamp / 1000
                )}:F>`
              : "Unknown",
            inline: false
          },

          {
            name: "🎭 Roles",
            value: roleText,
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
