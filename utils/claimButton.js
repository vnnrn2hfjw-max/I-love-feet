module.exports = async function claimButton(interaction) {

    await interaction.deferReply({
        ephemeral: true
    });

    try {

        const allowedRoles = [
            "1502708624487616684",
            "1502707190358605884",
            "1526243744289128528"
        ];

        const allowed = interaction.member.roles.cache.some(role =>
            allowedRoles.includes(role.id)
        );

        if (!allowed) {
            return interaction.editReply({
                content: "❌ You cannot claim tickets."
            });
        }

        await interaction.channel.setTopic(
            `CLAIMED BY ${interaction.user.id}`
        );

        await interaction.channel.send({
            content: `🟢 **This ticket has been claimed by ${interaction.user}.**`
        });

        return interaction.editReply({
            content: "✅ Ticket claimed successfully."
        });

    } catch (error) {

        console.error("CLAIM BUTTON ERROR:", error);

        return interaction.editReply({
            content: `❌ Failed to claim the ticket.\n\`\`\`\n${error.message}\n\`\`\``
        });

    }

};
