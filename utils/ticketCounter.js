const fs = require("fs");
const path = require("path");


const file =
path.join(
    __dirname,
    "tickets.json"
);



function load() {

    if (!fs.existsSync(file)) {

        fs.writeFileSync(
            file,
            JSON.stringify({
                counter: 0,
                tickets: []
            }, null, 4)
        );

    }


    return JSON.parse(
        fs.readFileSync(
            file,
            "utf8"
        )
    );

}



function save(data) {

    fs.writeFileSync(
        file,
        JSON.stringify(
            data,
            null,
            4
        )
    );

}



function getChannelName(type) {

    const data = load();

    data.counter++;

    save(data);

    return `${type}-${data.counter}`;

}



function hasOpenTicket(userId, type) {

    const data = load();

    return data.tickets.some(
        ticket =>
        ticket.userId === userId &&
        ticket.type === type
    );

}



function addOpenTicket(
    userId,
    channelId,
    type
) {

    const data = load();


    data.tickets.push({

        userId,
        channelId,
        type

    });


    save(data);

}



module.exports = {
    getChannelName,
    hasOpenTicket,
    addOpenTicket
};
