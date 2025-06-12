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

export const createRoom = async (payload: CreateRoomPayload): Promise<CreateRoomResponse> => {
  const res = await fetch('http://localhost:3000/api/room', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`ルーム作成失敗: ${res.status} ${errorText}`);
  }

  return res.json();
};
