const { sendMsg, format } = require('../../handlers/functions');

module.exports = {
    name: 'rewind',
    aliases: ['rw', 'iamflash', 'goback'],
    category: 'Music',
    usage: 'rewind <Number of seconds>',
    cooldown: 4,
    description: 'Rewinds the song in seconds',
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

            if (!args[0])
                return sendMsg(
                    message,
                    `You didnt provide a time (seconds) that you want to seek to! - Usage: \`${process.env.PREFIX}seek 10\``,
                    '❌ Syntax Error'
                );

            if (isNaN(args[0]))
                return sendMsg(
                    message,
                    `The value you entered is not a numeric character! - Usage: \`${process.env.PREFIX}seek 10\``,
                    '❌ Syntax Error'
                );

            let queue = client.distube.getQueue(message);
            let seektime = queue.currentTime - Number(args[0]);
            if (seektime < 0) seektime = 0;
            if (seektime >= queue.songs[0].duration - queue.currentTime)
                seektime = 0;

            client.distube.seek(message, seektime);

            sendMsg(
                message,
                `Rewinded \`${args[0]} Seconds\` to: ${format(
                    seektime * 1000
                )}`,
                '⏩ Rewinded!'
            );
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
