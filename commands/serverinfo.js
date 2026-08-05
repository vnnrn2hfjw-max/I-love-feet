const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");


module.exports = {


data:

new SlashCommandBuilder()

.setName("serverinfo")

.setDescription(
"Shows server information"
),



async execute(interaction){


const guild =
interaction.guild;



const embed = new EmbedBuilder()

.setColor("#8B0000")

.setTitle(
`📌 ${guild.name}`
)

.setThumbnail(
guild.iconURL()
)

.setDescription(`

👑 Owner:
<@${guild.ownerId}>

👥 Members:
${guild.memberCount}

🆔 Server ID:
${guild.id}

📅 Created:
<t:${Math.floor(guild.createdTimestamp / 1000)}:R>

🔴 NSC | No Second Chances

`)

.setTimestamp();



interaction.reply({

embeds:[embed]

});


}

};
