import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Wrapper from "./utils/Wrapper";
import { describe, expect, test } from "vitest";
import { Home } from "@/routes";

describe("Hoge Unit Test", () => {
  test("example", async () => {
    render(<Home />, { wrapper: Wrapper });
    expect(
      await screen.findByRole("heading", {
        name: /自分の皿は\s*自分で管理運営/,
      }),
    ).toBeInTheDocument();
  });
});
