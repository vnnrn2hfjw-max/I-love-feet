// ======================
// 📦 IMPORTS
// ======================

const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");
const ms = require("ms");

const config = require("../config");


// ======================
// 💾 DATABASE
// ======================

const FILE = "./data/giveaways.json";


function loadGiveaways(){

  if(!fs.existsSync(FILE)){

    fs.writeFileSync(
      FILE,
      "[]"
    );

  }


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
// 🎁 GIVEAWAY COMMAND
// ======================

module.exports = {


data:

new SlashCommandBuilder()

.setName("giveaway")

.setDescription(
"NSC Giveaway System"
)

.addSubcommand(sub =>

sub

.setName("create")

.setDescription(
"Create a giveaway"
)


.addStringOption(option =>

option

.setName("prize")

.setDescription(
"Giveaway prize"
)

.setRequired(true)

)


.addStringOption(option =>

option

.setName("duration")

.setDescription(
"Example: 1h, 24h, 7d"
)

.setRequired(true)

)


.addIntegerOption(option =>

option

.setName("winners")

.setDescription(
"Number of winners"
)

.setRequired(true)

)

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



if(
interaction.options.getSubcommand()
!=="create"
)
return;



const prize =
interaction.options.getString("prize");


const duration =
interaction.options.getString("duration");


const winners =
interaction.options.getInteger("winners");



const time =
ms(duration);



if(!time){

return interaction.reply({

content:
"❌ Invalid duration.",

ephemeral:true

});

}



const id =
Date.now().toString();



const giveaway = {

id,

prize,

duration,

winners,

entries:[],

end:
Date.now()+time,

host:
interaction.user.id

};



const giveaways =
loadGiveaways();


giveaways.push(
giveaway
);


saveGiveaways(
giveaways
);



const embed = new EmbedBuilder()

.setColor(
config.COLORS.PRIMARY
)

.setTitle(
"🔴⚫ NSC GIVEAWAY"
)

.setDescription(`

# NO SECOND CHANCES

🎁 **Prize**
> ${prize}

🏆 **Winners**
> ${winners}

⏳ **Duration**
> ${duration}

👥 **Entries**
> 0

━━━━━━━━━━━━━━

Click below to enter!

`)

.setFooter({

text:
config.BRANDING.FOOTER,

iconURL:
config.BRANDING.ICON

});



const button = new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId(
`giveaway_${id}`
)

.setLabel(
"🎉 Enter"
)

.setStyle(
ButtonStyle.Danger
)

);



await interaction.reply({

content:
"✅ Giveaway created!",

ephemeral:true

});


interaction.channel.send({

embeds:[
embed
],

components:[
button
]

});


}

};
