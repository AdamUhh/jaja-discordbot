const { Collection, Permissions } = require('discord.js');
const { sendMsg, deleteUserMsg } = require('../../handlers/functions');

const validPermissions = [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_INSIGHTS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS',
];

module.exports = async (client, message) => {
    try {
        // if the message does not start with the prefix
        if (!message.content.startsWith(process.env.PREFIX)) return;
        // if the message is not in a guild (aka in dms), return aka ignore the inputs
        if (!message.guild) return;
        // if the message author is a bot, return aka ignore the inputs
        if (message.author.bot) return;
        // if the channel is on partial fetch it
        if (message.channel.partial) await message.channel.fetch();
        // if the message is on partial fetch it
        if (message.partial) await message.fetch();

        const args = message.content
            .slice(process.env.PREFIX.length)
            .trim()
            .split(/ +/);
        const cmd = args.shift().toLowerCase();

        //if no cmd added return error
        if (cmd.length === 0)
            sendMsg(
                message,
                `Unknown command! try: **\`${process.env.PREFIX}help\`**`,
                '❌ Error',
                false
            );

        //get the command from the collection
        //if the command does not exist, try to get it by its alias
        let command =
            client.commands.get(cmd) ||
            client.commands.get(client.aliases.get(cmd));

        // if the command is valid
        if (typeof command !== 'undefined') {
            try {
                // if the file has permissions
                if (command.permissions) {
                    let invalidPerms = [];
                    for (const perm of command.permissions) {
                        // if command.permissions has a wrong permission name
                        if (!validPermissions.includes(perm)) {
                            return console.log(
                                `Invalid Permission: '${perm}' \n - Please check the file ${command.name}.js`
                            );
                        }
                        // if user does not have permission
                        if (
                            !message.member.permissions.has(
                                Permissions.FLAGS[perm]
                            )
                        ) {
                            invalidPerms.push(perm);
                        }
                    }
                    if (invalidPerms.length) {
                        // tell user about their missing permission
                        return sendMsg(
                            message,
                            `Missing Permissions: \`${invalidPerms.join(
                                ', '
                            )}\``,
                            'Error'
                        );
                    }
                }
            } catch (err) {
                console.error(err);
            }
            try {
                //if its not in the cooldown, set it too there
                if (!client.cooldowns.has(command.name)) {
                    client.cooldowns.set(command.name, new Collection());
                }
                const currentTime = Date.now(); //get the current time
                const timestamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
                //get the cooldownamount of the command, if there is no cooldown there will be a default 1 sec cooldown, so you cannot spam it
                const cooldownAmount = (command.cooldown || 1.5) * 1000;

                //if the user is on cooldown
                if (timestamps.has(message.author.id)) {
                    //if the user is on cooldown
                    const expirationTime =
                        timestamps.get(message.author.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
                    //if he is still on cooldown
                    if (currentTime < expirationTime) {
                        //get the time left until the user can retype/execute the command
                        const timeLeft = (expirationTime - currentTime) / 1000;

                        // If on cooldown, automatically delete users command msg to not cause problems with code
                        deleteUserMsg(message);

                        // tell user about their cooldown time
                        return sendMsg(
                            message,
                            `❌ Please wait ${timeLeft.toFixed(
                                1
                            )} more second(s) before reusing the \`${
                                command.name
                            }\` command.`,
                            'Woah there'
                        );
                    }
                }
                //if he is not on cooldown, set it to the cooldown
                timestamps.set(message.author.id, currentTime);
                setTimeout(
                    () => timestamps.delete(message.author.id),
                    cooldownAmount
                ); //set a timeout function with the cooldown, so it gets deleted later on again

                try {
                    command.run(client, message, args);
                } catch (err) {
                    console.error(err);
                    return sendMsg(
                        message,
                        '❌ There was an error trying to execute this command!',
                        'Error'
                    );
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            //if the command is not found send an info msg
            return sendMsg(message, '❌ Unknown Command!', 'Error');
        }
    } catch (err) {
        console.log('problem with everything')
        console.error(err);
    }
};
