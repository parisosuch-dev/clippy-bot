import {
  MessageContextMenuCommandInteraction,
  ContextMenuCommandBuilder,
  Interaction,
} from "discord.js";
import supabaseClient from "../lib/supabase/supabase";

export const data = new ContextMenuCommandBuilder()
  .setName("Clip Message")
  .setType(3);

export async function execute(interaction: Interaction) {
  if (interaction instanceof MessageContextMenuCommandInteraction) {
    // Get the message being right-clicked on
    const message = interaction.targetMessage;

    try {
      // TODO: check if message already exists in db

      // TODO: clip message

      const { data, error } = await supabaseClient.from("Message").insert({
        id: parseInt(message.id),
        user_id: parseInt(message.author.id),
        guild_id: parseInt(message.guild!.id),
        channel_id: parseInt(message.channel.id),
        created_at: message.createdAt.toISOString(),
        content: message.content,
      });

      if (error) {
        interaction.reply({ content: error.message, ephemeral: true });
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
