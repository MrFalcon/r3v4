const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Toca uma música do youtube.")
		.addSubcommand(subcommand =>
			subcommand
				.setName("search")
				.setDescription("Procura por uma música no youtube.")
				.addStringOption(option =>
					option.setName("keyword").setDescription("procura por palavras chave").setRequired(true)
				)
		)
        .addSubcommand(subcommand =>
			subcommand
				.setName("playlist")
				.setDescription("Toca uma playlist do YT.")
				.addStringOption(option => option.setName("url").setDescription("url da playlist").setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("song")
				.setDescription("Toca UMA música do YT.")
				.addStringOption(option => option.setName("url").setDescription("url da música").setRequired(true))
		),
	execute: async ({ client, interaction }) => {
        // Verifica que o user está em um canal
		if (!interaction.member.voice.channel) return interaction.reply("Você precisa estar em um canal de voz para ouvir musga.");

        // Cria uma fila própria pro server
		const queue = await client.player.createQueue(interaction.guild);

        queue.options.leaveOnEndCooldown = 120000;
        queue.options.leaveOnEmptyCooldown = 20000;

        // Espera até que conecte ao canal
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

		let embed = new EmbedBuilder()

		if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            
            // Procura a música
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })

            // finaliza se nenhuma música for encontrada
            if (result.tracks.length === 0)
                return interaction.reply("Sem resultados.")

            // add música na fila
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** adicionando a fila\nDuração: ${song.duration}`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: 'JD passa-te a bufa, aceitas?🚬'})

		}
        else if (interaction.options.getSubcommand() === "playlist") {

            // Procura playlist usando discord-player
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if (result.tracks.length === 0)
                return interaction.reply(`Nenhuma playlist encontrada em: ${url}`)
            
            // Add musica na fila
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`**${result.tracks.length} músicas de [${playlist.title}](${playlist.url})** adicionadas a fila`)
                .setThumbnail(playlist.thumbnail.url)

		} 
        else if (interaction.options.getSubcommand() === "search") {

            // Procura a música usando o discord-player
            let url = interaction.options.getString("keyword")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            // sem resultados finaliza
            if (result.tracks.length === 0)
                return interaction.editReply("Sem resultados")
            
            // add track na fila
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** adicionando a fila\n\nDuração: ${song.duration}`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: 'JD passa-te a bufa, aceitas?🚬'})
		}

        // toca musga
        if (!queue.playing) await queue.play()
        
        // responde com a embed predefinida
        await interaction.reply({
            embeds: [embed]
        })
	},
}


