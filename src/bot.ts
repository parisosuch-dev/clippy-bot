import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { config } from "./config";
import { commands } from "./commands";
import { Events } from "discord.js";
import { createServer } from "./lib/supabase/server";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

// on bot online
client.once(Events.ClientReady, () => {
  console.log("Discord bot is ready! 🤖");

  // add and remove appropriate servers
});

// on bot joining server
client.on(Events.GuildCreate, async (guild) => {
  await deployCommands({ guildId: guild.id });

  // insert Server record into Server table
  await createServer(guild);
});

// on bot leaving server
client.on(Events.GuildDelete, async () => {
  // delete Server record from Server table
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

client.login(config.DISCORD_TOKEN);
