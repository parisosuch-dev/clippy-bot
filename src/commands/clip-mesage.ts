import {
  MessageContextMenuCommandInteraction,
  ContextMenuCommandBuilder,
  Interaction,
  Message,
} from "discord.js";
import supabaseClient from "../lib/supabase/supabase";
import { createMessage } from "../lib/supabase/message";

const messageExists = async (message: Message) => {
  const { data, error, count } = await supabaseClient
    .from("Message")
    .select("id", { count: "exact" })
    .eq("id", message.id)
    .limit(1);
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

      await createMessage(message);

      interaction.reply({
        content: "The message has been clipped!",
        ephemeral: true,
      });
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
