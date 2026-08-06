module.exports = async function claimButton(interaction) {


    const allowedRoles = [
        "1502708624487616684",
        "1502707190358605884",
        "1526243744289128528"
    ];


    const allowed =
    interaction.member.roles.cache.some(
        role =>
        allowedRoles.includes(role.id)
    );


    if (!allowed) {

        return interaction.reply({

            content:
            "❌ You cannot claim tickets.",

            ephemeral:true

        });

    }



    await interaction.channel.setTopic(
        `CLAIMED BY ${interaction.user.id}`
    );


    return interaction.reply({

        content:
        `🟢 Ticket claimed by ${interaction.user}`

    });


};
