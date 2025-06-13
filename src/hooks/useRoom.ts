import { useQuery } from '@tanstack/react-query';

export const useRoom = (roomId: string | undefined) => {
  return useQuery({
    queryKey: ['room', roomId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3000/api/room/${roomId}`);
      if (!res.ok) throw new Error('ルーム情報の取得に失敗しました');
      return res.json();
    },
    enabled: !!roomId
  });
};
