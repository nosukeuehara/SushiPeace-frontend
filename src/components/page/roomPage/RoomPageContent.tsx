import { BulkPlateModal } from "@/components/modals/BulkPlateModal";
import { EditPlateModal } from "@/components/modals/EditPlateModal";
import { GroupSummary } from "@/components/GroupSummary";
import { MemberList } from "@/components/MemberList";
import { MemberSelector } from "@/components/MemberSelector";
import PlateDataViewer from "@/components/PlateDataViewer";
import { RankNotifications } from "@/components/RankNotifications";
import { ShareReceiptButton } from "@/components/ShareReceiptButton";
import type { MemberPlates, PlateTemplate, RoomData } from "@/types";
import { ActionButtonsRow } from "@/components/common/ActionButtonsRow";
import UserChangeButton from "@/components/UserChangeButton";
import { useState } from "react";
import RankingToggleButton from "@/components/RankingToggleButton";

type RoomContentProps = {
  data: RoomData;
  userId: string | null;
  members: MemberPlates[];
  onSelectUser: (id: string) => void;
  rankNotifications: {
    id: number;
    message: string;
  }[];
  safeRoomId: string;
  onChangeUser: () => void;
  template: PlateTemplate | null;
  total: number;
  setEditingPlate: React.Dispatch<
    React.SetStateAction<{
      originalColor: string;
      price: string;
    } | null>
  >;
  bulkEntries: string[];
  setBulkEntries: React.Dispatch<React.SetStateAction<string[]>>;
  handleUpdateTemplate: (newPrices: Record<string, number>) => void;
  handleAdd: (uid: string, color: string) => void;
  handleRemove: (uid: string, color: string) => void;
  editingPlate: {
    originalColor: string;
    price: string;
  } | null;
};

export const RoomPageContent = (props: RoomContentProps) => {
  const {
    data,
    userId,
    members,
    onSelectUser,
    rankNotifications,
    safeRoomId,
    onChangeUser,
    template,
    total,
    setEditingPlate,
    bulkEntries,
    setBulkEntries,
    handleUpdateTemplate,
    handleAdd,
    handleRemove,
    editingPlate,
  } = props;

  const [showRanking, setShowRanking] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(true);

  if (!userId) {
    return <MemberSelector members={members} onSelectUser={onSelectUser} />;
  }
  return (
    <div className="relative max-w-xl mx-auto min-h-screen px-5 py-16 bg-white">
      {rankNotifications.length > 0 && <RankNotifications notifications={rankNotifications} />}

      <div className="mb-4 text-center">
        <h2 className="text-3xl font-bold text-gray-600">{data?.groupName}</h2>
      </div>

      <ActionButtonsRow>
        <RankingToggleButton showRanking={showRanking} setShowRanking={setShowRanking} />
        <UserChangeButton onChangeUser={onChangeUser} />
      </ActionButtonsRow>

      <GroupSummary
        members={members}
        prices={template?.prices ?? {}}
        showRanking={showRanking}
        total={total}
      />

      <PlateDataViewer
        setShowTemplateEditor={setShowTemplateEditor}
        showTemplateEditor={showTemplateEditor}
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

      <ShareReceiptButton roomId={safeRoomId} />

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
};
