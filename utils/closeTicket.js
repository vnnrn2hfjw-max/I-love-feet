module.exports = async function claimButton(interaction) {

    console.log("=== CLAIM BUTTON START ===");

    try {

        await interaction.deferReply({
            ephemeral: true
        });

        console.log("Interaction deferred.");

        const allowedRoles = [
            "1502708624487616684",
            "1502707190358605884",
            "1526243744289128528"
        ];

        const allowed = interaction.member.roles.cache.some(role =>
            allowedRoles.includes(role.id)
        );

        console.log("Has permission:", allowed);

        if (!allowed) {
            return interaction.editReply({
                content: "❌ You don't have permission to claim tickets."
            });
        }

        const topic = interaction.channel.topic || "";

        console.log("Current topic:", topic);

        if (topic.includes("CLAIMED BY")) {
            return interaction.editReply({
                content: "❌ This ticket has already been claimed."
            });
        }

        await interaction.channel.setTopic(
            `CLAIMED BY ${interaction.user.id}`
        );

        console.log("Topic updated.");

        return interaction.editReply({
            content: `🟢 Ticket claimed by ${interaction.user}.`
        });

    } catch (err) {

        console.error("CLAIM BUTTON ERROR:");
        console.error(err);

        try {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: "❌ Failed to claim ticket.",
                    ephemeral: true
                });
            } else {
                await interaction.editReply({
                    content: "❌ Failed to claim ticket."
                });
            }
        } catch {}

    }

};
