import { generateShareUrl } from "@/util/utils";
import { it, expect } from "vitest";

it("会計結果共有URL生成処理", () => {
  const url = generateShareUrl("http://localhost:3000", "share-url");

  expect(url).toBe("http://localhost:3000/new-sushi/group/share-url/result");
});
