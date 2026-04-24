import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithRouter } from "./utils/DummyRouter";

describe("room create route", () => {
  it("ルーム作成ページが表示される", async () => {
    renderWithRouter("/new-sushi");

    // ローディング後に表示されるテキストを待つ
    const pageHeading = await screen.findByRole("heading", { name: /寿司ルーム作成/ });
    expect(pageHeading).toBeInTheDocument();

    expect(screen.getByLabelText(/ルーム名/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/メンバー名/)).toBeInTheDocument();
  });
});
