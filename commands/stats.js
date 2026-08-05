const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const fs = require("fs");

const FILE = "./Data/stats.json";


module.exports = {

data: new SlashCommandBuilder()

.setName("stats")

.setDescription(
"View your NSC activity stats"
),


async execute(interaction){


let stats = {};


if(fs.existsSync(FILE)){

stats = JSON.parse(
fs.readFileSync(FILE,"utf8")
);

}


const user =
stats[interaction.user.id] || {

messages: 0

};


const embed = new EmbedBuilder()

.setColor("#8B0000")

.setTitle(
"📊 NSC Stats"
)

.setDescription(`

👤 User:
${interaction.user}

💬 Messages:
${user.messages}

`)

.setTimestamp();



interaction.reply({

embeds:[embed]

});


}

};
