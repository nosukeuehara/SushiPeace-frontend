import type { MemberPlates } from "@/types";
import { calcTotal } from "@/util/utils";
import { describe, expect, it } from "vitest";

describe("calc amount", () => {
  it("皿の枚数と価格から合計金額を計算できる", () => {
    const member: MemberPlates = {
      userId: "u1",
      name: "のすけ",
      counts: { "200": 2 },
    };
    const result = calcTotal(member);
    expect(result).toBe(400);
  });

  it("皿が一枚もない場合は0円になる", () => {
    const member: MemberPlates = {
      userId: "u1",
      name: "のすけ",
      counts: {},
    };
    const result = calcTotal(member);
    expect(result).toBe(0);
  });
});
