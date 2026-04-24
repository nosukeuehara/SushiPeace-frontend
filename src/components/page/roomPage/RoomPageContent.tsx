import { useState } from "react";
import { BulkPlateModal } from "@/components/modals/BulkPlateModal";
import { EditPlateModal, type EditingPlate } from "@/components/modals/EditPlateModal";
import { RankingSummary } from "@/components/RankingSummary";
import { MemberPlateDataList } from "@/components/MemberPlateDataList";
import { MemberSelector } from "@/components/MemberSelector";
import { PlateEditContainer } from "@/components/PlateEditContainer";
import { RankNotifications } from "@/components/RankNotifications";
import { ShareReceiptButton } from "@/components/ShareReceiptButton";
import type { MemberPlates, PlateTemplate, RoomData } from "@/types";
import { ActionButtonsRow } from "@/components/common/ActionButtonsRow";
import UserChangeButton from "@/components/UserChangeButton";
import RankingToggleButton from "@/components/RankingToggleButton";
import { PlateEditorToggleButton } from "@/components/PlateEditorToggleButton";
import { splitMembersByCurrentUser } from "@/util/utils";
import {
  addPlate,
  removePlate,
  removePlateCounts,
  renamePlateCounts,
  updatePlate,
} from "@/domain/template/templateController";
import { UserControlPanel } from "@/components/UserControlPanel";

type RoomContentProps = {
  data: RoomData;
  template: PlateTemplate;
  userId: string | null;
  members: MemberPlates[];
  setMembers: React.Dispatch<React.SetStateAction<MemberPlates[]>>;
  rankNotifications: {
    id: number;
    message: string;
  }[];
  safeRoomId: string;
  total: number;
  onChangeUser: () => void;
  onSelectUser: (id: string) => void;
  handleUpdateTemplate: (newPrices: Record<string, number>) => void;
  handleAdd: (uid: string, label: string) => void;
  handleRemove: (uid: string, label: string) => void;
};

export const RoomPageContent = ({
  data,
  template,
  userId,
  members,
  setMembers,
  onSelectUser,
  rankNotifications,
  safeRoomId,
  onChangeUser,
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

  if (!userId) {
    return <MemberSelector members={data.members ?? []} onSelectUser={onSelectUser} />;
  }

  const { currentUser, otherMembers } = splitMembersByCurrentUser(members, userId);

  if (!currentUser) {
    return (
      <div className="text-center text-gray-600">ユーザーデータの読み込みに失敗しました。</div>
    );
  }

  const currentTemplate = template;

  const handleAddPlate = (price: number) => {
    const newTemplate = addPlate(price, currentTemplate);
    handleUpdateTemplate(newTemplate.prices);
  };

  const handleRemovePlate = (label: string) => {
    const newTemplate = removePlate(label, currentTemplate);
    const newMembers = removePlateCounts(label, members);

    setMembers(newMembers);
    handleUpdateTemplate(newTemplate.prices);
  };

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

    const newPrice = Number(editingPlate.price);

    const newTemplate = updatePlate(editingPlate.originalLabel, newPrice, currentTemplate);

    const newMembers = renamePlateCounts(editingPlate.originalLabel, newPrice, members);

    setMembers(newMembers);
    handleUpdateTemplate(newTemplate.prices);
    setEditingPlate(null);
  };

  const handleCancelEditingPlate = () => {
    setEditingPlate(null);
  };

  return (
    <div className="relative max-w-xl mx-auto min-h-screen px-5 py-16 bg-white">
      {/* 編集用モーダル */}
      {editingPlate && (
        <EditPlateModal
          editingPlate={editingPlate}
          onChange={handleChangeEditingPlatePrice}
          onSave={handleSaveEditingPlate}
          onCancel={handleCancelEditingPlate}
        />
      )}

      {/* 一括登録用モーダル */}
      <BulkPlateModal
        isOpen={showBulkModal}
        entries={bulkEntries}
        onChange={setBulkEntries}
        onAddRow={handleAddBulkRow}
        onSave={handleSaveBulk}
        onCancel={handleCancelBulk}
      />

      {/* ランク通知 */}
      {rankNotifications.length > 0 && <RankNotifications notifications={rankNotifications} />}

      {/* グループ名表示 */}
      <div className="mb-4 text-center">
        <p className="text-3xl font-bold text-gray-600">{data.groupName}</p>
      </div>

      {/* ランキング・ユーザー切替ボタン */}
      <ActionButtonsRow>
        <RankingToggleButton showRanking={showRanking} setShowRanking={setShowRanking} />
        <UserChangeButton onChangeUser={onChangeUser} />
      </ActionButtonsRow>

      {/* グループの皿データ一覧、<RankingToggleButton/>で表示切替 */}
      <RankingSummary
        members={members}
        prices={currentTemplate.prices}
        showRanking={showRanking}
        total={total}
      />

      {/* 皿編集用トグルボタン */}
      <PlateEditorToggleButton
        showTemplateEditor={showTemplateEditor}
        setShowTemplateEditor={setShowTemplateEditor}
      />

      {/* 皿編集用コンテナ、<PlateEditorToggleButton/>で表示切替 */}
      <PlateEditContainer
        template={currentTemplate}
        handleEdit={handleStartEditPlate}
        handleAddPlate={handleAddPlate}
        handleRemovePlate={handleRemovePlate}
        setShowBulkModal={setShowBulkModal}
        showTemplateEditor={showTemplateEditor}
      />

      {/* ユーザーのカウント操作用コンポーネント */}
      <UserControlPanel
        member={currentUser}
        onAdd={handleAdd}
        onRemove={handleRemove}
        prices={currentTemplate.prices}
      />

      {/* メンバーリスト、ユーザー以外のメンバーで金額ごとのお皿の枚数を表示 */}
      <MemberPlateDataList otherMembers={otherMembers} prices={currentTemplate.prices} />

      {/* 個別金額の共有ボタン */}
      <ShareReceiptButton roomId={safeRoomId} />
    </div>
  );
};
