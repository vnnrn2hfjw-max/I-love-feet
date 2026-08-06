const fs = require("fs");
const path = require("path");


async function createTranscript(
    channel,
    extraData = {}
) {

    const messages = await channel.messages.fetch({
        limit: 100
    });


    const sortedMessages =
        [...messages.values()]
        .sort(
            (a, b) =>
            a.createdTimestamp -
            b.createdTimestamp
        );


    let transcript = "";


    transcript += `
================================

NSC | NO SECOND CHANCES
TICKET TRANSCRIPT

================================

Ticket:
${channel.name}

Created:
${new Date(
    channel.createdTimestamp
).toLocaleString()}

Closed:
${new Date().toLocaleString()}

Opened By:
${extraData.openedBy || "Unknown"}

Claimed By:
${extraData.claimedBy || "Nobody"}

Closed By:
${extraData.closedBy || "Unknown"}

Close Reason:
${extraData.reason || "No reason provided"}

================================


`;



    for (const message of sortedMessages) {


        transcript += `
--------------------------------

User:
${message.author.tag}

ID:
${message.author.id}

Time:
${new Date(
    message.createdTimestamp
).toLocaleString()}


Message:

${message.content || "[No message content]"}

`;


        if (message.attachments.size > 0) {

            transcript += `

Attachments:

`;

            message.attachments.forEach(file => {

                transcript +=
`${file.url}

`;

            });

        }


        if (message.embeds.length > 0) {

            transcript += `

Embeds:

`;

            message.embeds.forEach(embed => {

                if (embed.title) {

                    transcript +=
`Title: ${embed.title}
`;

                }


                if (embed.description) {

                    transcript +=
`Description:
${embed.description}

`;

                }

            });

        }


        transcript +=
`
--------------------------------

`;

    }



    const folder =
        path.join(
            __dirname,
            "..",
            "transcripts"
        );


    if (!fs.existsSync(folder)) {

        fs.mkdirSync(folder, {
            recursive: true
        });

    }



    const filePath =
        path.join(
            folder,
            `${channel.name}.txt`
        );



    fs.writeFileSync(
        filePath,
        transcript
    );


    return filePath;

}



module.exports = {
    createTranscript
};
