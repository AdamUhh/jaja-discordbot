const { Client, Intents, Collection } = require('discord.js');
require('dotenv').config({ path: __dirname + '/.env.local' });
const { readdirSync } = require('fs');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.commands = new Collection();
client.events = new Collection();
client.aliases = new Collection();
client.cooldowns = new Collection();
client.categories = readdirSync('./commands/').filter(dir => dir !== 'Experimental'); //dont show the experimental commands

['commandHandler', 'eventsHandler', 'distubeHandler'].forEach((handler) => {
    require(`./handlers/${handler}`)(client);
});

// const commandFiles = fs
//     .readdirSync('./commands/')
//     .filter((file) => file.endsWith('.js'));
// for (let file of commandFiles) {
//     const command = require(`./commands/${file}`);
//     client.commands.set(command.name, command);
// }

// client.on('ready', () => {
//     console.log(`${client.user.tag} is now online and ready to use!`);
//     // require('./commands/memberCounter')(client);
// });

// // When a new user / bot joins the server
// // client.on('guildMemberAdd', (guildMember) => {
// //     let channelId = '906219947200499722';
// //     let welcomeRole;
// //     if (guildMember.user.bot)
// //         welcomeRole = guildMember.guild.roles.cache.find(
// //             (role) => role.name === 'Bot'
// //         );
// //     else
// //         welcomeRole = guildMember.guild.roles.cache.find(
// //             (role) => role.name === 'Member'
// //         );
// //     guildMember.roles.add(welcomeRole);
// //     guildMember.guild.channels.cache
// //         .get(channelId)
// //         .send(`Welcome <@${guildMember.user.id}> to the server!`);
// // });

// client.on('messageCreate', (message) => {
//     if (!message.content.startsWith(process.env.PREFIX) || message.author.bot)
//         return;
//     const args = message.content
//         .toLowerCase()
//         .slice(process.env.PREFIX.length)
//         .trim()
//         .split(/ +/);

//     const command = args.shift();

//     if (command === 'ping') client.commands.get('ping').run(message, client);
//     else if (command === 'clear')
//         client.commands.get('clear').run(message, args);
//     else if (command === 'mute') client.commands.get('mute').run(message, args);
//     else if (command === 'reactionroles')
//         client.commands.get('reactionroles').run(client, message, args);
//     else if (command === 'play')
//         client.commands.get('play').run( message, args);
//     else if (command === 'leave')
//         client.commands.get('leave').run( message, args);
// });
client.login(process.env.BOT_TOKEN);
