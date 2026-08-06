module.exports = {
    name: "clientReady",
    once: true,

    execute(client) {
        console.log(`
=====================================
🔥 NSC BOT V2 IS ONLINE
👑 Logged in as: ${client.user.tag}
📡 Commands Loaded: ${client.commands.size}
=====================================
`);
    }
};
