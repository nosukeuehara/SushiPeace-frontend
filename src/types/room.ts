import type { MemberPlates } from "./plate";

export type Member = {
  userId: string;
  name: string;
};

export type Room = {
  groupName: string;
  members: Member[];
};

export type RoomData = {
  groupName: string;
  members: MemberPlates[];
  templateId: string;
  createdAt: string;
};