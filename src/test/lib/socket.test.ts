import type { ISocketClient } from "@/hooks/socket/ISocket";
import { emitCount, useSocket } from "@/hooks/socket/useSocket";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("useSocket", () => {
  it("roomIdがある場合、socketに接続してjoinをemitする", () => {
    const socketClient: ISocketClient = {
      connected: false,
      connect: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    };

    const onSync = vi.fn();

    renderHook(() =>
      useSocket({
        roomId: "room1",
        onSync,
        socketClient,
      }),
    );

    expect(socketClient.connect).toHaveBeenCalled();
    expect(socketClient.on).toHaveBeenCalledWith("sync", expect.any(Function));
    expect(socketClient.emit).toHaveBeenCalledWith(
      "join",
      { roomId: "room1" },
      expect.any(Function),
    );
  });

  it("syncイベントを受け取るとonSyncが呼ばれる", () => {
    const socketClient = {
      connected: false,
      connect: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    };

    const onSync = vi.fn();

    renderHook(() =>
      useSocket({
        roomId: "room1",
        onSync,
        socketClient,
      }),
    );

    const syncHandler = socketClient.on.mock.calls[0][1];

    syncHandler({
      members: [{ userId: "u1", name: "のすけ", counts: { "200": 2 } }],
      templateData: { "200": 200 },
      meta: { sourceUserId: "u1", sourceSeq: 1 },
    });

    expect(onSync).toHaveBeenCalledWith(
      [{ userId: "u1", name: "のすけ", counts: { "200": 2 } }],
      { "200": 200 },
      { sourceUserId: "u1", sourceSeq: 1 },
    );
  });

  it("unmount時にsyncイベントを解除する", () => {
    const socketClient: ISocketClient = {
      connected: false,
      connect: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    };

    const { unmount } = renderHook(() =>
      useSocket({
        roomId: "room1",
        onSync: vi.fn(),
        socketClient,
      }),
    );

    unmount();

    expect(socketClient.off).toHaveBeenCalledWith("sync", expect.any(Function));
  });

  it("countイベントをemitする", () => {
    const socketClient: ISocketClient = {
      connected: false,
      connect: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    };

    emitCount("room1", "u1", "200", 1, 10, socketClient);

    expect(socketClient.emit).toHaveBeenCalledWith("count", {
      roomId: "room1",
      userId: "u1",
      color: "200",
      delta: 1,
      seq: 10,
    });
  });
});
