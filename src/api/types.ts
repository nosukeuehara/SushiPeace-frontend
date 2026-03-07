export type Member = {
  userId: string;
  name: string;
};

export type CreateRoomPayload = {
  groupName: string;
  members: Member[];
};

export type CreateRoomResponse = {
  roomId: string;
  shareUrl: string;
};
