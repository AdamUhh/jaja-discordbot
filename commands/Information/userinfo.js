const { MessageEmbed } = require('discord.js');
const ee = require('../../botconfig/embed.json');

module.exports = {
    name: 'userinfo',
    aliases: ['uinfo'],
    category: 'Information',
    usage: 'userinfo',
    cooldown: 5,
    description: 'Gives you information about a user',

    run: async (client, message, args) => {
        try {
            const user = message.mentions.users.first() || message.member.user;
            const member = message.guild.members.cache.get(user.id);

            if (!user)
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setTitle('❌ No User')
                            .setDescription(
                                'Please Mention the User you wanna get Information about'
                            ),
                    ],
                });

            let roles = member.roles.cache
                .map((r) => r)
                .join(' ')
                .replace('@everyone', ' ');
            roles = roles.length > 1 ? roles : 'No Roles';

            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#FF4454')
                        .setThumbnail(`${member.user.displayAvatarURL()}`)
                        .setTitle(`User info for ${user.username}`)
                        .addFields(
                            {
                                name: 'User tag',
                                value: user.tag || 'None',
                                inline: true,
                            },
                            // Empty space
                            { name: '\u200b', value: '\u200b', inline: true },
                            {
                                name: 'Nickname',
                                value: member.nickname || 'None',
                                inline: true,
                            },

                            {
                                name: 'Joined Server',
                                value: new Date(
                                    member.joinedTimestamp
                                ).toLocaleDateString(),
                                inline: true,
                            },
                            { name: '\u200b', value: '\u200b', inline: true },
                            {
                                name: 'Joined Discord',
                                value: new Date(
                                    user.createdTimestamp
                                ).toLocaleDateString(),
                                inline: true,
                            },
                            {
                                name: 'Roles',
                                value: `${roles}`,
                                inline: true,
                            },
                            { name: '\u200b', value: '\u200b', inline: true },
                            {
                                name: 'Highest Role',
                                value: `${member.roles.highest}`,
                                inline: true,
                            },
                            {
                                name: 'Is bot',
                                value: `${
                                    user.bot === true
                                        ? '🤖 Beep Boop (Yes)'
                                        : 'Nope'
                                }`,
                                inline: true,
                            }
                        )
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
