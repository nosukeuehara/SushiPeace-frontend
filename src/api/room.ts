export type Member = {
  userId: string;
  name: string;
};

export type CreateRoomPayload = {
  groupName: string;
  members: Member[];
  templateId: string
};

export type CreateRoomResponse = {
  roomId: string;
  shareUrl: string;
};

import type { MemberPlates } from "../types/plate";

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

export const fetchRoom = async (roomId: string): Promise<CreateRoomResponse> => {
  const res = await fetch(`http://localhost:3000/api/room/${roomId}`);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`ルーム取得失敗: ${res.status} ${errorText}`);
  }

  return res.json();
}

export const updateRoomCounts = async (
  roomId: string,
  members: MemberPlates[]
) => {
  const res = await fetch(`http://localhost:3000/api/room/${roomId}/counts`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ members }),
  });
  if (!res.ok) throw new Error("カウントの更新に失敗しました");
  return res.json();
};
