const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const { createTranscript } = require("./transcript");
const fs = require("fs");
const path = require("path");

const ticketsFile = path.join(__dirname, "tickets.json");

module.exports = async function closeTicket(interaction, modal = false) {

    console.log("=== CLOSE BUTTON PRESSED ===");

    // Show modal
    if (!modal) {

        const reason = new TextInputBuilder()
            .setCustomId("reason")
            .setLabel("Reason for closing")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const closeModal = new ModalBuilder()
            .setCustomId("close_ticket_modal")
            .setTitle("Close Ticket")
            .addComponents(
                new ActionRowBuilder().addComponents(reason)
            );

        return interaction.showModal(closeModal);
    }

    await interaction.deferReply({ ephemeral: true });

    try {

        const reason =
            interaction.fields.getTextInputValue("reason");

        const transcript =
            await createTranscript(interaction.channel);

        await interaction.channel.send({
            content:
                `🔒 **Ticket Closed**\n\n` +
                `**Closed by:** ${interaction.user}\n` +
                `**Reason:** ${reason}`,
            files: [transcript]
        });

        // Remove ticket from tickets.json
        if (fs.existsSync(ticketsFile)) {

            const data = JSON.parse(
                fs.readFileSync(ticketsFile, "utf8")
            );

            data.tickets = data.tickets.filter(
                ticket => ticket.channelId !== interaction.channel.id
            );

            fs.writeFileSync(
                ticketsFile,
                JSON.stringify(data, null, 4)
            );
        }

        await interaction.editReply({
            content: "✅ Ticket will be deleted in 5 seconds."
        });

        setTimeout(async () => {

            try {

                await interaction.channel.delete();

            } catch (err) {

                console.error("DELETE ERROR:", err);

            }

        }, 5000);

    } catch (err) {

        console.error("CLOSE ERROR:", err);

        if (!interaction.replied && !interaction.deferred) {

            await interaction.reply({
                content: "❌ Failed to close ticket.",
                ephemeral: true
            }).catch(() => {});

        } else {

            await interaction.editReply({
                content: "❌ Failed to close ticket."
            }).catch(() => {});

        }

    }

};
