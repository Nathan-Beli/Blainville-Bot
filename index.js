require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages
    ] 
});

client.once('ready', () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);
});

// Pour que le "Health Check" de votre hébergeur ne bloque pas, 
// on lance un serveur HTTP ultra léger sur le port 3000
const http = require('http');
http.createServer((req, res) => {
    res.write('Bot en ligne');
    res.end();
}).listen(3000);

client.login(process.env.TOKEN);
