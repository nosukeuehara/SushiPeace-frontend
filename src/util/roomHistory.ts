import type { RoomHistory } from "@/types";

const ROOM_HISTORY_KEY = "sushi-room-history";

export function readRoomHistories(): Array<RoomHistory> {
  const raw = localStorage.getItem(ROOM_HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveRoomHistories(histories: Array<RoomHistory>) {
  localStorage.setItem(ROOM_HISTORY_KEY, JSON.stringify(histories));
}

export function upsertRoomHistory(
  histories: RoomHistory[],
  roomId: string,
  groupName: string,
  createdAt: string,
  now: string,
): RoomHistory[] {
  return [
    ...histories.filter((h) => h.roomId !== roomId),
    {
      roomId,
      groupName,
      createdAt: new Date(createdAt).toISOString(),
      lastAccessedAt: now,
    },
  ].sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime());
}

export function getRoomHistory(): RoomHistory[] {
  return readRoomHistories();
}

export function removeRoomHistory(roomId: string) {
  const histories = readRoomHistories();
  saveRoomHistories(histories.filter((h) => h.roomId !== roomId));
}

export function updateRoomHistory(
  roomId: string,
  groupName: string,
  createdAt: string,
  now: string,
) {
  const histories = readRoomHistories();
  const updated = upsertRoomHistory(histories, roomId, groupName, createdAt, now);
  saveRoomHistories(updated);
}
