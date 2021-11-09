// // showcases the number of members on the server
// module.exports = async (client, message, args) => {
//     const guild = client.guilds.cache.get('607154815620874240');

//     setInterval(() => {
//         const memberCount = guild.memberCount;
//         const channel = guild.channels.cache.get('906276283921604709');
//         channel.setName(`Total Members: ${memberCount.toLocaleString()}`);
//     }, 1800000); // 30 minutes = 1800000
// };