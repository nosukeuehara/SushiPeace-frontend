import type { RoomData } from "@/types";
import { updateRoomHistory } from "@/util/roomHistory";
import { useEffect } from "react";

export const useRoomState = (roomId: string | null, data: RoomData | undefined) => {
  useEffect(() => {
    if (data && roomId) {
      updateRoomHistory(roomId, data.groupName, data.createdAt);
    }
  }, [data, roomId]);
};
