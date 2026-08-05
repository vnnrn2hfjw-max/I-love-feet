const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");


module.exports = {


data:

new SlashCommandBuilder()

.setName("userinfo")

.setDescription(
"Shows user information"
)

.addUserOption(option =>

option

.setName("user")

.setDescription(
"Choose a user"
)

.setRequired(false)

),



async execute(interaction){


const user =

interaction.options.getUser("user")
||
interaction.user;



const member =

await interaction.guild.members.fetch(
user.id
);



const embed = new EmbedBuilder()

.setColor("#8B0000")

.setTitle(
`👤 ${user.username}`
)

.setThumbnail(
user.displayAvatarURL()
)

.setDescription(`

👤 User:
${user}

🆔 ID:
${user.id}

📅 Account Created:
<t:${Math.floor(user.createdTimestamp / 1000)}:R>

📥 Joined Server:
<t:${Math.floor(member.joinedTimestamp / 1000)}:R>

🎭 Roles:
${member.roles.cache
.filter(r => r.id !== interaction.guild.id)
.map(r => r)
.join(", ") || "None"}

🔴 NSC | No Second Chances

`)

.setTimestamp();



interaction.reply({

embeds:[embed]

});


}

};
