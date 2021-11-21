const { MessageEmbed } = require('discord.js');
const ee = require('../../botconfig/embed.json');

module.exports = {
    name: 'help',
    category: 'Information',
    aliases: ['h', 'commandinfo', 'cmds', 'cmd'],
    cooldown: 4,
    usage: 'help [command]',
    description: 'Returns all Commmands, or one specific command',
    run: async (client, message, args) => {
        try {
            const prefix = process.env.PREFIX;

            if (args[0]) {
                const embed = new MessageEmbed();
                const cmd =
                    client.commands.get(args[0].toLowerCase()) ||
                    client.commands.get(
                        client.aliases.get(args[0].toLowerCase())
                    );
                if (!cmd) {
                    return message.channel.send(
                        embed
                            .setColor(ee.wrongcolor)
                            .setDescription(
                                `No Information found for command **${args[0].toLowerCase()}**`
                            )
                    );
                }
                if (cmd.name) {
                    embed.addField('**Command name**', `\`${cmd.name}\``);
                    embed.setTitle(
                        `Detailed Information about:\`${cmd.name}\``
                    );
                }
                if (cmd.description)
                    embed.addField('**Description**', `\`${cmd.description}\``);
                if (cmd.aliases)
                    embed.addField(
                        '**Aliases**',
                        `\`${cmd.aliases.map((a) => `${a}`).join('`, `')}\``
                    );
                if (cmd.cooldown)
                    embed.addField(
                        '**Cooldown**',
                        `\`${cmd.cooldown} Seconds\``
                    );
                else embed.addField('**Cooldown**', `\`1 Second\``);
                if (cmd.usage) {
                    embed.addField('**Usage**', `\`${prefix}${cmd.usage}\``);
                    embed.setFooter('Syntax: <> = required, [] = optional');
                }

                return message.channel.send({
                    embeds: [embed.setColor(ee.color)],
                });
            } else {
                const embed = new MessageEmbed()
                    .setColor(ee.color)
                    .setThumbnail(client.user.displayAvatarURL())
                    .setTitle('Help Menu')
                    .setFooter(
                        `To see command descriptions and information, type: ${prefix}help [COMMAND NAME]`,
                        client.user.displayAvatarURL()
                    );
                const commands = (category) => {
                    return client.commands
                        .filter((cmd) => cmd.category === category)
                        .map((cmd) => `\`${cmd.name}\``);
                };
                try {
                    for (let i = 0; i < client.categories.length; i += 1) {
                        const current = client.categories[i];
                        const items = commands(current);
                        const n = 3;
                        const result = [[], [], []];
                        const wordsPerLine = Math.ceil(items.length / 3);
                        for (let line = 0; line < n; line++) {
                            for (let i = 0; i < wordsPerLine; i++) {
                                const value = items[i + line * wordsPerLine];
                                if (!value) continue;
                                result[line].push(value);
                            }
                        }
                        embed.addField(
                            `**${current.toUpperCase()} [${items.length}]**`,
                            `> ${result[0].join('\n> ')}`,
                            true
                        );
                        embed.addField(
                            `\u200b`,
                            `${
                                result[1].join('\n')
                                    ? result[1].join('\n')
                                    : '\u200b'
                            }`,
                            true
                        );
                        embed.addField(
                            `\u200b`,
                            `${
                                result[2].join('\n')
                                    ? result[2].join('\n')
                                    : '\u200b'
                            }`,
                            true
                        );
                    }
                } catch (err) {
                    console.error(err);
                }
                message.channel.send({ embeds: [embed] });
            }
        } catch (err) {
            console.error(err);
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setTitle(`❌ ERROR | An error occurred`)
                        .setDescription(`\`\`\`${err.stack}\`\`\``),
                ],
            });
        }
    },
};
