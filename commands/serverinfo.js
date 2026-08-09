const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const config = require("../config");

module.exports = {

  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("View information about the server"),

  async execute(interaction) {

    const guild = interaction.guild;

    const owner = await guild.fetchOwner();

    const textChannels = guild.channels.cache.filter(
      channel => channel.isTextBased()
    ).size;

    const voiceChannels = guild.channels.cache.filter(
      channel => channel.isVoiceBased()
    ).size;

    const roles = guild.roles.cache.size - 1;

    const embed = new EmbedBuilder()

      .setColor(config.COLORS.PRIMARY)

      .setTitle(`🖥️ ${guild.name}`)

      .setThumbnail(
        guild.iconURL({ dynamic: true, size: 1024 })
      )

      .addFields(

        {
          name: "👑 Owner",
          value: `${owner}`,
          inline: true
        },

        {
          name: "👥 Members",
          value: `${guild.memberCount}`,
          inline: true
        },

        {
          name: "🆔 Server ID",
          value: `\`${guild.id}\``,
          inline: true
        },

        {
          name: "💬 Text Channels",
          value: `${textChannels}`,
          inline: true
        },

        {
          name: "🔊 Voice Channels",
          value: `${voiceChannels}`,
          inline: true
        },

        {
          name: "🎭 Roles",
          value: `${roles}`,
          inline: true
        },

        {
          name: "📅 Created",
          value: `<t:${Math.floor(
            guild.createdTimestamp / 1000
          )}:F>`,
          inline: false
        }

      )

      .setFooter({

        text: config.BRANDING.FOOTER,

        iconURL: config.BRANDING.ICON

      })

      .setTimestamp();

    await interaction.reply({

      embeds: [embed]

    });

  }

};
