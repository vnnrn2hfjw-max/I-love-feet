const fs = require("fs");
const path = require("path");

const dataFolder = path.join(__dirname, "..", "data");
const dataFile = path.join(dataFolder, "tickets.json");

function ensureFile() {
    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder, { recursive: true });
    }

    if (!fs.existsSync(dataFile)) {
        fs.writeFileSync(
            dataFile,
            JSON.stringify(
                {
                    counter: 0,
                    openTickets: []
                },
                null,
                4
            )
        );
    }
}

function loadData() {
    ensureFile();

    try {
        return JSON.parse(fs.readFileSync(dataFile, "utf8"));
    } catch {
        return {
            counter: 0,
            openTickets: []
        };
    }
}

function saveData(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 4));
}

function nextTicketNumber() {
    const data = loadData();

    data.counter++;

    saveData(data);

    return data.counter.toString().padStart(4, "0");
}

function getChannelName(type) {
    const number = nextTicketNumber();

    switch (type) {
        case "buyer":
            return `buyer-${number}`;

        case "support":
            return `support-${number}`;

        case "join":
            return `join-${number}`;

        case "alliance":
            return `alliance-${number}`;

        case "report":
            return `report-${number}`;

        default:
            return `ticket-${number}`;
    }
}

function hasOpenTicket(userId, type) {
    const data = loadData();

    return data.openTickets.some(
        ticket =>
            ticket.userId === userId &&
            ticket.type === type
    );
}

function addOpenTicket(userId, channelId, type) {
    const data = loadData();

    data.openTickets.push({
        userId,
        channelId,
        type,
        createdAt: Date.now()
    });

    saveData(data);
}

function removeOpenTicket(channelId) {
    const data = loadData();

    data.openTickets = data.openTickets.filter(
        ticket => ticket.channelId !== channelId
    );

    saveData(data);
}

function getTicket(channelId) {
    const data = loadData();

    return data.openTickets.find(
        ticket => ticket.channelId === channelId
    );
}

module.exports = {
    getChannelName,
    hasOpenTicket,
    addOpenTicket,
    removeOpenTicket,
    getTicket
};
