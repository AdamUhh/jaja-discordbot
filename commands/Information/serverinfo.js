const { MessageEmbed } = require('discord.js');
const ee = require('../../botconfig/embed.json');

module.exports = {
    name: 'serverinfo',
    aliases: ['sinfo'],
    category: 'Information',
    usage: 'serverinfo',
    cooldown: 5,
    description: 'Gives you information about the server',

    run: async (client, message, args) => {
        try {
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle('Server Information')
                        .setColor(ee.color)
                        .addField('Server Name', message.guild.name)
                        .addField(
                            'Channels',
                            message.guild.channels.cache.size.toString(),
                            true
                        )
                        .addField(`\u200b`, `\u200b`, true)
                        .addField(
                            'Roles',
                            message.guild.roles.cache.size.toString(),
                            true
                        )
                        .addField(
                            'Created On',
                            new Date(
                                message.guild.createdTimestamp
                            ).toLocaleDateString(),
                            true
                        )
                        .addField(`\u200b`, `\u200b`, true)
                        .addField(
                            'You Joined',
                            new Date(
                                message.member.joinedTimestamp
                            ).toLocaleDateString(),
                            true
                        )
                        .addField(
                            'Total Members',
                            message.guild.memberCount.toString()
                        )
                        .setThumbnail(message.guild.iconURL({ dynamic: true }))
                        .setTimestamp()
                        .setFooter(
                            `Requested by: ${message.member.user.tag}`,
                            message.member.user.displayAvatarURL({
                                dynamic: true,
                            })
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
