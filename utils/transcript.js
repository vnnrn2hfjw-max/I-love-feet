const fs = require("fs");
const path = require("path");


async function createTranscript(channel) {

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
NSC | No Second Chances
Ticket Transcript

Channel:
${channel.name}

Created:
${new Date(
    channel.createdTimestamp
).toLocaleString()}

━━━━━━━━━━━━━━━━━━━━

`;


    for (const message of sortedMessages) {

        transcript +=
`${message.author.tag}
${message.content || "[No text]"}

`;

        if (message.attachments.size > 0) {

            transcript +=
`Attachments:
${[...message.attachments.values()]
.map(a => a.url)
.join("\n")}

`;

        }


        transcript +=
"━━━━━━━━━━━━━━━━━━━━\n";

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
