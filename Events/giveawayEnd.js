// ======================
// 🎁 GIVEAWAY AUTO END
// ======================

const fs = require("fs");

const {
  EmbedBuilder
} = require("discord.js");

const config = require("../config");


const FILE = "./data/giveaways.json";


function loadGiveaways(){

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



module.exports = {


name:"ready",

once:true,


execute(client){


setInterval(async()=>{


const giveaways =
loadGiveaways();



for(const giveaway of giveaways){


if(giveaway.ended)
continue;



if(Date.now() < giveaway.end)
continue;



giveaway.ended = true;



const channel =
client.channels.cache.get(
giveaway.channel
);



if(!channel)
continue;



let winners = [];



while(

winners.length < giveaway.winners &&

winners.length < giveaway.entries.length

){


const winner =

giveaway.entries[

Math.floor(

Math.random()

*

giveaway.entries.length

)

];



if(!winners.includes(winner)){

winners.push(winner);

}


}



const embed = new EmbedBuilder()

.setColor(
config.COLORS.PRIMARY
)

.setTitle(
"🎉 NSC GIVEAWAY ENDED"
)

.setDescription(`

🎁 **Prize**

${giveaway.prize}


🏆 **Winner(s)**

${winners.map(
x=>`<@${x}>`
).join("\n")}


👥 **Entries**

${giveaway.entries.length}


━━━━━━━━━━━━━━

🔴⚫ NSC | No Second Chances

`)

.setFooter({

text:
config.BRANDING.FOOTER,

iconURL:
config.BRANDING.ICON

})

.setTimestamp();



await channel.send({

content:

winners.map(
x=>`<@${x}>`
).join(" "),

embeds:[embed]

});



}



saveGiveaways(
giveaways
);



},10000);



}

};
