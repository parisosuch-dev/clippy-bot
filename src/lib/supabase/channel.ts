import supabaseClient from "./supabase";
import { Channel } from "./model";
import { TextChannel } from "discord.js";

export const createChannel = async (channel: TextChannel) => {
  const { data, error } = await supabaseClient.from("Server").insert({
    id: channel.id,
    server_id: channel.guild.id,
    name: channel.name,
  });

  if (error) {
    throw new Error(error.message);
  }
};
