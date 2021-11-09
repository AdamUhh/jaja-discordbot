const { readdirSync } = require('fs');

module.exports = async (client) => {
    try {
        const loadDir = (dirs) => {
            const eventFiles = readdirSync(`./events/${dirs}`).filter((file) =>
                file.endsWith('.js')
            );

            for (let file of eventFiles) {
                const event = require(`../events/${dirs}/${file}`);
                const eventName = file.split('.')[0];
                client.on(eventName, event.bind(null, client));
            }
        };

        await ['client', 'guild'].forEach((dir) => loadDir(dir));
    } catch (err) {
        console.error(err);
    }
};
