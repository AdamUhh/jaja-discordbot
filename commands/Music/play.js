// const { getTracks, getPreview } = require('spotify-url-info');
const { sendMsg } = require('../../handlers/functions');

module.exports = {
    name: 'play',
    aliases: ['p', 'playsong', 'playtrack'],
    category: 'Music',
    usage: 'play <URL / Name of YouTube Video / SpotifyURL>',
    cooldown: 4,
    description: 'Plays a song from youtube',
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

            // if no search term was provided
            if (!args[0])
                return sendMsg(
                    message,
                    `Usage: \`${process.env.PREFIX}play <URL / TITLE>\``,
                    "❌ Error | You didn't provide any searchterm"
                );

            sendMsg(
                message,
                `\`\`\`fix\n${args.join(' ')}\n\`\`\``,
                'Searching...',
                true
            );

            //https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas
            // if (
            //     args.join(' ').toLowerCase().includes('spotify') &&
            //     args.join(' ').toLowerCase().includes('track')
            // ) {
            //     getPreview(args.join(' ')).then((result) => {
            //         client.distube.play(message, result.title);
            //     });
            // } else if (
            //     args.join(' ').toLowerCase().includes('spotify') &&
            //     args.join(' ').toLowerCase().includes('playlist')
            // ) {
            //     getTracks(args.join(' ')).then((result) => {
            //         for (const song of result)
            //             client.distube.play(message, song.name);
            //     });
            // } else {
            //     client.distube.play(message, args.join(' '));
            // }
            client.distube.play(message, args.join(' '));
        } catch (err) {
            console.error(err);
            return sendMsg(
                message,
                'Oops, got myself an error while trying to play',
                '❌ Error'
            );
        }
    },
};
