import {
  MessageContextMenuCommandInteraction,
  ContextMenuCommandBuilder,
  Interaction,
  Message,
} from "discord.js";
import supabaseClient from "../lib/supabase/supabase";

const messageExists = async (message: Message) => {
  const { data, error, count } = await supabaseClient
    .from("Message") // The name of your table
    .select("id", { count: "exact" }) // Select 'id' to check existence, count results
    .eq("id", parseInt(message.id)) // Match the 'id' column with the provided message.id
    .limit(1); // Limit the query to 1 row for efficiency

  if (error) {
    throw new Error(`Error checking if message exists: ${error.message}`);
  }
  if (count === 0) {
    return false;
  }
  return true;
};

export const data = new ContextMenuCommandBuilder()
  .setName("Clip Message")
  .setType(3);

export async function execute(interaction: Interaction) {
  if (interaction instanceof MessageContextMenuCommandInteraction) {
    // Get the message being right-clicked on
    const message = interaction.targetMessage;

    if (message.attachments.size > 0) {
      interaction.reply({
        content: "Clipping messages with attachments is not supported yet.",
        ephemeral: true,
      });
      return;
    }

    try {
      const exists = await messageExists(message);

      if (exists) {
        interaction.reply({
          content: "Message is already clipped.",
          ephemeral: true,
        });
        return;
      }

      const { data, error } = await supabaseClient.from("Message").insert({
        id: parseInt(message.id),
        user_id: parseInt(message.author.id),
        guild_id: parseInt(message.guild!.id),
        channel_id: parseInt(message.channel.id),
        created_at: message.createdAt.toISOString(),
        content: message.content,
      });

      if (error) {
        interaction.reply({
          content: `Database Error: ${error.message}`,
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: "The message has been clipped!",
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Failed to clip the message due to unknown error.",
        ephemeral: true,
      });
    }
  } else {
    throw new Error(
      `Interaction is not a \`MessageContextMenuCommandInteraction\` and is instead ${interaction}`
    );
  }
}
