const { MessageEmbed } = require('discord.js');
const ee = require('../../botconfig/embed.json');
const { format } = require('../../handlers/functions');
module.exports = {
    name: 'botinfo',
    aliases: ['binfo'],
    category: 'Information',
    usage: 'botinfo',
    cooldown: 5,
    description: 'Gives you information about this bot',

    run: async (client, message, args) => {
        try {
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#FF4454')
                        .setThumbnail(`${client.user.displayAvatarURL()}`)

                        .setTitle(`Bot info for ${client.user.username}`)
                        .addFields(
                            {
                                name: 'Servers count',
                                value: `${client.guilds.cache.size}`,
                            },
                            {
                                name: 'Latency',
                                value: `${client.ws.ping}ms`,
                                inline: true,
                            },
                            {
                                name: 'Uptime',
                                value: `${format(
                                    process.uptime().toFixed(2) * 1000
                                )}`,
                                inline: true,
                            }
                        ),
                ],
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
