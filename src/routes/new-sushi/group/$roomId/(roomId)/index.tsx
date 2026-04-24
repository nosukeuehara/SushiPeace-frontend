import { useParams } from "@tanstack/react-router";
import { useRoom } from "@/hooks/useRoom";
import { useGroupRoomActions } from "@/hooks/useGroupRoomActions";
import { useEffect, useRef, useState } from "react";
import { usePaymentNotice } from "@/hooks/usePaymentNotice";
import type { MemberPlates, PlateTemplate } from "@/types/plate";
import { useSocketSync } from "@/hooks/useSocketSync";
import { AsyncState } from "@/components/states/AsyncState";
import { RoomPageContent } from "@/components/page/roomPage/RoomPageContent";
import { updateRoomHistory } from "@/util/roomHistory";
import NoDataState from "@/components/states/NoDataState";

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

  // 初回取得時に整形済みの RoomData で state を初期化する
  useEffect(() => {
    const data = roomQuery.data;
    if (!data || !safeRoomId) return;

    // 同じ room に対して毎回上書きしない
    if (initializedRoomIdRef.current === safeRoomId) return;

    setMembers(data.members ?? []);
    setTemplate(data.template);
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

  // roomId とデータが揃ったら履歴を更新
  useEffect(() => {
    if (roomQuery.data && safeRoomId) {
      updateRoomHistory(safeRoomId, roomQuery.data.groupName, roomQuery.data.createdAt);
    }
  }, [roomQuery.data, safeRoomId]);

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

  if (!template) {
    return (
      <NoDataState
        className={"mx-auto max-w-xl min-h-screen pt-[20%]"}
        message="お皿の情報が存在しません"
      />
    );
  }

  return (
    <AsyncState
      query={roomQuery}
      render={(data) => (
        <RoomPageContent
          data={data}
          template={template}
          userId={userId}
          members={members}
          setMembers={setMembers}
          onSelectUser={onSelectUser}
          rankNotifications={rankNotifications}
          safeRoomId={safeRoomId}
          onChangeUser={onChangeUser}
          total={total}
          handleUpdateTemplate={handleUpdateTemplate}
          handleAdd={handleAdd}
          handleRemove={handleRemove}
        />
      )}
    />
  );
}
