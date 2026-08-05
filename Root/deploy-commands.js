// ======================
// 📦 IMPORTS
// ======================

require("dotenv").config();

const {
  REST,
  Routes
} = require("discord.js");

const fs = require("fs");


// ======================
// 📋 COMMAND LOADER
// ======================

const commands = [];


const commandFiles = fs.readdirSync("./commands")
.filter(file => file.endsWith(".js"));



for (const file of commandFiles) {


  const command = require(
    `./commands/${file}`
  );


  if(command.data) {

    commands.push(
      command.data.toJSON()
    );


    console.log(
      `✅ Loaded command: ${command.data.name}`
    );

  }

}



// ======================
// 🚀 DEPLOY COMMANDS
// ======================

const rest = new REST({

  version: "10"

}).setToken(
  process.env.TOKEN
);



(async()=>{


try{


console.log(
"🔄 Deploying NSC commands..."
);



await rest.put(

Routes.applicationCommands(
process.env.CLIENT_ID
),

{

body: commands

}

);



console.log(
"✅ NSC commands deployed!"
);



}

catch(error){


console.error(
"❌ Deploy failed:"
);


console.error(error);


}


})();
