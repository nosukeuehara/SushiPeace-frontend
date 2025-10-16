import {useEffect, useState} from "react";
import {socket} from "@/lib/socket";
import type {MemberPlates} from "@/types";

interface UseSocketParams {
  roomId: string | undefined;
  userId: string | null;
  onSync: (
    members: MemberPlates[],
    templateData: Record<string, number>
  ) => void;
}

export const useSocket = ({roomId, userId, onSync}: UseSocketParams) => {
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (!roomId || !userId) return;

    socket.connect();

    socket.emit("join", {roomId, userId}, (response: {ok: boolean}) => {
      if (response?.ok) {
        console.log("Joined room:", roomId);
        setIsJoined(true);
      } else {
        console.error("Failed to join room:", roomId);
      }
    });

    return () => {
      socket.disconnect();
      setIsJoined(false);
    };
  }, [roomId, userId]);

  // join完了後のみsyncイベントを購読
  useEffect(() => {
    if (!isJoined) return;

    const handleSync = (payload: {
      members: MemberPlates[];
      templateData: Record<string, number>;
    }) => {
      onSync(payload.members, payload.templateData);
    };

    socket.on("sync", handleSync);

    // 二重に購読されないようにクリーンアップ
    // 依存配列が変化したときと使用する側のコンポーネントがunmountされるとき実行
    return () => {
      socket.off("sync", handleSync);
    };
  }, [isJoined, onSync]);
};

export const emitCount = (
  roomId: string | undefined,
  userId: string,
  color: string,
  remove?: boolean
) => {
  if (!roomId) return;
  socket.emit("count", {roomId, userId, color, ...(remove ? {remove} : {})});
};

export const emitTemplateUpdate = (
  roomId: string | undefined,
  prices: Record<string, number>
) => {
  if (!roomId) return;
  socket.emit("updateTemplate", {roomId, prices});
};
