// ======================
// 📦 INTERACTION HANDLER
// ======================

module.exports = {

name: "interactionCreate",


async execute(interaction, client){


// ======================
// 💬 SLASH COMMANDS
// ======================

if(interaction.isChatInputCommand()){


const command = client.commands.get(
interaction.commandName
);


if(!command){

return interaction.reply({

content:"❌ Command not found.",

ephemeral:true

});

}


try{


await command.execute(
interaction,
client
);


}catch(error){


console.error(error);


if(!interaction.replied){

await interaction.reply({

content:
"❌ Command error.",

ephemeral:true

});

}


}


}



// ======================
// 🔘 BUTTONS
// ======================

if(interaction.isButton()){


// 🎟️ TICKETS

const ticket =
require("../commands/ticket");


if(

interaction.customId.startsWith(
"ticket_"
)

){

return ticket.buttonHandler(
interaction,
client
);

}



}



// ======================
// 📋 SELECT MENUS
// ======================

if(interaction.isAnySelectMenu()){


const staff =
require("../commands/staffpunish");


if(staff.menuHandler){

return staff.menuHandler(
interaction,
client
);

}


}



// ======================
// 📝 MODALS
// ======================

if(interaction.isModalSubmit()){


const staff =
require("../commands/staffpunish");


if(staff.modalHandler){

return staff.modalHandler(
interaction,
client
);

}


}


}

};
