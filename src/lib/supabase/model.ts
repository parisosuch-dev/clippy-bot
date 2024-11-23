export interface Server {
  id: number;
  joined_at: Date;
}

export interface Message {
  id: number;
  clipped_at: Date;
  user_id: number;
  guild_id: number;
  channel_id: number;
  context: string;
  created_at: Date;
}
