import { Client, Guild } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { config } from "./config";
import { commands } from "./commands";
import { Events } from "discord.js";
import { createServer, deleteServer, getServers } from "./lib/supabase/server";

// handle server discrepancies
const handleServerDiscrepancies = async (actualServers: string[]) => {
  // get server records
  const servers = await getServers();

  // remove every server that the bot is no longer in
  for (const server of servers) {
    if (!actualServers.includes(server.id.toString())) {
      await deleteServer(server.id);
    }
  }
};

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

// on bot online
client.once(Events.ClientReady, () => {
  console.log("Discord bot is ready! 🤖");

  const currentGuilds = client.guilds.cache.map((guild) => guild.id);

  handleServerDiscrepancies(currentGuilds);
});

// on bot joining server
client.on(Events.GuildCreate, async (guild) => {
  await deployCommands({ guildId: guild.id });

  // insert Server record into Server table
  await createServer(guild);
});

// on guild being deleted
client.on(Events.GuildDelete, async (guild) => {
  // delete Server record from Server table
  deleteServer(guild.id);
});

// on interaction creation
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;

  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  } else {
    interaction.reply("There was an error finding the command to execute.");
  }
});

// every 10 minutes remove guilds that bot is no longer in
setInterval(() => {
  console.log("Checking servers...");
  const currentGuilds = client.guilds.cache.map((guild) => guild.id);

  handleServerDiscrepancies(currentGuilds);
}, 600000);

client.login(config.DISCORD_TOKEN);
