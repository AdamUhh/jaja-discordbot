const { MessageEmbed } = require('discord.js');
const { sendMsg } = require('../../handlers/functions');
const ee = require('../../botconfig/embed.json');

module.exports = {
    name: 'queue',
    aliases: ['q', 'playlist'],
    category: 'Music',
    usage: 'queue',
    cooldown: 4,
    description: 'Shows the queue of videos that are yet to be played',
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
                    'The Queue is empty! Add some songs now -.-',
                    '❌ Queue Empty!'
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

            let embed = new MessageEmbed()
                .setColor(ee.color)
                .setTitle(`Queue for: ${message.guild.name}`);

            let counter = 0;
            for (let i = 0; i < queue.songs.length; i += 20) {
                if (counter >= 10) break;
                let k = queue.songs;
                let songs = k.slice(i, i + 20);
                let desc = '';
                songs.map(
                    (song, index) =>
                        (desc += `**${index + 1 + counter * 20}.** [${
                            song.name
                        }](${song.url}) - \`\`${song.formattedDuration}\`\`\n`)
                );
                message.channel.send({
                    embeds: [embed.setDescription(desc)],
                });
                counter++;
            }
        } catch (err) {
            console.error(err);
            return sendMsg(
                message,
                'Oops, got myself an error while trying to show the current queue',
                '❌ Error'
            );
        }
    },
};
