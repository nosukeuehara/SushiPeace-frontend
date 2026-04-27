import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithRouter } from "../router/DummyRouter";

describe("login route", () => {
  it("トップページが表示される", async () => {
    renderWithRouter("/");

    expect(
      await screen.findByRole("heading", { name: /自分の皿は\s*自分で管理運営/ }),
    ).toBeInTheDocument();
  });
});
