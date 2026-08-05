const {

SlashCommandBuilder,
EmbedBuilder

} = require("discord.js");


const config = require("../config");


module.exports = {


data:

new SlashCommandBuilder()

.setName("staffpunish")

.setDescription(
"Punish a staff member"
)

.addUserOption(option =>

option

.setName("user")

.setDescription(
"Staff member"
)

.setRequired(true)

)

.addStringOption(option =>

option

.setName("reason")

.setDescription(
"Reason"
)

.setRequired(true)

),



async execute(interaction){


if(

!interaction.member.roles.cache.has(
config.STAFF_PUNISH.ADMIN_ROLE
)

){

return interaction.reply({

content:
"❌ No permission.",

ephemeral:true

});

}



const user =
interaction.options.getUser("user");


const reason =
interaction.options.getString("reason");



const embed = new EmbedBuilder()

.setColor("#8B0000")

.setTitle(
"🔨 NSC Staff Punishment"
)

.setDescription(`

👤 Staff:
${user}

📝 Reason:
${reason}

👮 Issued by:
${interaction.user}

`);



const log =

interaction.guild.channels.cache.get(

config.STAFF_PUNISH.LOG_CHANNEL

);



if(log){

log.send({

embeds:[embed]

});

}



interaction.reply({

content:
"✅ Punishment logged.",

ephemeral:true

});


}

};
