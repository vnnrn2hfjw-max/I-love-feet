const fs = require("fs");
const path = require("path");


const filePath = path.join(
    __dirname,
    "tickets.json"
);



function loadTickets() {

    if (!fs.existsSync(filePath)) {

        fs.writeFileSync(
            filePath,
            JSON.stringify(
                {
                    counter: 0,
                    tickets: []
                },
                null,
                4
            )
        );

    }


    return JSON.parse(
        fs.readFileSync(
            filePath,
            "utf8"
        )
    );

}



function saveTickets(data) {

    fs.writeFileSync(
        filePath,
        JSON.stringify(
            data,
            null,
            4
        )
    );

}



function getChannelName(type) {

    const data =
        loadTickets();


    data.counter++;


    saveTickets(data);


    return `${type}-${String(data.counter).padStart(4, "0")}`;

}



function hasOpenTicket(userId, type) {

    const data =
        loadTickets();


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

    const data =
        loadTickets();


    data.tickets.push({

        userId,
        channelId,
        type,
        createdAt: Date.now()

    });


    saveTickets(data);

}



function removeOpenTicket(channelId) {

    const data =
        loadTickets();


    data.tickets =
        data.tickets.filter(
            ticket =>
            ticket.channelId !== channelId
        );


    saveTickets(data);

}



function getTicket(channelId) {

    const data =
        loadTickets();


    return data.tickets.find(
        ticket =>
        ticket.channelId === channelId
    );

}



module.exports = {

    getChannelName,
    hasOpenTicket,
    addOpenTicket,
    removeOpenTicket,
    getTicket

};
