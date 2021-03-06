const Discord = require('discord.js');
const ms = require('ms');
config = require('../../config.json');

module.exports = {
    name: "giveaway",
    logo: "๐",
    usage: ["Cette commande permets de cree des GiveAway."],
    syntax: ["```{prefix}giveaway <#Channel> <Durรฉe<s>/<m>/<h>/<d>> <Nombre de gagants> <Prix>```"],
    exemple: ["```{prefix}giveaway #giveaway 1d 1 Une maison au bord de la plage.```"],
    enabled: true,
    aliases: ["giveaway"],
    category: "๐ก๏ธ ๏ฟถ | ๏ฟถ Admin",
    memberPermissions: [ "ADMINISTRATOR", "MANAGE_MESSAGES" ],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 5000,

    async execute(client, message, args, data){
        try{
            let channel = message.mentions.channels.first();
            if (!channel) return client.embed.usage(message, data, client);

            let giveawayDuration = args[1];
            if (!giveawayDuration || isNaN(ms(giveawayDuration))) return client.embed.usage(message, data, client);

            let giveawayWinners = args[2];
            if (isNaN(giveawayWinners) || (parseInt(giveawayWinners) <= 0)) return client.embed.usage(message, data, client);

            let giveawayPrize = args.slice(3).join(" ");
            if (!giveawayPrize) return client.embed.usage(message, data, client);

            client.giveawaysManager.start(channel, {
                time: ms(giveawayDuration),
                prize: `${giveawayPrize}`,
                winnerCount: parseInt(giveawayWinners, 10),
                hostedBy: config.hostedBy ? message.author : null,

                messages: {
                    giveaway: `${config.Mention}\n\n ๐๐ **GIVEAWAY** ๐๐`,
                    giveawayEnded: `${config.Mention}\n\n ๐๐ **GIVEAWAY TERMINER** ๐๐`,
                    timeRemaining: "Temps restants: **{duration}**\n\n",
                    inviteToParticipate: "Rรฉagissez avec ๐ pour participer",
                    winMessage: "๐ Fรฉlicitation a {winners} qui viens de gagner : **{prize}**\n\n",
                    embedFooter: "Giveaway time!",
                    noWinner: "Aucune personne n'a รฉtรฉ tirรฉe au sort.\n\n",
                    hostedBy: "Giveaway par : {user}\n\n",
                    winners: "Gagnant(s)",
                    endedAt: "Heure de fin : ",
                    units: {
                        seconds: "secondes",
                        minutes: "minutes",
                        hours: "heures",
                        days: "jours",
                        pluralS: false
                    }
                }
            })

            message.channel.send(`Le Giveaway a commencer dans ${channel}`).then(sent => sent.delete({timeout: 5e3}));
        }catch(err){
            client.logger.error(`Une erreur s'est produite pendant l'execution de la commande : ${data.cmd.name}`)
            console.log(err)
            return client.embed.error(message, data, client);
        }
    }
}