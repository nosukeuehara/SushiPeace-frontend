import type { MemberPlates } from "@/types";

export type Member = {
  userId: string;
  name: string;
};

export type Room = {
  groupName: string;
  members: Member[];
};

export type RoomData = {
  id: string;
  groupName: string;
  members: MemberPlates[];
  templateData: Record<string, number>;
};

export type RoomHistory = {
  roomId: string;
  groupName: string;
  createdAt: string;
  lastAccessedAt: string;
};
