const {

SlashCommandBuilder,
EmbedBuilder

} = require("discord.js");


const fs = require("fs");


const FILE = "./Data/giveaways.json";


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


const giveaways =
JSON.parse(
fs.readFileSync(FILE,"utf8")
);



const id =
interaction.options.getString("id");



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



const winner =

giveaway.entries[

Math.floor(

Math.random()

*

giveaway.entries.length

)

];



const embed = new EmbedBuilder()

.setColor("#8B0000")

.setTitle(
"🔄 Giveaway Reroll"
)

.setDescription(`

🎁 Prize:

${giveaway.prize}


🏆 New Winner:

<@${winner}>

`);



interaction.reply({

embeds:[embed]

});


}

};
