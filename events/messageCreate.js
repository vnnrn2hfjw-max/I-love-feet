const fs = require("fs");
const path = require("path");


// ======================
// 📊 STATS DATA
// ======================

const DATA_FILE = path.join(
  __dirname,
  "..",
  "Data",
  "stats.json"
);


function loadStats() {

  if (!fs.existsSync(DATA_FILE)) {
    return {};
  }

  try {

    return JSON.parse(
      fs.readFileSync(DATA_FILE, "utf8")
    );

  } catch {

    return {};

  }

}


function saveStats(stats) {

  fs.mkdirSync(
    path.dirname(DATA_FILE),
    { recursive: true }
  );

  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(stats, null, 2)
  );

}


// ======================
// ⚡ MESSAGE EVENT
// ======================

module.exports = {

  name: "messageCreate",

  async execute(message) {


    // Ignore bots

    if (message.author.bot) {
      return;
    }


    // ======================
    // 📊 UPDATE STATS
    // ======================

    const stats =
      loadStats();


    if (!stats[message.author.id]) {

      stats[message.author.id] = {

        messages: 0,

        firstMessage: Date.now(),

        lastMessage: Date.now()

      };

    }


    stats[message.author.id].messages++;

    stats[message.author.id].lastMessage =
      Date.now();


    saveStats(stats);


    // ======================
    // ⚡ TRIGGERS
    // ======================

    const content =
      message.content.toLowerCase();


    // Example trigger

    if (
      content === "nsc"
    ) {

      await message.reply(
        "🔴⚫ **NSC | No Second Chances**"
      );

    }


    // Example trigger

    if (
      content === "ping"
    ) {

      await message.reply(
        `🏓 Pong! **${message.client.ws.ping}ms**`
      );

    }

  }

};
