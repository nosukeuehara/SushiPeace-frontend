import type { MemberPlates, PlateTemplate } from "@/types";

export type RoomData = {
  roomId: string;
  groupName: string;
  createdAt: string;
  members: MemberPlates[];
  template: PlateTemplate;
};
