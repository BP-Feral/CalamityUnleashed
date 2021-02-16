//configuration 
const Discord = require("discord.js");
const DisTube = require("distube");
const client = new Discord.Client({disableMentions: "everone"});
const token = "ODA1ODMyMTU1NjQ4MzYwNDQ5.YBgnrQ.QhC-CB2oAyUzF9Hws0-pi1ZUUpg"
const prefix = "calamity ";

const distube = new DisTube(client, {searchSongs: true, emitNewSongOnly: true, highWaterMark: 1<<25})
const filters = ["3d","bassboost","echo","karaoke","nightcore","vaporwave","flanger"];
//events

client.login(token);

client.on("ready", () =>{ 
    console.log(`Bot has started as : ${client.user.tag}`);
    client.user.setActivity("calamity help",{type: "LISTENING"});
})

client.on("message", message => {
    if(message.author.bot) return;
    if(!message.guild) return;
    if(!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift();
    
    if(command === "update") {
        return embedbuilder(client, message, `PURPLE`, "Daca doriti sa va alaturati serverului nostru de terraria modat parcurgeti urmatorii pasi:",  
    `<:terraria_lastprism:803681992348532756> Obtineti ultima versiune de Terraria de pe Steam sau GOG
    - https://store.steampowered.com/app/105600/Terraria/
    - https://www.gog.com/game/terraria

<:terraria_lastprism:803681992348532756> Instalati tModLoader folosind Steam, sau pagina oficiala
    - https://store.steampowered.com/app/1281930/tModLoader/
    - https://tmodloader.net/

<:terraria_lastprism:803681992348532756> Descarcati tModLoader 64 bit folosind urmatorul link: 
    - https://mega.nz/folder/c8oVyIBJ#FIoQVbg4IQ1HQ2BZpQoyGA/file/Uw5UhLZY
       (Descarcati doar arhiva "tML 64 0.11.8.zip")

<:terraria_lastprism:803681992348532756>  Extrageti arhiva descarcata in folderul instalat de tModLoader
     - Steam: C:\Program Files (x86)\Steam\steamapps\common\tModLoader
     - GOG:   C:\GOG\tModLoader

<:terraria_lastprism:803681992348532756> Folositi "tModLoader64bit.exe" care a fost extras in folderul tModLoader pentru a deschide jocul pe viitor

<:terraria_lastprism:803681992348532756> Instalati Radmin VPN https://www.radmin-vpn.com/
     - Folositi radmin VPN pentru a accesa reteaua "starbound127" folosind parola "tmodloader"

<:terraria_lastprism:803681992348532756> Acum va puteti conecta la serverul nostru de terraria modat, folosind adresa 26.31.113.148 / localhost si portul 7777

<:terraria_duck:803681992214183936> Daca intampinati probleme, contactati stafful nostru folosind tagul <@&803674164355399721> `)
    }
    
    if(command === "ping"){
        return embedbuilder(client, message, `sBLUE`, `PING:`, `\`${client.ws.ping} ms\``)
    }

    if(command === "play" || command === "p"){
        embedbuilder(client, message, "YELLOW", "Searching!", args.join(" "))
        return distube.play(message, args.join(" "));
    }
    if(command === "skip" || command === "s"){
        embedbuilder(client, message, "YELLOW", "SKIPPED!", `Skipped the song`)
        return distube.skip(message);
    } 
    if(command === "stop" || command === "leave"){
        embedbuilder(client, message, "RED", "STOPPED!", `Leaved the channel`)
        return distube.stop(message);
    }
    if(command === "seek"){
        embedbuilder(client, message, "GREEN", "Seeked!", `seeked the song for \`${args[0]} seconds\``)
        return distube.seek(message, Number(args[0]*1000));
    } 
    if(filters.includes(command)) {
        let filter = distube.setFilter(message, command);
        return embedbuilder(client, message, "YELLOW", "Adding filter!", filter)
    }
    if(command === "volume" || command === "vol"){
        
        embedbuilder(client, message, "GREEN", "VOLUME!", `changed volume to \`${args[0]} %\``)
        return distube.setVolume(message, args[0]);
    } 
    if (command === "queue" || command === "qu"){
        let queue = distube.getQueue(message);
        let curqueue = queue.songs.map((song, id) =>
        `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).join("\n");
        return  embedbuilder(client, message, "GREEN", "Current Queue!", curqueue)
    }
    if (command === "loop" || command === "repeat"){
        if(0 <= Number(args[0]) && Number(args[0]) <= 2){
            distube.setRepeatMode(message,parseInt(args[0]))
            embedbuilder(client, message, "GREEN", "Repeat mode set to:!", `${args[0].replace("0", "OFF").replace("1", "Repeat song").replace("2", "Repeat Queue")}`)
        }
        else{
            embedbuilder(client, message, "RED", "ERROR", `Please use a number between **0** and **2**   |   *(0: disabled, 1: Repeat a song, 2: Repeat all the queue)*`)
        }
    }
    if ( command === "jump"){
        let queue = distube.getQueue(message);
        if(0 <= Number(args[0]) && Number(args[0]) <= queue.songs.length){
            embedbuilder(client, message, "RED", "ERROR", `Jumped ${parseInt(args[0])} songs!`)
            return distube.jump(message, parseInt(args[0]))
            .catch(err => message.channel.send("Invalid song number."));
        }
        else{
            embedbuilder(client, message, "RED", "ERROR", `Please use a number between **0** and **${DisTube.getQueue(message).length}**   |   *(0: disabled, 1: Repeat a song, 2: Repeat all the queue)*`)
        }

    
    }

})

//queue
const status = (queue) => `Volume: \`${queue.volume}\` | Filter: \`${queue.filter || "OFF"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``
//distube
distube
     .on("playSong", (message, queue, song) => {
        embedbuilder(client, message, "GREEN", "Playing new Song!", `Song: \`${song.name}\`  -  \`${song.formattedDuration}\` \n\nRequested by: ${song.user}\n${status(queue)}`)
     })
     .on("addSong", (message, queue, song) => {
        embedbuilder(client, message, "GREEN", "Added a Song!", `Song: \`${song.name}\`  -  \`${song.formattedDuration}\` \n\nRequested by: ${song.user}`)
     })
     .on("playList", (message, queue, playlist, song) => {
        embedbuilder(client, message, "GREEN", "Playling playlist", `Playlist: \`${playlist.title}\`  -  \`${playlist.total_items} songs\` \n\nRequested by: ${song.user}\n\nstarting playing Song: \`${song.name}\`  -  \`${song.formattedDuration}\`\n${status(queue)}`)
     })
     .on("addList", (message, queue, song) => {
        embedbuilder(client, message, "GREEN", "Added a Playling!", `Playlist: \`${playlist.title}\`  -  \`${playlist.total_items} songs\` \n\nRequested by: ${song.user}`)
     })
     .on("searchResult", (message, result) => {
        let i = 0;
        embedbuilder(client, message, "YELLOW", "", `**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`)
    })
     // DisTubeOptions.searchSongs = true
     .on("searchCancel", (message) =>  embedbuilder(client, message, "RED", `Searching canceled`, "")
     )
     .on("error", (message, err) => embedbuilder(client, message, "RED", "An error encountered:", err)
     )
     

//function embeds
//embedbuilder(client, message, "RED", "TITEL", "DESCRIPTION")
function embedbuilder(client, message, color, title, description){
    let embed = new Discord.MessageEmbed()
    .setColor(color)
    .setFooter(client.user.username, client.user.displayAvatarURL());
    if(title) embed.setTitle(title);
    if(description) embed.setDescription(description);
    return message.channel.send(embed);
}
