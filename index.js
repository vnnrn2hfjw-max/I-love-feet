require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Collection
} = require("discord.js");

const fs = require("fs");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});


client.commands = new Collection();


for (const file of fs.readdirSync("./commands").filter(f => f.endsWith(".js"))) {

    const command = require(`./commands/${file}`);

    client.commands.set(
        command.data.name,
        command
    );

    console.log(`Loaded command: ${command.data.name}`);
}



for (const file of fs.readdirSync("./events").filter(f => f.endsWith(".js"))) {

    const event = require(`./events/${file}`);

    if(event.once){

        client.once(
            event.name,
            (...args)=>event.execute(...args, client)
        );

    } else {

        client.on(
            event.name,
            (...args)=>event.execute(...args, client)
        );

    }

}



client.login(process.env.TOKEN);
