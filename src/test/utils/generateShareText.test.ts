import type { MemberPlates } from "@/types";
import {
  generateShareMemberText,
  generateShareTotalText,
  generateShareText,
} from "@/util/shareText";
import { describe, expect, it } from "vitest";

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

describe("お会計共有テキスト生成テスト", () => {
  it("メンバーの金額の配列から合計金額のテキストを生成する処理", () => {
    const targetText = generateShareTotalText(members);
    expect(targetText).toBe("合計金額：1,600円");
  });

  it("メンバーの金額の配列からメンバーごとの個別会計テキストを生成する処理", () => {
    const targetText = generateShareMemberText(members);
    expect(targetText).toEqual("🍵 のすけ：400円\n🍵 マグロ上原：1,200円");
  });

  it("メンバーの金額の配列から個別会計と合計金額と共有URLを含めた共有用テキストを生成する", () => {
    const GROUP_NAME = "お寿司食べたべーズ";
    const SHARE_URL = "https://example.com";
    const targetText = generateShareText(GROUP_NAME, members, SHARE_URL);

    expect(targetText).toContain("🍣 お寿司食べたべーズの会計");
    expect(targetText).toContain("合計金額：1,600円");
    expect(targetText).toContain("🍵 のすけ：400円");
    expect(targetText).toContain("🍵 マグロ上原：1,200円");
    expect(targetText).toContain("https://example.com");
  });
});
