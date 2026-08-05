// ======================
// 📦 IMPORTS
// ======================

const {

  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  UserSelectMenuBuilder,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle

} = require("discord.js");


const fs = require("fs");

const config = require("../config");


// ======================
// 💾 DATABASE
// ======================

const FILE = "./data/staffcases.json";


function loadCases(){

  if(!fs.existsSync(FILE)){

    fs.writeFileSync(
      FILE,
      "{}"
    );

  }


  return JSON.parse(
    fs.readFileSync(FILE,"utf8")
  );

}


function saveCases(data){

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
// 🔨 STAFF PUNISH
// ======================

module.exports = {


data:

new SlashCommandBuilder()

.setName("staffpunish")

.setDescription(
"NSC Staff Punishment System"
),



async execute(interaction){


if(

!interaction.member.roles.cache.has(
config.STAFF_PUNISH.ADMIN_ROLE
)

){

return interaction.reply({

content:
"❌ You cannot use this system.",

ephemeral:true

});

}



const menu = new UserSelectMenuBuilder()

.setCustomId(
"punish_user"
)

.setPlaceholder(
"Select staff member"
);



await interaction.reply({

content:

"🔨 Select the staff member receiving punishment:",

components:[

new ActionRowBuilder()

.addComponents(menu)

],

ephemeral:true

});


},



// ======================
// 👤 USER SELECT
// ======================

async menuHandler(interaction){


if(
interaction.customId === "punish_user"
){


const user =
interaction.users.first();



const menu =
new StringSelectMenuBuilder()

.setCustomId(
`punish_level_${user.id}`
)

.setPlaceholder(
"Select strike"
)

.addOptions([


{

label:"🟡 Strike 1",

value:"strike1"

},


{

label:"🟠 Strike 2",

value:"strike2"

},


{

label:"🔴 Strike 3",

value:"strike3"

}

]);



return interaction.update({

content:

`👤 Staff Member:

${user}

Choose punishment:`,

components:[

new ActionRowBuilder()

.addComponents(menu)

]

});


}



// ======================
// ⚖️ STRIKE SELECT
// ======================


if(

interaction.customId.startsWith(
"punish_level_"
)

){


const userId =
interaction.customId.replace(
"punish_level_",
""
);


const strike =
interaction.values[0];



const modal = new ModalBuilder()

.setCustomId(
`punish_reason_${userId}_${strike}`
)

.setTitle(
"NSC Staff Punishment"
);



const reason =
new TextInputBuilder()

.setCustomId("reason")

.setLabel("Reason")

.setStyle(
TextInputStyle.Paragraph
)

.setRequired(true);



modal.addComponents(

new ActionRowBuilder()

.addComponents(reason)

);



return interaction.showModal(modal);


}


},



// ======================
// 📝 MODAL
// ======================

async modalHandler(interaction){


if(

!interaction.customId.startsWith(
"punish_reason_"
)

)
return;



const data =
interaction.customId
.replace(
"punish_reason_",
""
)
.split("_");



const userId =
data[0];


const strike =
data[1];



const reason =
interaction.fields.getTextInputValue(
"reason"
);



const cases =
loadCases();


const id =
"NSC-" +
Date.now();



cases[id]={

user:userId,

strike,

reason,

issuedBy:
interaction.user.id,

date:
Date.now()

};


saveCases(
cases
);



const channel =
interaction.guild.channels.cache.get(

config.STAFF_PUNISH.LOG_CHANNEL

);



const embed = new EmbedBuilder()

.setColor(
config.COLORS.PRIMARY
)

.setTitle(
"🔨 NSC STAFF PUNISHMENT"
)

.setDescription(`

📁 Case:
${id}

👤 Staff:
<@${userId}>

⚖️ Punishment:
${strike}

📝 Reason:
${reason}

👑 Issued By:
${interaction.user}

`)

.setFooter({

text:
config.BRANDING.FOOTER,

iconURL:
config.BRANDING.ICON

})

.setTimestamp();



if(channel){

channel.send({

embeds:[embed]

});

}



return interaction.reply({

content:
"✅ Punishment logged.",

ephemeral:true

});


}


};
