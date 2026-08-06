require("dotenv").config();

const {
    Client,
    Collection,
    GatewayIntentBits,
    Partials
} = require("discord.js");

const fs = require("fs");
const path = require("path");


const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent

    ],

    partials: [

        Partials.Channel,
        Partials.Message,
        Partials.Reaction

    ]

});


client.commands = new Collection();



/* LOAD COMMANDS */

const commandsPath =
path.join(__dirname, "commands");


if (fs.existsSync(commandsPath)) {


    const commandFiles =
    fs.readdirSync(commandsPath)
    .filter(file =>
        file.endsWith(".js")
    );


    for (const file of commandFiles) {


        try {

            const command =
            require(
                `./commands/${file}`
            );


            if (
                command.data &&
                command.execute
            ) {


                client.commands.set(
                    command.data.name,
                    command
                );


                console.log(
                    `✅ Loaded Command: ${command.data.name}`
                );


            }


        } catch(error) {

            console.error(
                `❌ Failed loading ${file}`,
                error
            );

        }

    }

}



/* LOAD EVENTS */

const eventsPath =
path.join(__dirname, "events");


if (fs.existsSync(eventsPath)) {


    const eventFiles =
    fs.readdirSync(eventsPath)
    .filter(file =>
        file.endsWith(".js")
    );


    for (const file of eventFiles) {


        try {

            const event =
            require(
                `./events/${file}`
            );


            if (event.once) {


                client.once(
                    event.name,
                    (...args)=>
                    event.execute(
                        ...args,
                        client
                    )
                );


            } else {


                client.on(
                    event.name,
                    (...args)=>
                    event.execute(
                        ...args,
                        client
                    )
                );


            }


            console.log(
                `✅ Loaded Event: ${event.name}`
            );


        } catch(error) {

            console.error(
                `❌ Failed loading event ${file}`,
                error
            );

        }

    }

}






client.login(
process.env.TOKEN
);
