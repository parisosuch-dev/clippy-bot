import { Message } from "discord.js";
import supabaseClient from "./supabase";

export const createMessage = async (message: Message) => {
  const { data, error } = await supabaseClient.from("Message").insert({
    id: message.id,
    user_id: message.author.id,
    guild_id: message.guild!.id,
    channel_id: message.channel.id,
    created_at: message.createdAt.toISOString(),
    content: message.content,
  });

  if (error) {
    throw new Error(error.message);
  }
};
