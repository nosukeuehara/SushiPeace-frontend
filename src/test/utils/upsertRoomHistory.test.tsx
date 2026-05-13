import { upsertRoomHistory } from "@/util/roomHistory";
import { describe, expect, it } from "vitest";

describe("upsertRoomHistory", () => {
  // 配列加工ロジック
  it("履歴を追加できる", () => {
    const result = upsertRoomHistory(
      [],
      "room1",
      "寿司会",
      "2026-04-01T00:00:00.000Z",
      "2026-04-02T00:00:00.000Z",
    );

    expect(result).toEqual([
      {
        roomId: "room1",
        groupName: "寿司会",
        createdAt: "2026-04-01T00:00:00.000Z",
        lastAccessedAt: "2026-04-02T00:00:00.000Z",
      },
    ]);
  });

  it("同じroomIdの履歴は重複せず更新される", () => {
    const result = upsertRoomHistory(
      [
        {
          roomId: "room1",
          groupName: "古い寿司会",
          createdAt: "2026-04-01T00:00:00.000Z",
          lastAccessedAt: "2026-04-10T00:00:00.000Z",
        },
      ],
      "room1",
      "新しい寿司会",
      "2026-04-01T00:00:00.000Z",
      "2026-04-02T00:00:00.000Z",
    );

    expect(result).toHaveLength(1);
    expect(result[0].groupName).toBe("新しい寿司会");
    expect(result[0].lastAccessedAt).toBe("2026-04-02T00:00:00.000Z");
  });
});
