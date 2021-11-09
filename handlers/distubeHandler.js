const { format, sendMsg } = require('../handlers/functions');
const { DisTube } = require('distube');
const { MessageEmbed } = require('discord.js');
const ee = require('../botconfig/embed.json');
const { SpotifyPlugin } = require('@distube/spotify');

module.exports = async (client) => {
    client.distube = new DisTube(client, {
        searchSongs: 10,
        emitNewSongOnly: false,
        leaveOnEmpty: true,
        leaveOnFinish: true,
        leaveOnStop: true,
        youtubeDL: true,
        updateYouTubeDL: true,
        customFilters: {
            clear: 'dynaudnorm=f=200',
            lowbass: 'bass=g=6,dynaudnorm=f=200',
            bassboost: 'bass=g=20,dynaudnorm=f=200',
            purebass: 'bass=g=20,dynaudnorm=f=200,asubboost,apulsator=hz=0.08',
            '8D': 'apulsator=hz=0.08',
            vaporwave: 'aresample=48000,asetrate=48000*0.8',
            nightcore: 'aresample=48000,asetrate=48000*1.25',
            phaser: 'aphaser=in_gain=0.4',
            tremolo: 'tremolo',
            vibrato: 'vibrato=f=6.5',
            reverse: 'areverse',
            treble: 'treble=g=5',
            normalizer: 'dynaudnorm=f=200',
            surrounding: 'surround',
            pulsator: 'apulsator=hz=1',
            subboost: 'asubboost',
            karaoke: 'stereotools=mlev=0.03',
            flanger: 'flanger',
            gate: 'agate',
            haas: 'haas',
            mcompand: 'mcompand',
        },
        plugins: [new SpotifyPlugin()],
    });

    // Queue status template
    // const status = (queue) =>
    //     `Volume: \`${queue.volume}%\` | Filter: \`${
    //         queue.filter || 'Off'
    //     }\` | Loop: \`${
    //         queue.repeatMode
    //             ? queue.repeatMode == 2
    //                 ? 'All Queue'
    //                 : 'This Song'
    //             : 'Off'
    //     }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;

    // Queue status template
    const status = (queue) =>
        `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || 'Off'}\``;

    try {
        // DisTube event listeners, more in the documentation page
        client.distube //ONCE A SONG STARTS PLAYING SEND INFORMATIONAL MESSAGE
            .on('playSong', (queue, song) => {
                let msg;
                if (song.playlist) {
                    // If its a playlist
                    msg = new MessageEmbed()
                        .setTitle(
                            'Playing Playlist :notes: ' +
                                song.playlist.name +
                                ` - \`[${song.playlist.length} songs]\``
                        )
                        .setURL(song.playlist.url)
                        .setColor(ee.color)
                        .addField(
                            'Current Track: ',
                            `[${song.name}](${song.url})`
                        )
                        .addField(
                            'Duration',
                            `\`${song.playlist.formattedDuration}\``
                        )
                        .addField(
                            `${queue.songs.length} Songs in the Queue`,
                            `Duration: \`${format(queue.duration * 1000)}\``
                        )
                        .setThumbnail(song.playlist.thumbnail.url)
                        .setFooter(
                            `Requested by: ${song.user.tag}`,
                            song.user.displayAvatarURL({ dynamic: true })
                        );
                } else {
                    msg = new MessageEmbed()
                        .setTitle('Playing :notes: ' + song.name)
                        .setURL(song.url)
                        .setColor(ee.color)
                        .addField(
                            'Duration',
                            `\`${song.formattedDuration}\``,
                            true
                        )
                        .addField('\u200b', '\u200b', true)
                        .addField('QueueStatus', status(queue), true)
                        .setThumbnail(song.thumbnail)
                        .setFooter(
                            `Requested by: ${song.user.tag}`,
                            song.user.displayAvatarURL({ dynamic: true })
                        );
                }
                queue.textChannel.send({ embeds: [msg] });
            })
            //ONCE A SONG IS ADDED TO THE QUEUE SEND INFORMATIONAL MESSAGE
            .on('addSong', (queue, song) =>
                queue.textChannel.send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle('Added :thumbsup: ' + song.name)
                            .setURL(song.url)
                            .setColor(ee.color)
                            .addField(
                                `${queue.songs.length} Songs in the Queue`,
                                `Total Duration: \`${format(
                                    queue.duration * 1000
                                )}\``
                            )
                            .addField(
                                'Duration',
                                `\`${song.formattedDuration}\``
                            )
                            .setThumbnail(song.thumbnail)
                            .setFooter(
                                `Requested by: ${song.user.tag}`,
                                song.user.displayAvatarURL({ dynamic: true })
                            ),
                    ],
                })
            )

            // DisTubeOptions.searchSongs > 0
            .on('addList', (queue, playlist) =>
                queue.textChannel.send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(
                                'Added Playlist :thumbsup: ' +
                                    playlist.name +
                                    ` - \`[${playlist.songs.length} songs]\``
                            )
                            .setURL(playlist.url)
                            .setColor(ee.color)
                            .addField(
                                'Duration',
                                `\`${playlist.formattedDuration}\``
                            )
                            .addField(
                                `${queue.songs.length} Songs in the Queue`,
                                `Duration: \`${format(queue.duration * 1000)}\``
                            )
                            .setThumbnail(playlist.thumbnail.url),
                    ],
                })
            )
            // DisTubeOptions.searchSongs = true
            .on('searchResult', (message, results) => {
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle('**Choose an option from below**')
                            .setColor(ee.color)
                            .setDescription(
                                `${results
                                    .map(
                                        (song, i) =>
                                            `**${i + 1}**. ${song.name} - \`${
                                                song.formattedDuration
                                            }\``
                                    )
                                    .join(
                                        '\n'
                                    )}\n\n*To cancel, enter any character (that is not part of list) | Automatically cancels after 60s*`
                            ),
                    ],
                });
            })

            .on('searchInvalidAnswer', (message) =>
                sendMsg(
                    message,
                    'You have not sent a valid character!',
                    '❌ Ending Search Query'
                )
            )
            .on('searchNoResult', (message, query) =>
                sendMsg(message, `No result found for ${query}!`, '❌ RIP')
            )
            .on('searchCancel', (message) =>
                sendMsg(message, '', '❌ Search Cancelled')
            )
            .on('searchDone', (message) =>
                sendMsg(message, '', '✅ Search Completed!')
            )
            .on('error', (channel, err) => {
                console.log(err);
                channel
                    .send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setTitle('❌ Error')
                                .setDescription('An error occurred!'),
                        ],
                    })
                    .then((sent) => {
                        setTimeout(() => {
                            sent.delete();
                        }, 2500);
                    });
            })
            .on('empty', (queue) =>
                queue.textChannel
                    .send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setTitle('Channel is empty!')
                                .setDescription('Leaving channel'),
                        ],
                    })
                    .then((sent) => {
                        setTimeout(() => {
                            sent.delete();
                        }, 2500);
                    })
            )
            .on('finish', (queue) =>
                queue.textChannel
                    .send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setTitle('Bye 👋')
                                .setDescription('No more songs in queue!'),
                        ],
                    })
                    .then((sent) => {
                        setTimeout(() => {
                            sent.delete();
                        }, 2500);
                    })
            )
            .on('initQueue', (queue) => {
                queue.autoplay = false;
                queue.volume = 80;
                queue.filter = 'lowbass';
            });
    } catch (err) {
        console.error(err);
    }
};
