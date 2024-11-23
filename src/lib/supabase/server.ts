import { Guild } from "discord.js";
import supabaseClient from "./supabase";
import { Server } from "./model";

export const createServer = async (guild: Guild) => {
  const { data, error } = await supabaseClient.from("Server").insert({
    id: guild.id,
    joined_at: guild.joinedAt,
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const getServers = async (): Promise<Server[]> => {
  const { data, error } = await supabaseClient.from("Server").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data as Server[];
};
