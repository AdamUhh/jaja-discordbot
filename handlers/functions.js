const ee = require('../botconfig/embed.json');
const { MessageEmbed } = require('discord.js');

function formatter(millis) {
    try {
        // 1- Convert to seconds:
        let s = millis / 1000;
        // 2- Extract hours:
        let h = parseInt(s / 3600); // 3,600 seconds in 1 hour
        s = s % 3600; // seconds remaining after extracting hours
        // 3- Extract minutes:
        let m = parseInt(s / 60); // 60 seconds in 1 minute
        // 4- Keep only seconds not extracted to minutes:
        s = Math.floor(s % 60);

        if (h < 1)
            return (
                '00' +
                ':' +
                (m < 10 ? '0' : '') +
                m +
                ':' +
                (s < 10 ? '0' : '') +
                s
            );
        else
            return (
                (h < 10 ? '0' : '') +
                h +
                ':' +
                (m < 10 ? '0' : '') +
                m +
                ':' +
                (s < 10 ? '0' : '') +
                s
            );
    } catch {
        console.error;
    }
}
module.exports = {
    deleteUserMsg: async (message) => {
        try {
            return await message.delete();
        } catch (err) {
            console.log('Problem with trying to delete user command msg');
            console.error(err);
        }
    },
    sendMsg: async (message, text = '', title = '', permanent = false) => {
        try {
            let embed;
            if (title.length) {
                embed = new MessageEmbed()
                    .setColor(
                        title.substring(0, 1) === '⚠'
                            ? ee.warningcolor
                            : title.substring(0, 1) === '❌'
                            ? ee.wrongcolor
                            : title.substring(0, 1) === '✅'
                            ? ee.successcolor
                            : ee.color
                    )
                    .setDescription(text)
                    .setTitle(title);
            } else {
                embed = new MessageEmbed()
                    .setColor(ee.color)
                    .setDescription(text);
            }
            try {
                await message.channel
                    .send({
                        embeds: [embed],
                    })
                    .then((sent) => {
                        if (!permanent)
                            try {
                                setTimeout(() => {
                                    sent.delete().catch(console.error);
                                }, 2500);
                            } catch (err) {
                                console.log(
                                    'Problem with trying to delete bots message'
                                );
                                console.error(err);
                            }
                    });
            } catch (err) {
                console.log('Problem with trying to send embeded msg');
                console.error(err);
            }
        } catch (err) {
            console.error(err);
        }
    },
    format: function (millis) {
        try {
            // 1- Convert to seconds:
            let s = millis / 1000;
            // 2- Extract hours:
            let h = parseInt(s / 3600); // 3,600 seconds in 1 hour
            s = s % 3600; // seconds remaining after extracting hours
            // 3- Extract minutes:
            let m = parseInt(s / 60); // 60 seconds in 1 minute
            // 4- Keep only seconds not extracted to minutes:
            s = Math.floor(s % 60);

            if (h < 1)
                return (
                    '00' +
                    ':' +
                    (m < 10 ? '0' : '') +
                    m +
                    ':' +
                    (s < 10 ? '0' : '') +
                    s
                );
            else
                return (
                    (h < 10 ? '0' : '') +
                    h +
                    ':' +
                    (m < 10 ? '0' : '') +
                    m +
                    ':' +
                    (s < 10 ? '0' : '') +
                    s
                );
        } catch (err) {
            console.log(err);
        }
    },
    //function for creating a bar
    createBar: function (
        currenttime,
        maxtime,
        size = 50,
        line = '•',
        slider = '🔶'
    ) {
        currenttime = Math.floor(currenttime) * 1000; //convert it into milliseconds
        maxtime = maxtime * 1000;
        try {
            let bar =
                currenttime > maxtime
                    ? [
                          line.repeat((size / 2) * 2),
                          (currenttime / maxtime) * 100,
                      ]
                    : [
                          line
                              .repeat(
                                  Math.round(
                                      (size / 2) * (currenttime / maxtime)
                                  )
                              )
                              .replace(/.$/, slider) +
                              line.repeat(
                                  size -
                                      Math.round(
                                          size * (currenttime / maxtime)
                                      ) +
                                      1
                              ),
                          currenttime / maxtime,
                      ];
            if (!String(bar).includes('🔶'))
                return `**[🔶${line.repeat(size - 1)}]**\n**${formatter(
                    currenttime
                )} / ${formatter(maxtime)}**`;
            return `**[${bar[0]}]**\n**${
                new Date(currenttime).toISOString().substr(11, 8) +
                ' / ' +
                (maxtime == 0
                    ? ' ◉ LIVE'
                    : new Date(maxtime).toISOString().substr(11, 8))
            }**`;
        } catch (err) {
            console.error(err);
        }
    }, 
    //Function to wait some time
    delay: function (delayInms) {
        try {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(2);
                }, delayInms);
            });
        } catch (err) {
            console.err(err);
        }
    },
};
