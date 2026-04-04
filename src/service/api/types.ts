import type { MemberPlates } from "@/types";

export interface Member {
  userId: string;
  name: string;
}

export interface CreateRoomPayload {
  groupName: string;
  members: Member[];
}

export interface CreateRoomResponse {
  roomId: string;
  shareUrl: string;
}

export type RoomResponse = {
  roomId: string;
  groupName: string;
  createdAt: string;
  members: MemberPlates[];
  templateData?: Record<string, number>;
};
