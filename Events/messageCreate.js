// ======================
// 📊 MESSAGE TRACKER
// ======================

const fs = require("fs");


const FILE = "./data/stats.json";



function loadStats(){

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



function saveStats(data){

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


name:"messageCreate",



execute(message){



// Ignore bots

if(message.author.bot)
return;



const stats =
loadStats();



const id =
message.author.id;



if(!stats[id]){


stats[id] = {

messages:0,

tickets:0,

joined:
Date.now()

};


}



stats[id].messages++;



saveStats(
stats
);



}


};
