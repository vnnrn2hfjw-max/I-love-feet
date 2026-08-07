const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const { createTranscript } = require("./transcript");

module.exports = async function closeTicket(interaction, modal = false) {

    // Show the close modal
    if (!modal) {

        const reasonInput = new TextInputBuilder()
            .setCustomId("reason")
            .setLabel("Reason for closing")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const modalBuilder = new ModalBuilder()
            .setCustomId("close_ticket_modal")
            .setTitle("Close Ticket")
            .addComponents(
                new ActionRowBuilder().addComponents(reasonInput)
            );

        return interaction.showModal(modalBuilder);
    }

    // User submitted the modal
    try {

        const reason = interaction.fields.getTextInputValue("reason");

        const transcript = await createTranscript(interaction.channel);

        await interaction.channel.send({
            content:
                `🔒 **Ticket Closed**\n\n` +
                `**Closed by:** ${interaction.user}\n` +
                `**Reason:** ${reason}`,
            files: [transcript]
        });

        await interaction.editReply({
            content: "✅ Ticket will be deleted in 5 seconds..."
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
        }

    }

};
