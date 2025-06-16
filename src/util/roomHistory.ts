import type { RoomHistory } from "../types/room";

export function removeRoomHistory(roomId: string) {
  const key = "sushi-room-history";
  const raw = localStorage.getItem(key);
  const history: RoomHistory[] = raw ? JSON.parse(raw) : [];
  const updated = history.filter((h) => h.roomId !== roomId);
  localStorage.setItem(key, JSON.stringify(updated));
}

export function getRoomHistory(): RoomHistory[] {
  const key = "sushi-room-history";
  const raw = localStorage.getItem(key);
  console.log("getRoomHistory", raw);
  return raw ? JSON.parse(raw) : [];
}

export function updateRoomHistory(roomId: string, groupName: string, createdAt: string) {
  const key = "sushi-room-history";
  const raw = localStorage.getItem(key);
  const history: RoomHistory[] = raw ? JSON.parse(raw) : [];

  const now = new Date().toISOString();

  const updated = [
    ...history.filter((h) => h.roomId !== roomId),
    {
      roomId,
      groupName,
      createdAt: new Date(createdAt).toISOString(),
      lastAccessedAt: now,
    },
  ];

  updated.sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime());

  localStorage.setItem(key, JSON.stringify(updated));
}