const { sendMsg } = require('../../handlers/functions');
module.exports = {
    name: 'pause',
    category: 'Music',
    usage: 'pause',
    cooldown: 4,
    description: 'Pauses a track',
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

            client.distube.pause(message);

            sendMsg(message, 'Paused the song!', '⏸ Paused!', true);
        } catch (err) {
            console.error(err);
            if (err.errorCode === 'PAUSED') {
                return sendMsg(
                    message,
                    'The queue has already been paused!',
                    '❌ Already Paused'
                );
            }
            return sendMsg(
                message,
                'Oops, got myself an error while trying to pause',
                '❌ Error'
            );
        }
    },
};
