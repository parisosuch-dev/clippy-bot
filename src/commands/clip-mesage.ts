import {
  MessageContextMenuCommandInteraction,
  ContextMenuCommandBuilder,
  Interaction,
} from "discord.js";

export const data = new ContextMenuCommandBuilder()
  .setName("Clip Message")
  .setType(3);

export async function execute(interaction: Interaction) {
  if (interaction instanceof MessageContextMenuCommandInteraction) {
    // Get the message being right-clicked on
    const message = interaction.targetMessage;

    try {
      // TODO: clip message
      interaction.reply({
        content: "The message has been clipped!",
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Failed to clip the message.",
        ephemeral: true,
      });
    }
  } else {
    throw new Error(
      `Interaction is not a \`MessageContextMenuCommandInteraction\` and is instead ${interaction}`
    );
  }
}
