import { useState } from "react";
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
import RankingToggleButton from "@/components/RankingToggleButton";
import { PlateEditorToggleButton } from "@/components/PlateEditorToggleButton";
import { RequireReloadPage } from "../errorPage/RequireReloadPage";
import { addPlate, updatePlate } from "@/domain/template/templateController";

type RoomContentProps = {
  data: RoomData;
  userId: string | null;
  members: MemberPlates[];
  rankNotifications: {
    id: number;
    message: string;
  }[];
  safeRoomId: string;
  template: PlateTemplate | null;
  total: number;
  onChangeUser: () => void;
  onSelectUser: (id: string) => void;
  handleUpdateTemplate: (newPrices: Record<string, number>) => void;
  handleAdd: (uid: string, label: string) => void;
  handleRemove: (uid: string, label: string) => void;
};

export const RoomPageContent = ({
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
}: RoomContentProps) => {
  const [showRanking, setShowRanking] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(true);
  const [editingPlate, setEditingPlate] = useState<EditingPlate | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkEntries, setBulkEntries] = useState([""]);

  // ユーザー未選択時は API レスポンスの members を優先して表示
  if (!userId) {
    return <MemberSelector members={data.members ?? []} onSelectUser={onSelectUser} />;
  }

  // 初期同期前でも、data.templateData があれば画面を成立させる
  const currentTemplate = template ?? { prices: data.templateData ?? {} };

  if (!currentTemplate) {
    return <RequireReloadPage />;
  }

  const handleAddBulkRow = () => {
    setBulkEntries((prev) => [...prev, ""]);
  };

  const handleSaveBulk = () => {
    const newTemplate = bulkEntries.reduce((current, entry) => {
      const price = Number(entry);
      if (price <= 0) return current;
      return addPlate(price, current);
    }, currentTemplate);

    handleUpdateTemplate(newTemplate.prices);
    setShowBulkModal(false);
    setBulkEntries([""]);
  };

  const handleCancelBulk = () => {
    setShowBulkModal(false);
    setBulkEntries([""]);
  };

  const handleStartEditPlate = (label: string, price: number) => {
    setEditingPlate({ originalLabel: label, price: String(price) });
  };

  const handleChangeEditingPlatePrice = (newPrice: string) => {
    if (!editingPlate) return;
    setEditingPlate({ ...editingPlate, price: String(newPrice) });
  };

  const handleSaveEditingPlate = () => {
    if (!editingPlate) return;

    const newTemplate = updatePlate(
      editingPlate.originalLabel,
      Number(editingPlate.price),
      currentTemplate,
    );

    handleUpdateTemplate(newTemplate.prices);
    setEditingPlate(null);
  };

  const handleCancelEditingPlate = () => {
    setEditingPlate(null);
  };

  return (
    <div className="relative max-w-xl mx-auto min-h-screen px-5 py-16 bg-white">
      {rankNotifications.length > 0 && <RankNotifications notifications={rankNotifications} />}

      <div className="mb-4 text-center">
        <h2 className="text-3xl font-bold text-gray-600">{data.groupName}</h2>
      </div>

      <ActionButtonsRow>
        <RankingToggleButton showRanking={showRanking} setShowRanking={setShowRanking} />
        <UserChangeButton onChangeUser={onChangeUser} />
      </ActionButtonsRow>

      <GroupSummary
        members={members}
        prices={currentTemplate.prices}
        showRanking={showRanking}
        total={total}
      />

      <PlateEditorToggleButton
        showTemplateEditor={showTemplateEditor}
        setShowTemplateEditor={setShowTemplateEditor}
      />

      <PlateEditContainer
        template={currentTemplate}
        handleEdit={handleStartEditPlate}
        handleUpdateTemplate={handleUpdateTemplate}
        setShowBulkModal={setShowBulkModal}
        showTemplateEditor={showTemplateEditor}
      />

      <MemberList
        members={members}
        currentUserId={userId}
        prices={currentTemplate.prices}
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
