const { MessageEmbed } = require('discord.js');
const { sendMsg, createBar } = require('../../handlers/functions');
const ee = require('../../botconfig/embed.json');

module.exports = {
    name: 'nowplaying',
    aliases: ['np', 'current', 'track'],
    category: 'Music',
    usage: 'nowplaying',
    cooldown: 4,
    description: 'Shows the current Track information',
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

            let queue = client.distube.getQueue(message);
            let track = queue.songs[0];

            message.channel
                .send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(ee.color)
                            .setTitle(
                                `Now playing :notes: ${track.name}`.substr(
                                    0,
                                    256
                                )
                            )
                            .setURL(track.url)
                            .setThumbnail(track.thumbnail)
                            .addField(
                                'Dislikes',
                                `:thumbsdown: ${track.dislikes}`,
                                true
                            )
                            .addField(
                                'Likes',
                                `:thumbsup: ${track.likes}`,
                                true
                            )
                            .addField('Views', `▶ ${track.views}`, true)
                            .addField(
                                'Duration: ',
                                createBar(queue.currentTime, track.duration)
                            ),
                    ],
                })
                .then((sent) => {
                    setTimeout(() => {
                        sent.delete();
                    }, 10000);
                });
        } catch (err) {
            console.error(err);
            return sendMsg(
                message,
                'Oops, got myself an error while trying to show the current track',
                '❌ Error'
            );
        }
    },
};
