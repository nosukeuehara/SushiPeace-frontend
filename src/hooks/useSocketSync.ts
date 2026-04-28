import { useCallback } from "react";
import type { MemberPlates, PlateTemplate } from "@/types";
import { useSocket } from "./socket/useSocket";

export function useSocketSync({
  roomId,
  userId,
  setMembers,
  setTemplate,
  lastSentSeqRef,
}: {
  roomId: string;
  userId: string | null;
  setMembers: React.Dispatch<React.SetStateAction<MemberPlates[]>>;
  setTemplate: React.Dispatch<React.SetStateAction<PlateTemplate | null>>;
  lastSentSeqRef: React.RefObject<number>;
}) {
  const handleSync = useCallback(
    (
      updatedMembers: MemberPlates[],
      updatedTemplateData: Record<string, number> | null,
      meta?: { sourceUserId?: string; sourceSeq?: number },
    ) => {
      if (
        meta?.sourceUserId === userId &&
        typeof meta.sourceSeq === "number" &&
        meta.sourceSeq < lastSentSeqRef.current
      ) {
        return;
      }

      setMembers(updatedMembers);
      if (updatedTemplateData) {
        setTemplate({ prices: updatedTemplateData });
      }
    },
    [userId, setMembers, setTemplate, lastSentSeqRef],
  );

  useSocket({
    roomId,
    onSync: handleSync,
  });
}
