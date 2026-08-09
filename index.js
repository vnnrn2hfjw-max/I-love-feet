require("dotenv").config();

console.log("🟢 NSC BOT: index.js started");

const {
  Client,
  GatewayIntentBits,
  Collection
} = require("discord.js");

const fs = require("fs");
const path = require("path");

console.log("🟢 Discord.js loaded");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();


// ======================
// COMMANDS
// ======================

const commandsPath = path.join(__dirname, "Commands");

console.log(`📂 Commands path: ${commandsPath}`);

if (!fs.existsSync(commandsPath)) {
  console.error("❌ Commands folder does NOT exist!");
  process.exit(1);
}

const commandFiles = fs.readdirSync(commandsPath)
  .filter(file => file.endsWith(".js"));

console.log(`📋 Found ${commandFiles.length} command files.`);

for (const file of commandFiles) {
  try {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
      console.log(`✅ Loaded command: ${command.data.name}`);
    } else {
      console.log(`⚠️ Skipped ${file}: missing data or execute`);
    }

  } catch (error) {
    console.error(`❌ Error loading ${file}:`, error);
  }
}


// ======================
// EVENTS
// ======================

const eventsPath = path.join(__dirname, "Events");

console.log(`📂 Events path: ${eventsPath}`);

if (!fs.existsSync(eventsPath)) {
  console.error("❌ Events folder does NOT exist!");
  process.exit(1);
}

const eventFiles = fs.readdirSync(eventsPath)
  .filter(file => file.endsWith(".js"));

console.log(`📋 Found ${eventFiles.length} event files.`);

for (const file of eventFiles) {
  try {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (!event.name || !event.execute) {
      console.log(`⚠️ Skipped event: ${file}`);
      continue;
    }

    if (event.once) {
      client.once(event.name, (...args) => {
        event.execute(...args, client);
      });
    } else {
      client.on(event.name, (...args) => {
        event.execute(...args, client);
      });
    }

    console.log(`✅ Loaded event: ${event.name}`);

  } catch (error) {
    console.error(`❌ Error loading event ${file}:`, error);
  }
}


// ======================
// TOKEN
// ======================

if (!process.env.TOKEN) {
  console.error("❌ TOKEN is missing!");
  process.exit(1);
}

console.log("🔐 TOKEN found");
console.log("🔄 Attempting Discord login...");


// ======================
// LOGIN
// ======================

client.login(process.env.TOKEN)
  .then(() => {
    console.log("🟢 Discord login successful!");
  })
  .catch(error => {
    console.error("❌ Discord login failed:");
    console.error(error);
    process.exit(1);
  });
