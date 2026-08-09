const { ActivityType } = require("discord.js");

module.exports = {

  name: "clientReady",

  once: true,

  execute(client) {

    console.log(
      `🔴 NSC Bot Online: ${client.user.tag}`
    );

    console.log(
      `🌐 Servers: ${client.guilds.cache.size}`
    );

    client.user.setPresence({

      activities: [
        {
          name: "NSC | No Second Chances",
          type: ActivityType.Watching
        }
      ],

      status: "online"

    });

  }

};
