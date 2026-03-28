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
