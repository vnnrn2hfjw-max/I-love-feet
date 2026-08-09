require("dotenv").config();

const {
  REST,
  Routes
} = require("discord.js");

const fs = require("fs");
const path = require("path");


// ======================
// 📋 LOAD COMMANDS
// ======================

const commands = [];

const commandsPath = path.join(
  __dirname,
  "Commands"
);


if (!fs.existsSync(commandsPath)) {

  console.error(
    "❌ Commands folder was not found."
  );

  process.exit(1);

}


const commandFiles = fs.readdirSync(commandsPath)
  .filter(file => file.endsWith(".js"));


for (const file of commandFiles) {

  const filePath = path.join(
    commandsPath,
    file
  );

  const command = require(filePath);


  if (!command.data) {

    console.warn(
      `⚠️ ${file} does not contain command data.`
    );

    continue;

  }


  commands.push(
    command.data.toJSON()
  );


  console.log(
    `✅ Loaded command: ${command.data.name}`
  );

}


// ======================
// 🔐 CHECK VARIABLES
// ======================

if (!process.env.TOKEN) {

  console.error(
    "❌ TOKEN is missing."
  );

  process.exit(1);

}


if (!process.env.CLIENT_ID) {

  console.error(
    "❌ CLIENT_ID is missing."
  );

  process.exit(1);

}


if (!process.env.GUILD_ID) {

  console.error(
    "❌ GUILD_ID is missing."
  );

  process.exit(1);

}


// ======================
// 🚀 DISCORD REST
// ======================

const rest = new REST({
  version: "10"
}).setToken(
  process.env.TOKEN
);


// ======================
// 📡 DEPLOY COMMANDS
// ======================

(async () => {

  try {

    console.log(
      `🔄 Deploying ${commands.length} NSC commands...`
    );


    await rest.put(

      Routes.applicationGuildCommands(

        process.env.CLIENT_ID,

        process.env.GUILD_ID

      ),

      {
        body: commands
      }

    );


    console.log(
      "✅ NSC commands deployed successfully!"
    );


  } catch (error) {

    console.error(
      "❌ Failed to deploy commands:"
    );

    console.error(error);

    process.exit(1);

  }

})();
