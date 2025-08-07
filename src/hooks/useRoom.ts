import { useQuery } from '@tanstack/react-query';
import type { RoomData } from '../types/room';

export const useRoom = (roomId: string | undefined) => {
  return useQuery<RoomData>({
    queryKey: ["room", roomId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3000/api/room/${roomId}`);
      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody?.error || "ルーム情報の取得に失敗しました");
      }
      const raw = await res.json();
      const template = raw.template ?? {
        id: raw.templateId ?? "custom",
        name: "カスタムテンプレート",
        prices: raw.templateData ?? {},
      };
      return {
        ...raw,
        template,
      };
    },
    enabled: !!roomId,
  });
};