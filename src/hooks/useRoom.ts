import { useQuery } from "@tanstack/react-query";
import type { RoomData } from "@/types";
import { fetchRoom } from "@/service/api";

export const useRoom = (roomId: string | undefined) => {
  return useQuery<RoomData>({
    queryKey: ["room", roomId],
    queryFn: () => fetchRoom(roomId!),
    enabled: !!roomId,
  });
};
