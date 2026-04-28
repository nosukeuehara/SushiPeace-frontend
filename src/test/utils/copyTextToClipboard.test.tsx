import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as util from "@/util/utils";
import CopyTextToClipboadBtn from "@/components/CopyTextToClipboadBtn";
import { afterEach } from "vitest";

describe("「📋 コピーして共有」ボタン押下時の処理", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("ボタン押下でコピー処理が呼ばれる", async () => {
    const user = userEvent.setup();

    const spy = vi.spyOn(util, "copyTextToClipboard").mockResolvedValue();

    render(<CopyTextToClipboadBtn shareText="共有テキスト" />);

    await user.click(screen.getByRole("button", { name: /コピーして共有/ }));

    expect(spy).toHaveBeenCalledWith("共有テキスト");
  });

  it("コピー後にアラートが表示される", async () => {
    const user = userEvent.setup();

    vi.spyOn(util, "copyTextToClipboard").mockResolvedValue();

    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<CopyTextToClipboadBtn shareText="共有テキスト" />);

    await user.click(screen.getByRole("button", { name: /コピーして共有/ }));

    expect(alertSpy).toHaveBeenCalledWith("共有テキストをコピーしました！");
  });
});
