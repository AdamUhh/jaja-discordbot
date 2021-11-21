const { sendMsg } = require('../../handlers/functions');

module.exports = {
    name: 'skip',
    aliases: ['s'],
    category: 'Music',
    usage: 'skip',
    cooldown: 4,
    description: 'Skips a track',
    run: async (client, message, args) => {
        try {
            const { channel } = message.member.voice;
            const queue = client.distube.getQueue(message);
            // If user is not in a channel
            if (!channel)
                return sendMsg(
                    message,
                    'Please join a voice channel first',
                    '❌ Error'
                );
            // if the queue is empty
            if (!queue)
                return sendMsg(
                    message,
                    'The Queue is empty!',
                    '❌ Queue Empty'
                );

            // if distube is playing in another channel but in same guild
            // check if channelID is not the same as member id that requested for the bot
            // the bot will not leave their channel to join someone else
            if (queue && channel.id !== message.guild.me.voice.channel.id)
                return sendMsg(
                    message,
                    `Please join my channel: <#${message.guild.me.voice.channel.id}> to use my features!`,
                    '❌ Oops! Currently in use!',
                    true
                );
            if (!queue.autoplay && queue.songs.length <= 1) {
                sendMsg(
                    message,
                    'No other tracks found, stopping instead of skipping!',
                    '⏭ Stopped!'
                );

                return client.distube.stop(message);
            }

            sendMsg(message, 'Skipped the Current Track', '⏭ Skipped!');

            client.distube.skip(message);
        } catch (err) {
            console.error(err);
            return sendMsg(
                message,
                'Oops, got myself an error while trying to skip',
                '❌ Error'
            );
        }
    },
};
