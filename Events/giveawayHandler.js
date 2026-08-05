// ======================
// 🎁 GIVEAWAY HANDLER
// ======================

const fs = require("fs");

const {
  EmbedBuilder
} = require("discord.js");


const FILE = "./data/giveaways.json";


function load(){

if(!fs.existsSync(FILE)){

fs.writeFileSync(FILE,"[]");

}

return JSON.parse(
fs.readFileSync(FILE,"utf8")
);

}



function save(data){

fs.writeFileSync(

FILE,

JSON.stringify(
data,
null,
2
)

);

}



module.exports = {

name:"ready",

once:true,


execute(client){



setInterval(async()=>{


const giveaways = load();


for(const giveaway of giveaways){


if(
giveaway.ended
)
continue;



if(
Date.now() >= giveaway.end
){



giveaway.ended = true;



const channel =
client.channels.cache.get(
giveaway.channel
);



if(!channel)
continue;



const message =
await channel.messages.fetch(
giveaway.message
)
.catch(()=>null);



if(!message)
continue;



if(
giveaway.entries.length === 0
){


channel.send(
"❌ No one entered the giveaway."
);


continue;


}



const winners = [];


for(
let i = 0;
i < giveaway.winners;
i++
){


const winner =

giveaway.entries[
Math.floor(
Math.random()
*
giveaway.entries.length
)
];



if(winner && !winners.includes(winner)){

winners.push(winner);

}


}



const embed = new EmbedBuilder()

.setColor("#8B0000")

.setTitle(
"🎉 NSC GIVEAWAY ENDED"
)

.setDescription(`

🎁 Prize:
${giveaway.prize}


🏆 Winners:

${winners.map(
x=>`<@${x}>`
).join("\n")}


━━━━━━━━━━━━━━

🔴 NSC | No Second Chances

`);



await message.edit({

embeds:[
embed
],

components:[]

});



}


}



save(giveaways);



},10000);



}

};
