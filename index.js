require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const http = require('http');

// 1. Initialisation du bot
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// 2. Configuration des commandes (Ajoutez ici le nom de votre fichier de commande)
const commands = [
    {
        name: 'cree-salon',
        description: 'Crée un nouveau salon personnalisé',
        options: [
            { name: 'nom', type: 3, description: 'Nom du salon', required: true },
            { name: 'emoji', type: 3, description: 'Emoji', required: true },
            { name: 'categorie', type: 7, description: 'Catégorie', required: true }
        ]
    }
];

// 3. Enregistrement des commandes slash
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Enregistrement des commandes slash...');
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('Commandes enregistrées !');
    } catch (error) {
        console.error(error);
    }
})();

// 4. Gestion des interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'cree-salon') {
        // Logique de création de salon (copiez votre code ici)
        await interaction.reply({ content: 'Salon en cours de création...', ephemeral: true });
        // ... (votre code de création de salon)
    }
});

// 5. Serveur HTTP pour le Health Check (pour éviter les erreurs de déploiement)
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
}).listen(PORT, () => {
    console.log(`Serveur de santé actif sur le port ${PORT}`);
});

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
});

client.login(process.env.TOKEN);
