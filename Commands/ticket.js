// ======================
// 📦 IMPORTS
// ======================

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


// ======================
// 🎟️ TICKET COMMAND
// ======================

module.exports = {


data: new SlashCommandBuilder()

.setName("ticket")

.setDescription(
"Open the NSC ticket panel"
),



async execute(interaction){


const embed = new EmbedBuilder()

.setColor(
config.COLORS.PRIMARY
)

.setTitle(
"🔴⚫ NSC Ticket Center"
)

.setDescription(`

# 🎟️ Support Center

Welcome to **NSC | No Second Chances**

Choose a ticket category below.

🟢 Free Access
> Apply to join NSC

💰 Buyer
> Purchases and services

🛠️ Support
> Questions and reports

🎁 Giveaway Claim
> Claim rewards

🤝 Alliance
> Partnership requests

━━━━━━━━━━━━━━

⚠️ Do not open unnecessary tickets.

`)

.setFooter({

text:
config.BRANDING.FOOTER,

iconURL:
config.BRANDING.ICON

})

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



const row2 = new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("ticket_giveaway")

.setLabel("Giveaway")

.setEmoji("🎁")

.setStyle(ButtonStyle.Success),


new ButtonBuilder()

.setCustomId("ticket_alliance")

.setLabel("Alliance")

.setEmoji("🤝")

.setStyle(ButtonStyle.Primary)

);



await interaction.reply({

embeds:[embed],

components:[
row,
row2
]

});


},



// ======================
// 🔘 BUTTON HANDLER
// ======================

async buttonHandler(interaction){



if(!interaction.customId.startsWith("ticket_"))
return;



const type =
interaction.customId.replace(
"ticket_",
""
);



const names = {

free:"🟢 Free Access",

buyer:"💰 Buyer",

support:"🛠️ Support",

giveaway:"🎁 Giveaway",

alliance:"🤝 Alliance"

};



const channel = await interaction.guild.channels.create({

name:

`${type}-${interaction.user.username}`,

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



const embed = new EmbedBuilder()

.setColor(
config.COLORS.PRIMARY
)

.setTitle(
"🎟️ NSC Ticket Created"
)

.setDescription(`

Welcome ${interaction.user}

📁 Category:
${names[type]}

A staff member will assist you soon.

`)

.setTimestamp();



const buttons = new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("ticket_claim")

.setLabel("Claim")

.setEmoji("✋")

.setStyle(ButtonStyle.Success),


new ButtonBuilder()

.setCustomId("ticket_close")

.setLabel("Close")

.setEmoji("🔒")

.setStyle(ButtonStyle.Danger)

);



await channel.send({

content:

`${interaction.user} <@&${config.ROLES.STAFF}>`,

embeds:[embed],

components:[buttons]

});



await interaction.reply({

content:

`✅ Ticket created: ${channel}`,

ephemeral:true

});


}

};
