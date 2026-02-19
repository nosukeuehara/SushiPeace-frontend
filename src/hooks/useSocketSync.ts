import type { MemberPlates, PlateTemplate } from "@/types";
import { useSocket } from "./useSocket";

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
  useSocket({
    roomId,
    userId,
    onSync: (updatedMembers, updatedTemplateData, meta) => {
      if (
        meta?.sourceUserId === userId &&
        typeof meta.sourceSeq === "number" &&
        meta.sourceSeq < lastSentSeqRef.current
      )
        return;

      setMembers(updatedMembers);
      if (updatedTemplateData) setTemplate({ prices: updatedTemplateData });
    },
  });
}
