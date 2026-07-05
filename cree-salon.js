const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cree-salon')
        .setDescription('Crée un nouveau salon avec un style personnalisé')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // Restreint aux admins
        .addStringOption(option => 
            option.setName('nom')
                .setDescription('Le nom du salon (ex: info)')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('emoji')
                .setDescription('L\'emoji au début (ex: ℹ️)')
                .setRequired(true))
        .addChannelOption(option => 
            option.setName('categorie')
                .setDescription('La catégorie où placer le salon')
                .addChannelTypes(ChannelType.GuildCategory)
                .setRequired(true)),

    async execute(interaction) {
        const nom = interaction.options.getString('nom');
        const emoji = interaction.options.getString('emoji');
        const categorie = interaction.options.getChannel('categorie');

        // Conversion en police "Math Sans Bold" (ex: 𝗜𝗡𝗙𝗢)
        // Note: Les caractères Unicode spéciaux peuvent varier selon les systèmes
        const convertirTexte = (texte) => {
            const map = {
                'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
                'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭'
            };
            return texte.split('').map(char => map[char] || char).join('');
        };

        const nomFinal = `${emoji}-${convertirTexte(nom.toUpperCase())}`;

        try {
            const channel = await interaction.guild.channels.create({
                name: nomFinal,
                type: ChannelType.GuildText,
                parent: categorie.id
            });

            await interaction.reply({ content: `✅ Salon créé avec succès : ${channel}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "❌ Une erreur est survenue lors de la création du salon.", ephemeral: true });
        }
    },
};
