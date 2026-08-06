const {
    AttachmentBuilder
} = require("discord.js");


async function createTranscript(channel) {

    const messages =
        await channel.messages.fetch({
            limit: 100
        });


    const sorted =
        messages
        .sort(
            (a,b) =>
            a.createdTimestamp -
            b.createdTimestamp
        );


    let text =
    `Transcript: ${channel.name}\n\n`;


    for (const message of sorted.values()) {

        text +=
        `${message.author.tag}: ${message.content}\n`;

    }


    const buffer =
        Buffer.from(text, "utf-8");


    return new AttachmentBuilder(
        buffer,
        {
            name:
            `${channel.name}-transcript.txt`
        }
    );

}


module.exports = {
    createTranscript
};
