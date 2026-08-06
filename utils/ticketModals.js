const {
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    getChannelName,
    hasOpenTicket,
    addOpenTicket
} = require("./ticketCounter");


const CATEGORY_ID = "1502731974513786961";


const ROLES = {

    STAFF: "1502708624487616684",
    OWNER: "1502707190358605884",
    FOUNDER: "1526243744289128528",
    TRUSTED: "1502723065795051693"

};



const TYPES = {

    buyer: {
        name: "Buyer Ticket",
        emoji: "💰",
        role: ROLES.TRUSTED
    },

    support: {
        name: "Support Ticket",
        emoji: "🛠️",
        role: ROLES.STAFF
    },

    join: {
        name: "Join NSC",
        emoji: "🪖",
        role: ROLES.STAFF
    },

    alliance: {
        name: "Alliance Ticket",
        emoji: "🤝",
        role: ROLES.STAFF
    },

    report: {
        name: "Report Ticket",
        emoji: "🚨",
        role: ROLES.STAFF
    }

};



async function createTicket(interaction, type) {


    const ticket =
        TYPES[type];


    if (!ticket) {

        throw new Error(
            "Invalid ticket type"
        );

    }



    if (
        hasOpenTicket(
            interaction.user.id,
            type
        )
    ) {

        return false;

    }



    let info =
    "No information provided.";



    if (
        interaction.fields
    ) {

        info =
        [...interaction.fields.fields.values()]
        .map(
            x
