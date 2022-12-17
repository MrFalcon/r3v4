const {SlashCommandBuilder} = require("@discordjs/builders");
const {EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Pula a música atual."),
    execute: async ({client, interaction}) => {

        const queue = client.player.getQueue(interaction.guild);

        if(!queue){
            await interaction.reply("Nenhuma música tocando.");
            return;
        }
        const currentSong = queue.current;

        queue.skip();

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`|${currentSong.title}| foi skipado por ${interaction.user.username}`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}