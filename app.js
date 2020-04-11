// Discord client
const Discord = require('discord.js');
const client = new Discord.Client();
// Env config
require('dotenv').config();
// Calc module
const calc = require('./modules/calc');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);

const BOT_TOKEN = process.env.BOT_TOKEN;
const PREFIX = "$mad";
const botCommands = {
  HELP: 'help',
  CALC: 'calc',
  PO_PREFIX: '!',
  START_PO: 'start-po',
  STOP_PO: 'stop-po',
};

client.on('ready', () => {
  console.log(`Logged in as ${ client.user.tag }!`);
  // Set bot activity
  client.user.setActivity(`${ PREFIX } help`, { type: 'LISTENING' });
});

client.on('message', msg => {
  const msgContent = msg.content.split(" ");

  if(msgContent[0].startsWith(botCommands.PO_PREFIX)) {
    let guildData = msg.guild.member(msg.author);
    let date = new Date(msg.createdAt);
    let length = String(guildData.nickname).split(/\[(.*?)\]/).length;

    let nickname = guildData.nickname != null ? guildData.nickname  : msg.author.username;
    let alliance = length > 1 ? String(guildData.nickname).split(/\[(.*?)\]/)[1] : null;
    let name = length <= 1 ? nickname : String(nickname).split(/\[(.*?)\]/)[2];

    let dateformat = date.getUTCFullYear()  + "-" + (date.getUTCMonth()+1) + "-" + date.getUTCDate();
    let timeformat = date.getUTCHours() + ":" + date.getUTCMinutes();

    if(msgContent == `${botCommands.PO_PREFIX}${botCommands.START_PO}`) {
      let data = {
        ALLIANCE: alliance,
        NAME: name,
        ACTION: 'START',
        DATE: dateformat,
        TIME: timeformat
      }
      addRow(data, doc);
      return;
    }

    if(msgContent == `${botCommands.PO_PREFIX}${botCommands.STOP_PO}`) {
      let data = {
        ALLIANCE: alliance,
        NAME: name,
        ACTION: 'STOP',
        DATE: dateformat,
        TIME: timeformat
      }
      addRow(data, doc);
      return;
    }

    return;
  }

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

let addRow = (rowData, doc) => {
  (async function(){
    // await doc.useServiceAccountAuth(require('./client_secret.json'));
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
    await sheet.addRow(rowData);
  })(rowData, doc);
}

client.login(BOT_TOKEN);