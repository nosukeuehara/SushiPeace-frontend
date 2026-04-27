import {
  saveRoomHistories,
  readRoomHistories,
  removeRoomHistory,
  updateRoomHistory,
} from "@/util/roomHistory";
import { beforeEach, describe, expect, it } from "vitest";

describe("roomHistory storage", () => {
  // read/save/remove/update のlocalStorage絡み
  beforeEach(() => {
    localStorage.clear();
  });

  it("履歴を保存して読み込める", () => {
    saveRoomHistories([
      {
        roomId: "room1",
        groupName: "寿司会",
        createdAt: "2026-04-01T00:00:00.000Z",
        lastAccessedAt: "2026-04-25T00:00:00.000Z",
      },
    ]);

    expect(readRoomHistories()).toEqual([
      {
        roomId: "room1",
        groupName: "寿司会",
        createdAt: "2026-04-01T00:00:00.000Z",
        lastAccessedAt: "2026-04-25T00:00:00.000Z",
      },
    ]);
  });

  it("指定したroomIdの履歴を削除できる", () => {
    saveRoomHistories([
      {
        roomId: "room1",
        groupName: "寿司会1",
        createdAt: "2026-04-01T00:00:00.000Z",
        lastAccessedAt: "2026-04-25T00:00:00.000Z",
      },
      {
        roomId: "room2",
        groupName: "寿司会2",
        createdAt: "2026-04-02T00:00:00.000Z",
        lastAccessedAt: "2026-04-25T00:00:00.000Z",
      },
    ]);

    removeRoomHistory("room1");

    expect(readRoomHistories()).toEqual([
      {
        roomId: "room2",
        groupName: "寿司会2",
        createdAt: "2026-04-02T00:00:00.000Z",
        lastAccessedAt: "2026-04-25T00:00:00.000Z",
      },
    ]);
  });

  it("履歴を追加してlocalStorageに保存できる", () => {
    const now = new Date().toISOString();
    updateRoomHistory("room2", "寿司会2", "2026-04-02T00:00:00.000Z", now);

    expect(readRoomHistories()).toEqual([
      {
        roomId: "room2",
        groupName: "寿司会2",
        createdAt: "2026-04-02T00:00:00.000Z",
        lastAccessedAt: now,
      },
    ]);
  });
});
