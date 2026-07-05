require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, ChannelType, PermissionFlagsBits } = require('discord.js');
const http = require('http');

// 1. Initialisation du client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// 2. Fonction de conversion de police (Unicode Sans-Serif Bold)
const convertirTexte = (texte) => {
    const map = {
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭'
    };
    return texte.split('').map(char => map[char] || char).join('');
};

// 3. Configuration de la commande
const commands = [
    {
        name: 'cree-salon',
        description: 'Crée un nouveau salon',
        default_member_permissions: PermissionFlagsBits.Administrator.toString(),
        options: [
            { name: 'nom', type: 3, description: 'Nom du salon', required: true },
            { name: 'emoji', type: 3, description: 'Emoji de début', required: true },
            { name: 'categorie', type: 7, description: 'Choisissez la catégorie', required: true, channel_types: [4] }
        ]
    }
];

// 4. Enregistrement des commandes
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
(async () => {
    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    } catch (error) { console.error(error); }
})();

// 5. Logique de création de salon
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'cree-salon') {
        const nom = interaction.options.getString('nom');
        const emoji = interaction.options.getString('emoji');
        const categorie = interaction.options.getChannel('categorie');
        const nomFinal = `${emoji}-${convertirTexte(nom)}`;

        try {
            const channel = await interaction.guild.channels.create({
                name: nomFinal,
                type: ChannelType.GuildText,
                parent: categorie.id
            });
            await interaction.reply({ content: `✅ Salon créé avec succès : ${channel}`, ephemeral: true });
        } catch (err) {
            await interaction.reply({ content: "❌ Erreur : Impossible de créer le salon.", ephemeral: true });
        }
    }
});

// 6. Serveur de santé pour Canner
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('OK');
}).listen(process.env.PORT || 3000);

client.once('ready', () => console.log(`Connecté : ${client.user.tag}`));
client.login(process.env.TOKEN);
