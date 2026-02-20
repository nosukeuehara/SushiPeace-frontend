import { useParams } from "@tanstack/react-router";
import { useRoom } from "@/hooks/useRoom";
import { useGroupRoomActions } from "@/hooks/useGroupRoomActions";
import { RankNotifications } from "@/components/RankNotifications";
import { EditPlateModal } from "@/components/EditPlateModal";
import { BulkPlateModal } from "@/components/BulkPlateModal";
import { GroupSummary } from "@/components/GroupSummary";
import { MemberList } from "@/components/MemberList";
import { ShareButton } from "@/components/ShareButton";
import { DataState } from "@/components/NoDataState";
import { useRef, useState } from "react";
import { usePaymentNotice } from "@/hooks/usePaymentNotice";
import type { MemberPlates, PlateTemplate } from "@/types/plate";
import { useRoomState } from "@/hooks/useRoomHistory";
import { useSocketSync } from "@/hooks/useSocketSync";
import { SelectUser } from "@/components/SelectUser";
import RankingViewer from "@/components/RankingViewer";
import PlateDataComponent from "@/components/PlateDataComponent";

export const Route = createFileRoute({
  component: RouteComponent,
});

export function RouteComponent() {
  const { roomId } = useParams({ strict: false });
  const userKey = `sushi-user-id-${roomId}`;
  const safeRoomId: string = roomId ?? "";
  const { data, isLoading, error } = useRoom(safeRoomId);
  const [members, setMembers] = useState<MemberPlates[]>([]);
  const [template, setTemplate] = useState<PlateTemplate | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const lastSentSeqRef = useRef(0);
  const { rankNotifications } = usePaymentNotice({ members, template, userId });
  const [showRanking, setShowRanking] = useState(false);
  const [editingPlate, setEditingPlate] = useState<{
    originalColor: string;
    price: string;
  } | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkEntries, setBulkEntries] = useState([""]);
  const [isTemplateEditorOpen, setIsTemplateEditorOpen] = useState(true);
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

  useRoomState(safeRoomId, data);
  useSocketSync({
    roomId: safeRoomId,
    userId,
    setMembers,
    setTemplate,
    lastSentSeqRef,
  });

  const content = !userId ? (
    <SelectUser
      members={members}
      onSelectUser={(id) => {
        setUserId(id);
        handleSelectUser(id);
      }}
    />
  ) : (
    <div className="relative max-w-xl mx-auto min-h-screen px-5 py-16 bg-white">
      {rankNotifications.length > 0 && <RankNotifications notifications={rankNotifications} />}

      <div className="mb-4 text-center">
        <h2 className="text-3xl font-bold text-gray-600">{data?.groupName}</h2>
      </div>

      <RankingViewer
        showRanking={showRanking}
        setShowRanking={setShowRanking}
        roomId={safeRoomId}
        setUserId={setUserId}
      />

      <GroupSummary
        members={members}
        prices={template?.prices ?? {}}
        showRanking={showRanking}
        total={total}
      />

      <PlateDataComponent
        setIsTemplateEditorOpen={setIsTemplateEditorOpen}
        isTemplateEditorOpen={isTemplateEditorOpen}
        template={template}
        setEditingPlate={setEditingPlate}
        handleUpdateTemplate={handleUpdateTemplate}
        setShowBulkModal={setShowBulkModal}
      />

      <MemberList
        members={members}
        currentUserId={userId}
        prices={template?.prices ?? {}}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />

      <ShareButton roomId={safeRoomId} />

      {editingPlate && (
        <EditPlateModal
          price={String(editingPlate.price)}
          onChange={(newPrice) => setEditingPlate({ ...editingPlate, price: newPrice })}
          onSave={() => {
            const updated = { ...template!.prices };
            const oldColor = editingPlate.originalColor;
            const newColor = `${editingPlate.price}円皿`;
            delete updated[oldColor];
            updated[newColor] = Number(editingPlate.price);
            handleUpdateTemplate(updated);
            setEditingPlate(null);
          }}
          onCancel={() => setEditingPlate(null)}
        />
      )}

      {showBulkModal && (
        <BulkPlateModal
          entries={bulkEntries}
          onChange={setBulkEntries}
          onAddRow={() => setBulkEntries([...bulkEntries, ""])}
          onSave={() => {
            const updated = { ...template?.prices };
            bulkEntries.forEach((price) => {
              if (Number(price) > 0) {
                const color = `${price}円皿`;
                updated[color] = Number(price);
              }
            });
            handleUpdateTemplate(updated);
            setShowBulkModal(false);
            setBulkEntries([""]);
          }}
          onCancel={() => setShowBulkModal(false)}
        />
      )}
    </div>
  );

  return (
    <DataState isLoading={isLoading} error={error} data={data}>
      {content}
    </DataState>
  );
}
