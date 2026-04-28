import type { MemberPlates } from "@/types";
import { calcTotal, calcTotalPerMember } from "@/util/utils";
import { describe, expect, it } from "vitest";

describe("calc amount", () => {
  it("（個人）皿の枚数と価格から合計金額を計算できる", () => {
    const member: MemberPlates = {
      userId: "u1",
      name: "のすけ",
      counts: { "200": 2 },
    };
    const result = calcTotalPerMember(member);
    expect(result).toBe(400);
  });

  it("（個人）皿が一枚もない場合は0円になる", () => {
    const member: MemberPlates = {
      userId: "u1",
      name: "のすけ",
      counts: {},
    };
    const result = calcTotalPerMember(member);
    expect(result).toBe(0);
  });

  it("（グループ）皿の枚数と価格から合計金額を計算できる", () => {
    const members: Array<MemberPlates> = [
      {
        userId: "u1",
        name: "のすけ",
        counts: { "200": 2 },
      },
      {
        userId: "u2",
        name: "マグロ上原",
        counts: { "400": 3 },
      },
    ];
    const result = calcTotal(members);
    expect(result).toBe(1600);
  });

  it("（全体）皿が一枚もない場合は0円になる", () => {
    const members: Array<MemberPlates> = [
      {
        userId: "u1",
        name: "のすけ",
        counts: {},
      },
      {
        userId: "u2",
        name: "マグロ上原",
        counts: {},
      },
    ];
    const result = calcTotal(members);
    expect(result).toBe(0);
  });
});
