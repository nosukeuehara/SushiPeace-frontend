import { useEffect } from "react";
import type { MemberPlates } from "@/types";
import type { ISocketClient } from "./ISocket";
import { socket as defaultSocket } from "@/lib/socket";

type SyncMeta = { sourceUserId?: string; sourceSeq?: number };

type UseSocketParams = {
  roomId: string;
  onSync: (
    members: MemberPlates[],
    templateData: Record<string, number> | null,
    meta?: SyncMeta,
  ) => void;
  socketClient?: ISocketClient;
};

export const useSocket = ({ roomId, onSync, socketClient = defaultSocket }: UseSocketParams) => {
  useEffect(() => {
    if (!roomId) return;

    const handleSync = (payload: {
      members: MemberPlates[];
      templateData: Record<string, number> | null;
      meta?: { sourceUserId?: string; sourceSeq?: number };
    }) => {
      onSync(payload.members, payload.templateData, payload.meta);
    };

    if (!socketClient.connected) {
      socketClient.connect();
    }

    socketClient.off("sync", handleSync);
    socketClient.on("sync", handleSync);

    socketClient.emit("join", { roomId }, (response: { ok: boolean }) => {
      if (response?.ok) {
        console.log("Joined room:", roomId);
      } else {
        console.error("Failed to join room:", roomId);
      }
    });

    return () => {
      socketClient.off("sync", handleSync);
    };
  }, [roomId, onSync, socketClient]);
};

export const emitCount = (
  roomId: string | undefined,
  userId: string,
  color: string,
  delta: number,
  seq: number,
  socketClient: ISocketClient = defaultSocket,
) => {
  if (!roomId) return;
  socketClient.emit("count", { roomId, userId, color, delta, seq });
};

export const emitTemplateUpdate = (
  roomId: string | undefined,
  prices: Record<string, number>,
  socketClient = defaultSocket,
) => {
  if (!roomId) return;
  socketClient.emit("updateTemplate", { roomId, prices });
};
