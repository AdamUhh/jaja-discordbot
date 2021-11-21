const { Permissions } = require('discord.js');
const { sendMsg } = require('../../handlers/functions');

const deleteBulkUser = async (message, amount, user) => {
    try {
        let index = 0;
        amount = Number(amount) > 10 ? 10 : Number(amount);
        // if client is the one who issued the command
        amount =
            message.author.id == user.id ? Number(amount) + 1 : Number(amount);

        await message.channel.messages
            .fetch({ limit: 100 })
            .then((collected) => {
                collected.forEach((_msg) => {
                    if (_msg.author.id == user.id && index != amount) {
                        _msg.delete();
                        index++;
                    }
                });
            })
            .then(() => {
                return sendMsg(
                    message,
                    `Bot cleared \`${
                        message.author.id == user.id ? index - 1 : index
                    } ${message.author.id === user.id ? '(+1)' : ''}\`${
                        amount - 1 > 1
                            ? 'messages'
                            : index === 0
                            ? 'messages'
                            : 'message'
                    } that belonged to \`${user.username}\` :broom: `,
                    '✅ Cleared!'
                );
            });
    } catch (err) {
        console.error(err);
        return sendMsg(message, 'Something broke', 'Error');
    }
};

const deleteBulk = async (message, amount) => {
    try {
        await message.channel
            .bulkDelete(Number(amount) >= 100 ? 100 : Number(amount) + 1)
            .then((_msg) => {
                return sendMsg(
                    message,
                    `Bot cleared \`${_msg.size}\` messages :broom: `,
                    '✅ Cleared!'
                );
            });
    } catch (err) {
        console.error('Problem with trying to delete the channels messages');
        console.error(err);
        return sendMsg(message, 'Something broke', 'Error');
    }
};

module.exports = {
    name: 'clear',
    aliases: ['c', 'cls', 'sweep'],
    category: 'Administration',
    usage: 'clear <Number of msgs to clear> [@user]',
    description: 'Clears messages!',
    cooldown: 4,
    permissions: ['ADMINISTRATOR', 'BAN_MEMBERS'],
    run: async (client, message, args) => {
        try {
            // If user has permission
            if (
                !message.member.permissions.has(
                    Permissions.FLAGS.MANAGE_MESSAGES
                )
            )
                return sendMsg(
                    message,
                    "You cant use this command since you're missing ` manage_messages ` perm",
                    '❌ No Permission'
                );

            const user = message.mentions.users.first();
            const formatUserId = user && `<@!${user.id}>`;

            if (typeof args[0] === 'undefined') {
                sendMsg(
                    message,
                    'No argument given! Automatically clearing 1 message',
                    '⚠ Warning'
                );
                return deleteBulk(message, 1);
            }

            // If first arg is not a number
            if (isNaN(args[0]))
                return sendMsg(
                    message,
                    'Please enter a real number in the first argument',
                    '❌ Invalid Syntax'
                );

            // If first arg is lower than 1
            if (args[0] < 1)
                return sendMsg(
                    message,
                    'You must delete atleast one message!',
                    '❌ Invalid Syntax'
                );

            // If second arg is present but is not a user
            if (typeof args[1] !== 'undefined' && args[1] !== formatUserId) {
                return sendMsg(
                    message,
                    'Please provide a real user in the second argument',
                    '❌ Invalid Syntax'
                );
            }

            // If first arg is greater than 100 and there is no user
            if (typeof args[1] === 'undefined') {
                if (args[0] > 100)
                    sendMsg(
                        message,
                        'Max clear value is 100 messages. Automatically deleting max messages',
                        '⚠ Warning'
                    );
                return deleteBulk(message, args[0]);
            }
            // If second arg is present and there is a user, but the first arg is too big
            if (typeof args[1] !== 'undefined' && args[1] === formatUserId) {
                if (args[0] > 10)
                    sendMsg(
                        message,
                        'Max clear values for specified user messages is 10 messages. Automatically deleting max messages'
                    );
                return deleteBulkUser(message, args[0], user);
            }
        } catch (err) {
            console.error('Error clearing\n' + err);
        }
    },
};
