const fs = require("fs");
const path = require("path");
const {
  EmbedBuilder
} = require("discord.js");

const config = require("../config");

const DATA_FILE = path.join(
  __dirname,
  "..",
  "Data",
  "giveaways.json"
);


// ======================
// 📂 LOAD / SAVE
// ======================

function loadGiveaways() {

  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }

  try {

    return JSON.parse(
      fs.readFileSync(DATA_FILE, "utf8")
    );

  } catch {

    return [];

  }

}


function saveGiveaways(giveaways) {

  fs.mkdirSync(
    path.dirname(DATA_FILE),
    { recursive: true }
  );

  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(giveaways, null, 2)
  );

}


// ======================
// 🎉 END GIVEAWAYS
// ======================

async function checkGiveaways(client) {

  const giveaways =
    loadGiveaways();

  let changed = false;


  for (const giveaway of giveaways) {

    if (giveaway.ended) {
      continue;
    }


    if (Date.now() < giveaway.end) {
      continue;
    }


    giveaway.ended = true;

    changed = true;


    try {

      const channel =
        await client.channels.fetch(
          giveaway.channelId
        );


      if (!channel) {
        continue;
      }


      const winners = [];


      const entries =
        [...new Set(
          giveaway.entries || []
        )];


      // ======================
      // 🏆 PICK WINNERS
      // ======================

      while (
        winners.length < giveaway.winners &&
        entries.length > 0
      ) {

        const index =
          Math.floor(
            Math.random() * entries.length
          );


        const winner =
          entries.splice(index, 1)[0];


        winners.push(winner);

      }


      // ======================
      // 🏆 NO ENTRIES
      // ======================

      if (winners.length === 0) {

        const embed =
          new EmbedBuilder()

            .setColor(
              config.COLORS.ERROR
            )

            .setTitle(
              "🎉 Giveaway Ended"
            )

            .setDescription(

              `**Prize:** ${giveaway.prize}\n\n` +

              "❌ No one entered the giveaway."

            )

            .setFooter({

              text:
                config.BRANDING.FOOTER,

              iconURL:
                config.BRANDING.ICON

            })

            .setTimestamp();


        await channel.send({
          embeds: [embed]
        });

        continue;

      }


      // ======================
      // 🏆 WINNER MESSAGE
      // ======================

      const winnerMentions =
        winners
          .map(id => `<@${id}>`)
          .join(", ");


      const embed =
        new EmbedBuilder()

          .setColor(
            config.COLORS.PRIMARY
          )

          .setTitle(
            "🎉 Giveaway Ended!"
          )

          .setDescription(

            `🎁 **Prize:** ${giveaway.prize}\n\n` +

            `🏆 **Winner${winners.length > 1 ? "s" : ""}:** ` +
            winnerMentions

          )

          .setFooter({

            text:
              config.BRANDING.FOOTER,

            iconURL:
              config.BRANDING.ICON

          })

          .setTimestamp();


      await channel.send({

        content:
          winnerMentions,

        embeds: [embed]

      });


    } catch (error) {

      console.error(
        "❌ Giveaway ending error:",
        error
      );

    }

  }


  if (changed) {
    saveGiveaways(giveaways);
  }

}


// ======================
// ⚡ EVENT
// ======================

module.exports = {

  name: "clientReady",

  once: false,

  execute(client) {

    console.log(
      "🎉 Giveaway system started."
    );


    // Check every 10 seconds

    checkGiveaways(client);


    setInterval(() => {

      checkGiveaways(client);

    }, 10000);

  }

};
