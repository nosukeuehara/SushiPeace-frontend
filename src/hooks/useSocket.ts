import { useEffect } from "react";
import { socket } from "@/lib/socket";
import type { MemberPlates } from "@/types";

type SyncMeta = { sourceUserId?: string; sourceSeq?: number };

type UseSocketParams = {
  roomId: string;
  userId: string | null;
  onSync: (
    members: MemberPlates[],
    templateData: Record<string, number> | null,
    meta?: SyncMeta,
  ) => void;
};

export const useSocket = ({ roomId, onSync }: UseSocketParams) => {
  useEffect(() => {
    if (!roomId) return;

    const handleSync = (payload: {
      members: MemberPlates[];
      templateData: Record<string, number> | null;
      meta?: { sourceUserId?: string; sourceSeq?: number };
    }) => {
      onSync(payload.members, payload.templateData, payload.meta);
    };

    if (!socket.connected) {
      socket.connect();
    }

    socket.off("sync", handleSync);
    socket.on("sync", handleSync);

    socket.emit("join", { roomId }, (response: { ok: boolean }) => {
      if (response?.ok) {
        console.log("Joined room:", roomId);
      } else {
        console.error("Failed to join room:", roomId);
      }
    });

    return () => {
      socket.off("sync", handleSync);
    };
  }, [roomId, onSync]);
};

export const emitCount = (
  roomId: string | undefined,
  userId: string,
  label: string,
  delta: number,
  seq: number,
) => {
  if (!roomId) return;
  socket.emit("count", { roomId, userId, label, delta, seq });
};

export const emitTemplateUpdate = (roomId: string | undefined, prices: Record<string, number>) => {
  if (!roomId) return;
  socket.emit("updateTemplate", { roomId, prices });
};
