import { useEffect } from "react";
import { socket } from "../lib/socket";
import type { MemberPlates } from "../types/plate";

interface UseSocketParams {
  roomId: string | undefined;
  userId: string | null;
  onSync: (members: MemberPlates[]) => void;
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
    socket.on("sync", onSync);

    return () => {
      socket.off("sync", onSync);
    };
  }, [onSync]);
};

export const emitCount = (roomId: string | undefined, userId: string, color: string, remove?: boolean) => {
  if (!roomId) return;
  socket.emit("count", { roomId, userId, color, ...(remove ? { remove } : {}) });
};
