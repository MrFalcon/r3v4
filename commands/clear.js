const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Limpa a fila."),
	execute: async ({ client, interaction }) => {

        // Get the current queue
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue)
		{
			await interaction.reply("Não tem nenhuma música na fila")
			return;
		}

        // Clear all the songs from the queue
		queue.clear();
		

        await interaction.reply("Limpei a fila.")
	},
}