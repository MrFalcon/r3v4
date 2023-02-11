const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Toca música até parar.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("song")
                .setDescription("Loop na música atual."))
        .addSubcommand(subcommand =>
            subcommand
                .setName("queue")
                .setDescription("Loop em toda a fila atual.")),

	execute: async ({ client, interaction }) => {
        
        // Get the queue for the server
		const queue = client.player.getQueue(interaction.guildId)

        // Check if the queue is empty
		if (!queue)
		{
			await interaction.reply("Não tem nenhuma música na fila.")
			return;
		}

        if (interaction.options.getSubcommand() === "song"){
            queue.setRepeatMode(1);
            await interaction.reply("Música devidamente loopada.")
        }
        
        else if (interaction.options.getSubcommand() === "queue"){
            queue.setRepeatMode(2);
            await interaction.reply("Queue devidamente loopada.")
        }
	}
}