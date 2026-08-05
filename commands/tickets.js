const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");

const config = require("../config");


module.exports = {


data: new SlashCommandBuilder()

.setName("ticket")

.setDescription(
"Send the NSC ticket panel"
),



async execute(interaction){


const embed = new EmbedBuilder()

.setColor("#8B0000")

.setTitle(
"🔴⚫ NSC Ticket Center"
)

.setDescription(`

Welcome to **NSC | No Second Chances**

Choose a ticket type below:

🟢 Free Access
💰 Buyer
🛠️ Support
🎁 Giveaway
🤝 Alliance

Please only open tickets when needed.

`)

.setTimestamp();



const row = new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("ticket_free")

.setLabel("Free Access")

.setEmoji("🟢")

.setStyle(ButtonStyle.Success),


new ButtonBuilder()

.setCustomId("ticket_buyer")

.setLabel("Buyer")

.setEmoji("💰")

.setStyle(ButtonStyle.Primary),


new ButtonBuilder()

.setCustomId("ticket_support")

.setLabel("Support")

.setEmoji("🛠️")

.setStyle(ButtonStyle.Secondary)

);



await interaction.reply({

embeds:[embed],

components:[row]

});


},



async buttonHandler(interaction){


const type =
interaction.customId.replace(
"ticket_",
""
);



const channel =

await interaction.guild.channels.create({

name:

`${type}-${interaction.user.username}`

.toLowerCase(),


type:

ChannelType.GuildText,


parent:

config.TICKETS.CATEGORY,


permissionOverwrites:[

{

id:
interaction.guild.id,

deny:[

PermissionFlagsBits.ViewChannel

]

},


{

id:
interaction.user.id,

allow:[

PermissionFlagsBits.ViewChannel,

PermissionFlagsBits.SendMessages

]

},


{

id:
config.ROLES.STAFF,

allow:[

PermissionFlagsBits.ViewChannel,

PermissionFlagsBits.SendMessages

]

}

]

});



await channel.send({

content:

`${interaction.user} <@&${config.ROLES.STAFF}>`,


embeds:[

new EmbedBuilder()

.setColor("#8B0000")

.setTitle(
"🎟️ Ticket Created"
)

.setDescription(

"Staff will assist you soon."

)

],


components:[

new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("ticket_close")

.setLabel("Close")

.setEmoji("🔒")

.setStyle(ButtonStyle.Danger)

)

]

});



interaction.reply({

content:

`✅ Ticket created: ${channel}`,

ephemeral:true

});


}

};
