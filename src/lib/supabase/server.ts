import { Guild } from "discord.js";
import supabaseClient from "./supabase";

export const createServer = async (guild: Guild) => {
  const { data, error } = await supabaseClient.from("Server").insert({
    id: guild.id,
    joined_at: guild.joinedAt,
  });

  if (error) {
    throw new Error(error.message);
  }
};
