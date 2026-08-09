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
// 📋 COMMANDS
// ======================

client.commands = new Collection();

const commandsPath = path.join(
  __dirname,
  "Commands"
);

if (fs.existsSync(commandsPath)) {

  const commandFiles = fs.readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {

    const filePath = path.join(
      commandsPath,
      file
    );

    const command = require(filePath);

    if (command.data && command.execute) {

      client.commands.set(
        command.data.name,
        command
      );

      console.log(
        `✅ Loaded command: ${command.data.name}`
      );

    }

  }

}


// ======================
// ⚡ EVENTS
// ======================

const eventsPath = path.join(
  __dirname,
  "Events"
);

if (fs.existsSync(eventsPath)) {

  const eventFiles = fs.readdirSync(eventsPath)
    .filter(file => file.endsWith(".js"));

  for (const file of eventFiles) {

    const filePath = path.join(
      eventsPath,
      file
    );

    const event = require(filePath);

    if (!event.name || !event.execute)
      continue;


    if (event.once) {

      client.once(
        event.name,
        (...args) =>
          event.execute(...args, client)
      );

    } else {

      client.on(
        event.name,
        (...args) =>
          event.execute(...args, client)
      );

    }

    console.log(
      `✅ Loaded event: ${event.name}`
    );

  }

}


// ======================
// 🔐 LOGIN
// ======================

if (!process.env.TOKEN) {

  console.error(
    "❌ TOKEN is missing from environment variables."
  );

  process.exit(1);

}


client.login(
  process.env.TOKEN
);
