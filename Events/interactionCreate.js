// ======================
// 📦 IMPORTS
// ======================

module.exports = {

  name: "interactionCreate",


  async execute(interaction, client) {


    // ======================
    // 💬 SLASH COMMANDS
    // ======================

    if (interaction.isChatInputCommand()) {


      const command = client.commands.get(
        interaction.commandName
      );


      if (!command) {

        return interaction.reply({

          content: "❌ Command not found.",

          ephemeral: true

        });

      }


      try {


        await command.execute(
          interaction,
          client
        );


      } catch(error) {


        console.error(
          error
        );


        if (interaction.replied || interaction.deferred) {

          await interaction.followUp({

            content:
            "❌ Something went wrong.",

            ephemeral:true

          });


        } else {


          await interaction.reply({

            content:
            "❌ Something went wrong.",

            ephemeral:true

          });


        }


      }


    }



    // ======================
    // 🔘 BUTTON HANDLER
    // ======================

    if (interaction.isButton()) {


      const ticket = require(
        "../commands/ticket"
      );


      if (ticket.buttonHandler) {

        return ticket.buttonHandler(
          interaction,
          client
        );

      }


    }



    // ======================
    // 📋 SELECT MENU HANDLER
    // ======================

    if (interaction.isAnySelectMenu()) {


      const ticket = require(
        "../commands/ticket"
      );


      if (ticket.menuHandler) {

        return ticket.menuHandler(
          interaction,
          client
        );

      }


    }



    // ======================
    // 📝 MODAL HANDLER
    // ======================

    if (interaction.isModalSubmit()) {


      const staffPunish = require(
        "../commands/staffpunish"
      );


      if (staffPunish.modalHandler) {

        return staffPunish.modalHandler(
          interaction,
          client
        );

      }


    }


  }

};
