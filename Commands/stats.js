// ======================
// 📦 IMPORTS
// ======================

const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const fs = require("fs");

const config = require("../config");


// ======================
// 💾 DATABASE
// ======================

const FILE = "./stats.json";


function loadStats(){

  if(!fs.existsSync(FILE)){

    fs.writeFileSync(
      FILE,
      "{}"
    );

  }


  return JSON.parse(
    fs.readFileSync(
      FILE,
      "utf8"
    )
  );

}


// ======================
// 📊 STATS COMMAND
// ======================

module.exports = {


data: new SlashCommandBuilder()

.setName("stats")

.setDescription(
"View NSC member statistics"
)

.addUserOption(option =>

option

.setName("user")

.setDescription(
"Choose a member"
)

.setRequired(false)

),



async execute(interaction){


const user =

interaction.options.getUser("user")
||
interaction.user;



const stats = loadStats();


const data =

stats[user.id]
||
{

messages:0,

tickets:0,

joined:Date.now()

};



const embed = new EmbedBuilder()

.setColor(
config.COLORS.PRIMARY
)

.setTitle(
"📊 NSC Member Stats"
)

.setDescription(`

👤 **User**
> ${user}

💬 **Messages**
> ${data.messages}

🎟️ **Tickets Handled**
> ${data.tickets}

📅 **Member Since**
> <t:${Math.floor(data.joined / 1000)}:R>

`)

.setThumbnail(
user.displayAvatarURL()
)

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
