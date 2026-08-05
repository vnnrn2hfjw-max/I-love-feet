// ======================
// 📄 TRANSCRIPT SYSTEM
// ======================

const fs = require("fs");


async function createTranscript(channel){


const messages = await channel.messages.fetch({

limit: 100

});


const sorted = [...messages.values()]

.sort(

(a,b) =>

a.createdTimestamp -
b.createdTimestamp

);



let transcript =

`NSC Ticket Transcript

Channel:
${channel.name}

Created:
${new Date().toLocaleString()}

━━━━━━━━━━━━━━

`;



for(const msg of sorted){


transcript +=

`[${new Date(msg.createdTimestamp).toLocaleString()}]

${msg.author.tag}:

${msg.content || "[Embed/Attachment]"}


━━━━━━━━━━━━━━

`;

}



const file =

`./${channel.name}-transcript.txt`;



fs.writeFileSync(

file,

transcript

);



return file;


}



module.exports = {

createTranscript

};
