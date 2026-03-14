import { useParams } from "@tanstack/react-router";
import { useRoom } from "@/hooks/useRoom";
import { useGroupRoomActions } from "@/hooks/useGroupRoomActions";
import { useRef, useState } from "react";
import { usePaymentNotice } from "@/hooks/usePaymentNotice";
import type { MemberPlates, PlateTemplate } from "@/types/plate";
import { useRoomState } from "@/hooks/useRoomHistory";
import { useSocketSync } from "@/hooks/useSocketSync";
import { AsyncState } from "@/components/states/AsyncState";
import { RoomPageContent } from "@/components/page/roomPage/RoomPageContent";

export const Route = createFileRoute({
  component: RouteComponent,
});

export function RouteComponent() {
  const { roomId } = useParams({ strict: false });
  const userKey = `sushi-user-id-${roomId}`;
  const safeRoomId: string = roomId ?? "";
  const roomQuery = useRoom(safeRoomId);
  const [members, setMembers] = useState<MemberPlates[]>([]);
  // TODO(優先度:高) テンプレートのキーが 100円皿 のようにテキストが含まれているため
  // データ更新時に「円皿」と「円 皿」で同じvalueをもつ二つのデータができてしまう
  const [template, setTemplate] = useState<PlateTemplate | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const lastSentSeqRef = useRef(0);
  const { rankNotifications } = usePaymentNotice({ members, template, userId });

  const { total, handleSelectUser, handleAdd, handleRemove, handleUpdateTemplate } =
    useGroupRoomActions(
      userKey,
      safeRoomId,
      members,
      template,
      setUserId,
      setMembers,
      setTemplate,
      lastSentSeqRef,
    );

  useRoomState(safeRoomId, roomQuery.data);

  useSocketSync({
    roomId: safeRoomId,
    userId,
    setMembers,
    setTemplate,
    lastSentSeqRef,
  });

  const onSelectUser = (id: string) => {
    handleSelectUser(id);
  };

  const onChangeUser = () => {
    localStorage.removeItem(`sushi-user-id-${roomId}`);
    setUserId(null);
  };

  return (
    <AsyncState query={roomQuery}>
      {(data) => (
        <RoomPageContent
          data={data}
          userId={userId}
          members={members}
          onSelectUser={onSelectUser}
          rankNotifications={rankNotifications}
          safeRoomId={safeRoomId}
          onChangeUser={onChangeUser}
          template={template}
          total={total}
          handleUpdateTemplate={handleUpdateTemplate}
          handleAdd={handleAdd}
          handleRemove={handleRemove}
        />
      )}
    </AsyncState>
  );
}
