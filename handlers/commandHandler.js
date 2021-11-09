const { readdirSync } = require('fs');

module.exports = (client) => {
    try {
        readdirSync('./commands/').forEach((dir) => {
            const commandFiles = readdirSync(`./commands/${dir}/`).filter(
                (file) => file.endsWith('.js')
            );
            for (let file of commandFiles) {
                let command = require(`../commands/${dir}/${file}`);

                if (command.name) client.commands.set(command.name, command);

                if (command.aliases && Array.isArray(command.aliases))
                    command.aliases.forEach((alias) =>
                        client.aliases.set(alias, command.name)
                    );
            }
        });
        // // Filters out any other files that are not .js, such as .png
        // const commandFiles = fs
        //     .readdirSync('./commands/')
        //     .filter((file) => file.endsWith('.js'));

        // // For each file in the folder ./commands/
        // for (let file of commandFiles) {
        //     // assign the contents of the file to the command variable
        //     const command = require(`../commands/${file}`);
        //     // if a command.name is present, put it inside of the commands collection
        //     if (command.name) client.commands.set(command.name, command);
        //     // if a command.aliases is present and in the form of an array
        //     // assign the files name(command.name) to the aliases collection with the alias as the key
        //     if (command.aliases && Array.isArray(command.aliases))
        //         command.aliases.forEach((alias) =>
        //             client.aliases.set(alias, command.name)
        //         );
        // }
    } catch (err) {
        console.error(err);
    }
};
