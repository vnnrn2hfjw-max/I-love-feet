const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const {
    createTranscript
} = require("./transcript");

module.exports = async function closeTicket(interaction, modal = false) {

    if (!modal) {

        const reason = new TextInputBuilder()
            .setCustomId("reason")
            .setLabel("Close reason")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const form = new ModalBuilder()
            .setCustomId("close_ticket_modal")
            .setTitle("Close Ticket")
            .addComponents(
                new ActionRowBuilder().addComponents(reason)
            );

        return interaction.showModal(form);
    }

    try {

        const transcript = await createTranscript(interaction.channel);

        await interaction.channel.send({
            content: `🔒 Ticket closed by ${interaction.user}.`,
            files: [transcript]
        });

        setTimeout(async () => {
            try {
                await interaction.channel.delete();
            } catch (err) {
                console.error("DELETE CHANNEL ERROR:", err);
            }
        }, 3000);

    } catch (err) {

        console.error("CLOSE TICKET ERROR:", err);

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: `❌ Failed to close ticket.\n\`\`\`\n${err.message}\n\`\`\``,
                ephemeral: true
            }).catch(() => {});
        }

    }

};
