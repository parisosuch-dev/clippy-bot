import supabaseClient from "./supabase";
import { TextChannel } from "discord.js";

export const createChannel = async (channel: TextChannel) => {
  const { data, error } = await supabaseClient.from("Channel").insert({
    id: channel.id,
    server_id: channel.guild.id,
    name: channel.name,
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const updateChannelName = async (id: string, name: string) => {
  const { data, error } = await supabaseClient
    .from("Channel")
    .update({ name: name })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};
