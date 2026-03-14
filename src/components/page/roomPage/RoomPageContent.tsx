import { BulkPlateModal } from "@/components/modals/BulkPlateModal";
import { EditPlateModal, type EditingPlate } from "@/components/modals/EditPlateModal";
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
  handleUpdateTemplate: (newPrices: Record<string, number>) => void;
  handleAdd: (uid: string, color: string) => void;
  handleRemove: (uid: string, color: string) => void;
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
    handleUpdateTemplate,
    handleAdd,
    handleRemove,
  } = props;

  const [showRanking, setShowRanking] = useState(false);

  // 皿編集モーダル関連のstate
  const [showTemplateEditor, setShowTemplateEditor] = useState(true);
  const [editingPlate, setEditingPlate] = useState<EditingPlate | null>(null);

  // 皿一括登録関連のstate
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkEntries, setBulkEntries] = useState([""]);

  if (!userId) {
    return <MemberSelector members={members} onSelectUser={onSelectUser} />;
  }

  if (!template) {
    return <RequireReloadPage />;
  }

  const handleAddBulkRow = () => {
    setBulkEntries((prev) => [...prev, ""]);
  };

  const handleSaveBulk = () => {
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
  };

  const handleCancelBulk = () => {
    setShowBulkModal(false);
    setBulkEntries([""]);
  };

  const handleStartEditPlate = (color: string, price: number) => {
    setEditingPlate({ originalColor: color, price: String(price) });
  };

  const handleChangeEditingPlatePrice = (newPrice: string) => {
    if (!editingPlate) return;
    setEditingPlate({ ...editingPlate, price: newPrice });
  };

  const handleSaveEditingPlate = () => {
    if (!editingPlate) return;

    const updated = { ...template.prices };
    const oldColor = editingPlate.originalColor;
    const newColor = `${editingPlate.price}円皿`;

    delete updated[oldColor];
    updated[newColor] = Number(editingPlate.price);

    handleUpdateTemplate(updated);
    setEditingPlate(null);
  };

  const handleCancelEditingPlate = () => {
    setEditingPlate(null);
  };

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
        prices={template.prices}
        showRanking={showRanking}
        total={total}
      />

      <PlateEditorToggleButton
        showTemplateEditor={showTemplateEditor}
        setShowTemplateEditor={setShowTemplateEditor}
      />

      <PlateEditContainer
        template={template}
        handleEdit={handleStartEditPlate}
        handleUpdateTemplate={handleUpdateTemplate}
        setShowBulkModal={setShowBulkModal}
        showTemplateEditor={showTemplateEditor}
      />

      <MemberList
        members={members}
        currentUserId={userId}
        prices={template.prices}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />

      <ShareReceiptButton roomId={safeRoomId} />

      {editingPlate && (
        <EditPlateModal
          editingPlate={editingPlate}
          onChange={handleChangeEditingPlatePrice}
          onSave={handleSaveEditingPlate}
          onCancel={handleCancelEditingPlate}
        />
      )}

      <BulkPlateModal
        isOpen={showBulkModal}
        entries={bulkEntries}
        onChange={setBulkEntries}
        onAddRow={handleAddBulkRow}
        onSave={handleSaveBulk}
        onCancel={handleCancelBulk}
      />
    </div>
  );
};
