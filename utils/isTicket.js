const {
    getTicket
} = require("./ticketCounter");


function isTicket(channelId) {

    const ticket =
        getTicket(channelId);


    return ticket || false;

}



module.exports = {
    isTicket
};
