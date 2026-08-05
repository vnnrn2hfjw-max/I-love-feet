// ======================
// 🚀 READY EVENT
// ======================

module.exports = {

  name: "ready",

  once: true,


  execute(client) {


    console.log(
      "================================="
    );


    console.log(
      `🔴 NSC Bot Online: ${client.user.tag}`
    );


    console.log(
      `👥 Servers: ${client.guilds.cache.size}`
    );


    console.log(
      "⚫ No Second Chances System Loaded"
    );


    console.log(
      "================================="
    );


    client.user.setPresence({

      activities: [

        {

          name: "NSC | No Second Chances",

          type: 3

        }

      ],


      status: "online"

    });


  }

};
