// Discord client
const Discord = require('discord.js');
const client = new Discord.Client();
// Env config
require('dotenv').config();
// Calc module
const calc = require('./modules/calc');

const BOT_TOKEN = process.env.BOT_TOKEN;
const PREFIX = "$mad";
const botCommands = {
  HELP: 'help',
  CALC: 'calc' 
};

client.on('ready', () => {
  console.log(`Logged in as ${ client.user.tag }!`);
  // Set bot activity
  client.user.setActivity(`${ PREFIX } help`, { type: 'LISTENING' });
});

client.on('message', msg => {
  const msgContent = msg.content.split(" ");

  if(msgContent[0].startsWith(`${ PREFIX }`)) {

    if(msgContent.length == 1) {
      msg.channel.send('What is MAD may never die!');
      return;
    }

    let command = msgContent[1];
    switch(command) {
      case botCommands.HELP:
        let embed = new Discord.MessageEmbed()
          .setTitle('MAD is here! How can I help?')
          .setColor(0xff0000)
          .addFields(
            { name: 'Compute for bank requirement', value: '$mad calc <shipped> <delivered> <requested>' },
          );
        msg.channel.send(embed);
        break;


      case botCommands.CALC:
        let result = calc({
          shipped: msgContent[2],
          delivered: msgContent[3],
          requested: msgContent[4]
        });

        let output = new Discord.MessageEmbed()
          .setTitle('MAD Bank')
          .setColor(0xff0000)
          .addFields(result);

        msg.channel.send(output);            
        break;
    }
  }
});

client.login(BOT_TOKEN);