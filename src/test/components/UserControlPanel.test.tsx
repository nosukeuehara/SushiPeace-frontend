import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { UserControlPanel } from "@/components/UserControlPanel";

describe("UserControlPanel", () => {
  it("＋ボタンを押すとonAddが呼ばれる", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const onRemove = vi.fn();

    render(
      <UserControlPanel
        currentUser={{
          userId: "u1",
          name: "のすけ",
          counts: { "200": 2, "300": 1 },
        }}
        prices={{ "200": 200, "300": 300 }}
        onAdd={onAdd}
        onRemove={onRemove}
      />,
    );

    await user.click(screen.getByRole("button", { name: "300円皿を追加" }));

    expect(onAdd).toHaveBeenCalledWith("u1", "300");
  });

  it("ーボタンを押すとonRemoveが呼ばれる", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const onRemove = vi.fn();

    render(
      <UserControlPanel
        currentUser={{
          userId: "u1",
          name: "のすけ",
          counts: { "200": 2 },
        }}
        prices={{ "200": 200 }}
        onAdd={onAdd}
        onRemove={onRemove}
      />,
    );

    await user.click(screen.getByRole("button", { name: "200円皿を削除" }));

    expect(onRemove).toHaveBeenCalledWith("u1", "200");
  });
});
