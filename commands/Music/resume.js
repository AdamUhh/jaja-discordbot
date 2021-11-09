const { sendMsg } = require('../../handlers/functions');
const { delay } = require('../../handlers/functions');

module.exports = {
    name: 'resume',
    aliases: ['r', 'unpause'],
    category: 'Music',
    usage: 'resume',
    cooldown: 4,
    description: 'Resumes the song',
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

            client.distube.resume(message);
            //the below lines with the delay fixes the bug where it doesnt resume by repausing and reresuming ;)
            await delay(100);
            client.distube.pause(message);
            await delay(100);
            client.distube.resume(message);

            sendMsg(message, 'Resumed the song!', '▶ Resumed!');
        } catch (err) {
            console.error(err);
            if (err.errorCode === 'PAUSED') {
                return sendMsg(
                    message,
                    'The queue is already playing!',
                    '❌ Already Playing'
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
