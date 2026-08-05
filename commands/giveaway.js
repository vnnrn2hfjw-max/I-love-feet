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
// 🎁 GIVEAWAY SYSTEM
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

.setMinValue(1)

)

),



// ======================
// 🎁 CREATE
// ======================

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

ended:false,

channel:
interaction.channel.id,

message:null

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

🎉 Click the button below to enter!

━━━━━━━━━━━━━━

`)

.setFooter({

text:
config.BRANDING.FOOTER,

iconURL:
config.BRANDING.ICON

})

.setTimestamp();



const button = new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId(
`giveaway_${id}`
)

.setLabel(
"🎉 Enter Giveaway"
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



const message =
await interaction.channel.send({

embeds:[embed],

components:[button]

});



giveaway.message =
message.id;



saveGiveaways(
giveaways
);


},



// ======================
// 🎉 ENTER BUTTON
// ======================

async buttonHandler(interaction){


const id =
interaction.customId.replace(
"giveaway_",
""
);



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



if(giveaway.ended){

return interaction.reply({

content:
"❌ Giveaway ended.",

ephemeral:true

});

}



if(
giveaway.entries.includes(
interaction.user.id
)

){

return interaction.reply({

content:
"⚠️ You already entered.",

ephemeral:true

});

}



giveaway.entries.push(
interaction.user.id
);



saveGiveaways(
giveaways
);



return interaction.reply({

content:
"🎉 You entered the NSC Giveaway! Good luck 🔴⚫",

ephemeral:true

});


}



};
