const { sendMsg, format } = require('../../handlers/functions');

module.exports = {
    name: 'shuffle',
    cooldown: 4,
    category: 'Music',
    usage: 'shuffle',
    description: 'Shuffles the queue to play songs in random order',
    run: async (client, message, args) => {
        try {
            const { channel } = message.member.voice;

            // If user is not in a channel
            if (!channel)
                return sendMsg(
                    message,
                    'Please join a voice channel first',
                    '❌ Error'
                );
            // if the queue is empty
            if (!client.distube.getQueue(message))
                return sendMsg(
                    message,
                    'The Queue is empty!',
                    '❌ Queue Empty'
                );

            // if distube is playing in another channel but in same guild
            // check if channelID is not the same as member id that requested for the bot
            // the bot will not leave their channel to join someone else
            if (
                client.distube.getQueue(message) &&
                channel.id !== message.guild.me.voice.channel.id
            )
                return sendMsg(
                    message,
                    `Please join my channel: <#${message.guild.me.voice.channel.id}> to use my features!`,
                    '❌ Oops! Currently in use!',
                    true
                );

            client.distube.shuffle(message);

            sendMsg(message, `Shuffled the Queue`, '🔀 Shuffled!');
        } catch (err) {
            console.error(err);
            return sendMsg(
                message,
                'Oops, got myself an error while trying to pause',
                '❌ Error'
            );
        }
    },
};
