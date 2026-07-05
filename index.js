require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}!`);
});

// Ici, vous devrez charger vos commandes (la commande cree-salon.js)
// Pour l'instant, assurez-vous juste que le bot se connecte
client.login(process.env.TOKEN);
