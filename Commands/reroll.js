// ======================
// 📦 IMPORTS
// ======================

const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");

const config = require("../config");


// ======================
// 💾 DATABASE
// ======================

const FILE = "./data/giveaways.json";


function loadGiveaways(){

return JSON.parse(
fs.readFileSync(FILE,"utf8")
);

}



function saveGiveaways(data){

fs.writeFileSync(

FILE,

JSON.stringify(
data,
null,
2
)

);

}


// ======================
// 🔄 REROLL COMMAND
// ======================

module.exports = {


data:

new SlashCommandBuilder()

.setName("reroll")

.setDescription(
"Reroll a giveaway"
)

.addStringOption(option =>

option

.setName("id")

.setDescription(
"Giveaway ID"
)

.setRequired(true)

),



async execute(interaction){


if(

!interaction.member.permissions.has(
PermissionFlagsBits.ManageGuild
)

){

return interaction.reply({

content:
"❌ You don't have permission.",

ephemeral:true

});

}



const id =
interaction.options.getString("id");



const giveaways =
loadGiveaways();



const giveaway =
giveaways.find(
g => g.id === id
);



if(!giveaway){

return interaction.reply({

content:
"❌ Giveaway not found.",

ephemeral:true

});

}



if(
giveaway.entries.length === 0
){

return interaction.reply({

content:
"❌ No entries found.",

ephemeral:true

});

}



const winner =

giveaway.entries[

Math.floor(

Math.random()

*

giveaway.entries.length

)

];



const embed = new EmbedBuilder()

.setColor(
config.COLORS.PRIMARY
)

.setTitle(
"🔄 NSC GIVEAWAY REROLL"
)

.setDescription(`

🎁 Prize:

${giveaway.prize}


🏆 New Winner:

<@${winner}>


🔴⚫ NSC | No Second Chances

`)

.setFooter({

text:
config.BRANDING.FOOTER,

iconURL:
config.BRANDING.ICON

});



await interaction.reply({

embeds:[
embed
]

});


}

};
