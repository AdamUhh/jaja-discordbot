const { MessageEmbed } = require('discord.js');
const ee = require('../../botconfig/embed.json');

module.exports = {
    name: 'rickroll',
    aliases: ['rr'],
    category: 'Misc',
    usage: 'rickroll',
    cooldown: 5,
    description: "Posts a picture of rick astley's famous video",

    run: async (client, message, args) => {
        try {
            console.log(message.member.user)
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle("You've been Rick Rolled!")
                        .setImage(
                            'https://c.tenor.com/yheo1GGu3FwAAAAd/rick-roll-rick-ashley.gif'
                        )
                        .setFooter(`By ${message.member.user.username}`)
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
