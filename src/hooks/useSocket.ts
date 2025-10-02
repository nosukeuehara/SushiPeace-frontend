import { useEffect } from "react";
import { socket } from "../lib/socket";
import type { MemberPlates } from "../types/plate";

interface UseSocketParams {
  roomId: string | undefined;
  userId: string | null;
  onSync: (members: MemberPlates[], templateData: Record<string, number>) => void;
}

export const useSocket = ({ roomId, userId, onSync }: UseSocketParams) => {
  useEffect(() => {
    if (!roomId || !userId) return;
    socket.connect();
    socket.emit("join", { roomId, userId });

    return () => {
      socket.disconnect();
    };
  }, [roomId, userId]);

  useEffect(() => {
    const handleSync = (payload: { members: MemberPlates[]; templateData: Record<string, number> }) => {
      onSync(payload.members, payload.templateData);
    };


    socket.on("sync", handleSync);
    return () => {
      socket.off("sync", handleSync);
    };
  }, [onSync]);
};

export const emitCount = (roomId: string | undefined, userId: string, color: string, remove?: boolean) => {
  if (!roomId) return;
  socket.emit("count", { roomId, userId, color, ...(remove ? { remove } : {}) });
};

export const emitTemplateUpdate = (
  roomId: string | undefined,
  prices: Record<string, number>
) => {
  if (!roomId) return;
  socket.emit("updateTemplate", { roomId, prices });
};

