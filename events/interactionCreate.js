module.exports = {

name:"interactionCreate",


async execute(interaction,client){



if(interaction.isChatInputCommand()){


const command =
client.commands.get(
interaction.commandName
);


if(!command)return;


try{

await command.execute(
interaction,
client
);


}catch(err){

console.error(err);

}


return;

}




if(
interaction.isStringSelectMenu() &&
interaction.customId==="ticket_select"
){

const {
createTicketModal
}=require("../utils/ticketModals");


return interaction.showModal(

createTicketModal(
interaction.values[0]
)

);

}





if(
interaction.isModalSubmit() &&
interaction.customId.startsWith(
"ticket_modal_"
)
){


await interaction.deferReply({
ephemeral:true
});


const type =
interaction.customId.replace(
"ticket_modal_",
""
);



const {
createTicket
}=require("../utils/createTicket");



try{


const channel =
await createTicket(
interaction,
type
);



if(!channel){

return interaction.editReply({

content:
"❌ You already have this ticket open."

});

}



return interaction.editReply({

content:
`✅ Ticket created: ${channel}`

});


}catch(err){

console.error(err);


return interaction.editReply({

content:
"❌ Ticket creation failed."

});

}


}


}

};
