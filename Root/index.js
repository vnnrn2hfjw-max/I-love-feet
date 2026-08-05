// ======================
// 📦 IMPORTS
// ======================

require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Collection
} = require("discord.js");

const fs = require("fs");
const path = require("path");


// ======================
// 🤖 CLIENT
// ======================

const client = new Client({

  intents: [

    GatewayIntentBits.Guilds,

    GatewayIntentBits.GuildMembers,

    GatewayIntentBits.GuildMessages,

    GatewayIntentBits.MessageContent

  ]

});


// ======================
// 📂 COMMAND SYSTEM
// ======================

client.commands = new Collection();


const commandsPath = path.join(
  __dirname,
  "commands"
);


if (fs.existsSync(commandsPath)) {

  const commandFiles = fs.readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));


  for (const file of commandFiles) {

    const command = require(
      `./commands/${file}`
    );


    if (command.data) {

      client.commands.set(
        command.data.name,
        command
      );


      console.log(
        `✅ Command loaded: ${command.data.name}`
      );

    }

  }

}


// ======================
// 📡 EVENT SYSTEM
// ======================

const eventsPath = path.join(
  __dirname,
  "events"
);


if (fs.existsSync(eventsPath)) {

  const eventFiles = fs.readdirSync(eventsPath)
    .filter(file => file.endsWith(".js"));


  for (const file of eventFiles) {

    const event = require(
      `./events/${file}`
    );


    if (event.once) {

      client.once(
        event.name,
        (...args) => event.execute(...args, client)
      );

    } else {

      client.on(
        event.name,
        (...args) => event.execute(...args, client)
      );

    }


    console.log(
      `📡 Event loaded: ${event.name}`
    );

  }

}


// ======================
// 🚨 ERROR HANDLING
// ======================

process.on(
  "unhandledRejection",
  error => console.error(error)
);

process.on(
  "uncaughtException",
  error => console.error(error)
);


// ======================
// 🚀 LOGIN
// ======================

client.login(
  process.env.TOKEN
);
