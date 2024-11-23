export interface Server {
  id: string;
  joined_at: Date;
}

export interface Message {
  id: string;
  clipped_at: Date;
  user_id: string;
  guild_id: string;
  channel_id: string;
  context: string;
  created_at: Date;
}
