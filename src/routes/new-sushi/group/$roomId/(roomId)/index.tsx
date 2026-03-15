import { useParams } from "@tanstack/react-router";
import { useRoom } from "@/hooks/useRoom";
import { useGroupRoomActions } from "@/hooks/useGroupRoomActions";
import { useEffect, useRef, useState } from "react";
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
  const safeRoomId = roomId ?? "";
  const userKey = `sushi-user-id-${safeRoomId}`;

  const roomQuery = useRoom(safeRoomId);

  const [members, setMembers] = useState<MemberPlates[]>([]);
  const [template, setTemplate] = useState<PlateTemplate | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const lastSentSeqRef = useRef(0);
  const initializedRoomIdRef = useRef<string | null>(null);

  // 初回取得時に HTTP レスポンスで state を埋める
  useEffect(() => {
    const data = roomQuery.data;
    if (!data || !safeRoomId) return;

    // 同じ room に対して毎回上書きしない
    if (initializedRoomIdRef.current === safeRoomId) return;

    setMembers(data.members ?? []);
    setTemplate({ prices: data.templateData ?? {} });
    initializedRoomIdRef.current = safeRoomId;
  }, [roomQuery.data, safeRoomId]);

  // room が変わったら初期化フラグを戻す
  useEffect(() => {
    initializedRoomIdRef.current = null;
    setMembers([]);
    setTemplate(null);
    setUserId(null);
    lastSentSeqRef.current = 0;
  }, [safeRoomId]);

  useRoomState(safeRoomId, roomQuery.data);

  useSocketSync({
    roomId: safeRoomId,
    userId,
    setMembers,
    setTemplate,
    lastSentSeqRef,
  });

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

  const { rankNotifications } = usePaymentNotice({ members, template, userId });

  const onSelectUser = (id: string) => {
    handleSelectUser(id);
  };

  const onChangeUser = () => {
    localStorage.removeItem(userKey);
    setUserId(null);
  };

  return (
    <AsyncState query={roomQuery}>
      {(data) => (
        <RoomPageContent
          data={data}
          userId={userId}
          members={members}
          setMembers={setMembers}
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
