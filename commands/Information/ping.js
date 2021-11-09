const { MessageEmbed } = require('discord.js');
const ee = require('../../botconfig/embed.json');

module.exports = {
    name: 'ping',
    aliases: ['latency'],
    category: 'Information',
    usage: 'ping',
    cooldown: 5,
    description: 'Gives you information on how fast the Bot can respond to you',

    run: async (client, message, args) => {
        try {
            return message.channel
                .send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(ee.color)
                            .setTitle(`🏓  Pinging....`),
                    ],
                })
                .then((msg) => {
                    msg.edit({
                        embeds: [
                            new MessageEmbed()
                                .setColor(ee.color)
                                .setTitle(
                                    `🏓  Ping is \`${Math.round(
                                        client.ws.ping
                                    )}ms\``
                                )
                                .setFooter(
                                    `Requested by: ${message.member.user.tag}`,
                                    message.member.user.displayAvatarURL({
                                        dynamic: true,
                                    })
                                ),
                        ],
                    });
                });
        } catch (err) {
            console.error(err);
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setTitle(`❌ ERROR | An error occurred`)
                        .setDescription(`\`\`\`${err}\`\`\``),
                ],
            });
        }
    },
};
