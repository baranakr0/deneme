const { Client, Intents } = require('discord.js');
const fs = require('fs');
const ayarlar = require('./ayarlar.json');

require('dotenv').config(); // dotenv'i projeye dahil et

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

client.commands = new Map();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.on('messageCreate', async message => {
  if (message.content === '.sondeprem' || message.content.includes('.depremkanal') || message.content === '.sıfırla') {
      try {
          setTimeout(() => {
              message.delete().catch(console.error);
          }, 5000); // 5 saniye sonra mesajı sil
      } catch (error) {
          console.error('Mesaj silinemedi:', error);
      }
  }
});



client.login(ayarlar.token);
