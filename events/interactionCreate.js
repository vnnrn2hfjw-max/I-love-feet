
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(
  __dirname,
  "..",
  "Data",
  "giveaways.json"
);


// ======================
// 📂 GIVEAWAY DATA
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
// ⚡ INTERACTIONS
// ======================

module.exports = {

  name: "interactionCreate",

  async execute(interaction, client) {


    // ======================
    // 💻 SLASH COMMANDS
    // ======================

    if (interaction.isChatInputCommand()) {

      const command =
        client.commands.get(
          interaction.commandName
        );


      if (!command) {

        return interaction.reply({

          content:
            "❌ This command could not be found.",

          ephemeral: true

        });

      }


      try {

        await command.execute(
          interaction,
          client
        );

      } catch (error) {

        console.error(
          `❌ Error in /${interaction.commandName}:`,
          error
        );


        if (interaction.replied ||
            interaction.deferred) {

          await interaction.followUp({

            content:
              "❌ An error occurred while running this command.",

            ephemeral: true

          });

        } else {

          await interaction.reply({

            content:
              "❌ An error occurred while running this command.",

            ephemeral: true

          });

        }

      }

      return;

    }


    // ======================
    // 🎉 GIVEAWAY BUTTON
    // ======================

    if (
      interaction.isButton() &&
      interaction.customId.startsWith(
        "giveaway_enter_"
      )
    ) {

      const giveawayId =
        interaction.customId.replace(
          "giveaway_enter_",
          ""
        );


      const giveaways =
        loadGiveaways();


      const giveaway =
        giveaways.find(
          giveaway =>
            giveaway.id === giveawayId
        );


      if (!giveaway) {

        return interaction.reply({

          content:
            "❌ This giveaway no longer exists.",

          ephemeral: true

        });

      }


      if (giveaway.ended) {

        return interaction.reply({

          content:
            "❌ This giveaway has already ended.",

          ephemeral: true

        });

      }


      if (
        Date.now() >= giveaway.end
      ) {

        return interaction.reply({

          content:
            "❌ This giveaway has ended.",

          ephemeral: true

        });

      }


      if (
        giveaway.entries.includes(
          interaction.user.id
        )
      ) {

        return interaction.reply({

          content:
            "⚠️ You are already entered in this giveaway.",

          ephemeral: true

        });

      }


      giveaway.entries.push(
        interaction.user.id
      );


      saveGiveaways(giveaways);


      await interaction.reply({

        content:
          "🎉 You have entered the giveaway!",

        ephemeral: true

      });


      // ======================
      // 🔄 UPDATE GIVEAWAY
      // ======================

      try {

        const message =
          await interaction.channel.messages
            .fetch(giveaway.messageId);


        const embed =
          message.embeds[0];


        if (embed) {

          const updatedEmbed = {

            ...embed.data,

            description:
              embed.description
                .replace(
                  /👥 \*\*Entries:\*\* \d+/,
                  `👥 **Entries:** ${giveaway.entries.length}`
                )

          };


          await message.edit({

            embeds: [updatedEmbed],

            components:
              message.components

          });

        }

      } catch (error) {

        console.error(
          "❌ Could not update giveaway:",
          error
        );

      }

    }

  }

};
