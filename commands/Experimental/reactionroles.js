// const { MessageEmbed, Permissions } = require('discord.js');

// module.exports = {
//     name: 'reactionroles',
//     description: 'Gives you roles by clicking on a custom reaction',
//     run: async (client, message, args) => {
//         try {
//             const channelId = '906239996778934332';
//             // const channelId = '905534652629012600';

//             let Role1Name = 'Gay';
//             let Role2Name = 'Not Gay';

//             let role1 = message.guild.roles.cache.find(
//                 (role) => role.name === Role1Name
//             );
//             let role2 = message.guild.roles.cache.find(
//                 (role) => role.name === Role2Name
//             );

//             if (typeof role1 === 'undefined')
//                 // Creating the role since it doesn't exist.
//                 await message.guild.roles.create({
//                     name: Role1Name,
//                     color: '#9B59B6',
//                     permissions: [Permissions.FLAGS.MANAGE_MESSAGES],
//                 });

//             if (typeof role2 === 'undefined') {
//                 // Creating the role since it doesn't exist.
//                 await message.guild.roles.create({
//                     name: Role2Name,
//                     color: '#3498DB',
//                     permissions: [Permissions.FLAGS.MANAGE_MESSAGES],
//                 });
//             }

//             const team1Role = message.guild.roles.cache.find(
//                 (role) => role.name === Role1Name
//             );
//             const team2Role = message.guild.roles.cache.find(
//                 (role) => role.name === Role2Name
//             );

//             const team1Emoji = '🎈';
//             const team2Emoji = '🎇';

//             let embed = new MessageEmbed()
//                 .setColor('#e42643')
//                 .setTitle('Choose a team to play on!')
//                 .setDescription(
//                     'Choosing a team will allow you to interact with your teammates!\n\n' +
//                         `${team1Emoji} if u r gay\n` +
//                         `${team2Emoji} if u r not gay`
//                 );

//             let messageEmbed = await message.channel.send({ embeds: [embed] });
//             messageEmbed.react(team1Emoji);
//             messageEmbed.react(team2Emoji);

//             client.on('messageReactionAdd', async (reaction, user) => {
//                 if (reaction.message.partial) await reaction.message.fetch();
//                 if (reaction.partial) await reaction.fetch();
//                 if (user.bot) return;
//                 if (!reaction.message.guild) return;

//                 if (reaction.message.channel.id == channelId) {
//                     if (reaction.emoji.name === team1Emoji) {
//                         await reaction.message.guild.members.cache
//                             .get(user.id)
//                             .roles.add(team1Role);
//                     }
//                     if (reaction.emoji.name === team2Emoji) {
//                         await reaction.message.guild.members.cache
//                             .get(user.id)
//                             .roles.add(team2Role);
//                     }
//                 } else {
//                     return;
//                 }
//             });

//             client.on('messageReactionRemove', async (reaction, user) => {
//                 if (reaction.message.partial) await reaction.message.fetch();
//                 if (reaction.partial) await reaction.fetch();
//                 if (user.bot) return;
//                 if (!reaction.message.guild) return;

//                 if (reaction.message.channel.id == channelId) {
//                     if (reaction.emoji.name === team1Emoji) {
//                         await reaction.message.guild.members.cache
//                             .get(user.id)
//                             .roles.remove(team1Role);
//                     }
//                     if (reaction.emoji.name === team2Emoji) {
//                         await reaction.message.guild.members.cache
//                             .get(user.id)
//                             .roles.remove(team2Role);
//                     }
//                 } else {
//                     return;
//                 }
//             });
//         } catch (err) {
//             console.error(err);
//         }
//     },
// };
