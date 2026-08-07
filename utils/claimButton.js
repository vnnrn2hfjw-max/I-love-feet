module.exports = async function claimButton(interaction) {

    const allowedRoles = [
        "1502708624487616684",
        "1502707190358605884",
        "1526243744289128528"
    ];

    const allowed = interaction.member.roles.cache.some(role =>
        allowedRoles.includes(role.id)
    );

    if (!allowed) {
        return interaction.reply({
            content: "❌ You don't have permission to claim tickets.",
            ephemeral: true
        });
    }

    const topic = interaction.channel.topic || "";

    if (topic.includes("CLAIMED BY")) {
        return interaction.reply({
            content: "❌ This ticket has already been claimed.",
            ephemeral: true
        });
    }

    try {

        await interaction.channel.setTopic(
            `CLAIMED BY ${interaction.user.id}`
        );

        await interaction.reply({
            content: `🟢 Ticket claimed by ${interaction.user}.`
        });

    } catch (err) {

        console.error(err);

        if (!interaction.replied) {
            await interaction.reply({
                content: "❌ Failed to claim ticket.",
                ephemeral: true
            }).catch(() => {});
        }

    }

};
