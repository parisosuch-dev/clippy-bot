const {
  MessageContextMenuCommandInteraction,
  ContextMenuCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder().setName("Clip Message").setType(3),

  async execute(interaction) {
    if (interaction instanceof MessageContextMenuCommandInteraction) {
      // Get the message being right-clicked on
      const message = interaction.targetMessage;
      console.log(message.content);

      try {
        // Pin the message
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
  },
};
