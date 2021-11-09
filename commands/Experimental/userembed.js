// const { Permissions, MessageEmbed } = require('discord.js');
// const ee = require('../../botconfig/embed.json');

// module.exports = {
//     name: 'userembed',
//     aliases: ['customembed', 'embeder'],
//     description: 'Create a custom user embeded message',

//     run: async (client, message, args) => {
//         if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
//             return;

//         try {
//             let msg = args.join(' ').split('.');
//             let title = msg[0] || '';
//             let description = msg.slice(1).join(' ') || '';

//             if (!title && !description) {
//                 return message.channel
//                     .send({
//                         embeds: [
//                             new MessageEmbed()
//                                 .setColor(ee.color)
//                                 .setTitle('ERROR')
//                                 .setDescription(
//                                     `How to embed your text \n${process.env.PREFIX}userembed title. description \nThe fullstop (.) is used to separate the title from the description`
//                                 ),
//                         ],
//                     })
//                     .then((sent) => {
//                         setTimeout(() => {
//                             sent.delete();
//                         }, 5000);
//                     });
//             } else {
//                 message.delete();
//                 return message.channel.send({
//                     embeds: [
//                         new MessageEmbed()
//                             .setColor(ee.color)
//                             .setTitle(title)
//                             .setDescription(description),
//                     ],
//                 });
//             }
//         } catch (err) {
//             console.error(err);
//         }
//     },
// };
