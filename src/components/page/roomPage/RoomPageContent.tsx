import { BulkPlateModal } from "@/components/modals/BulkPlateModal";
import { EditPlateModal } from "@/components/modals/EditPlateModal";
import { GroupSummary } from "@/components/GroupSummary";
import { MemberList } from "@/components/MemberList";
import { MemberSelector } from "@/components/MemberSelector";
import { PlateEditContainer } from "@/components/PlateEditContainer";
import { RankNotifications } from "@/components/RankNotifications";
import { ShareReceiptButton } from "@/components/ShareReceiptButton";
import type { MemberPlates, PlateTemplate, RoomData } from "@/types";
import { ActionButtonsRow } from "@/components/common/ActionButtonsRow";
import UserChangeButton from "@/components/UserChangeButton";
import { useState } from "react";
import RankingToggleButton from "@/components/RankingToggleButton";
import { PlateEditorToggleButton } from "@/components/PlateEditorToggleButton";
import { RequireReloadPage } from "../errorPage/RequireReloadPage";

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
  bulkEntries: string[];
  setBulkEntries: React.Dispatch<React.SetStateAction<string[]>>;
  handleUpdateTemplate: (newPrices: Record<string, number>) => void;
  handleAdd: (uid: string, color: string) => void;
  handleRemove: (uid: string, color: string) => void;
};

type EditingPlate = {
  originalColor: string;
  price: string;
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
    bulkEntries,
    setBulkEntries,
    handleUpdateTemplate,
    handleAdd,
    handleRemove,
  } = props;

  const [showRanking, setShowRanking] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(true);
  const [editingPlate, setEditingPlate] = useState<EditingPlate | null>(null);

  const handleEdit = (color: string, price: number) => {
    setEditingPlate({ originalColor: color, price: String(price) });
  };

  if (!userId) {
    return <MemberSelector members={members} onSelectUser={onSelectUser} />;
  }

  if (!template) {
    return <RequireReloadPage />;
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
        prices={template.prices ?? {}}
        showRanking={showRanking}
        total={total}
      />

      <PlateEditorToggleButton
        showTemplateEditor={showTemplateEditor}
        setShowTemplateEditor={setShowTemplateEditor}
      />

      <PlateEditContainer
        template={template}
        handleEdit={handleEdit}
        handleUpdateTemplate={handleUpdateTemplate}
        setShowBulkModal={setShowBulkModal}
        showTemplateEditor={showTemplateEditor}
      />

      <MemberList
        members={members}
        currentUserId={userId}
        prices={template.prices ?? {}}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />

      <ShareReceiptButton roomId={safeRoomId} />

      {editingPlate && (
        <EditPlateModal
          price={editingPlate.price}
          onChange={(newPrice) => setEditingPlate({ ...editingPlate, price: newPrice })}
          onSave={() => {
            const updated = { ...template.prices };
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

      <BulkPlateModal
        isOpen={showBulkModal}
        entries={bulkEntries}
        onChange={setBulkEntries}
        onAddRow={() => setBulkEntries([...bulkEntries, ""])}
        onSave={() => {
          const updated = { ...template.prices };
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
    </div>
  );
};
