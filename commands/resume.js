const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Volta a tocar a música atual."),
	execute: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue)
        {
            await interaction.reply("Nenhuma música na fila.");
            return;
        }

		queue.setPaused(false);

        await interaction.reply("A música foi seguida.")
	},
}