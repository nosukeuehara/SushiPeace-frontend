import {useParams} from "@tanstack/react-router";
import {useRoom} from "../../../../hooks/useRoom";
import {useGroupRoomState} from "../../../../hooks/useGroupRoomState";
import {RankNotifications} from "./components/RankNotifications";
import {PlateTemplateEditor} from "./components/PlateTemplateEditor";
import {EditPlateModal} from "./components/EditPlateModal";
import {BulkPlateModal} from "./components/BulkPlateModal";
import {GroupSummary} from "./components/GroupSummary";
import {MemberList} from "./components/MemberList";
import {ShareButton} from "./components/ShareButton";
import {useState} from "react";

export const Route = createFileRoute({
  component: RouteComponent,
});

export function RouteComponent() {
  const {roomId} = useParams({strict: false});
  const safeRoomId: string = roomId ?? "";
  const {data, isLoading, error} = useRoom(safeRoomId);

  const {
    userId,
    setUserId,
    members,
    template,
    rankNotifications,
    total,
    handleSelectUser,
    handleAdd,
    handleRemove,
    handleUpdateTemplate,
  } = useGroupRoomState(safeRoomId, data);

  const [showRanking, setShowRanking] = useState(false);
  const [editingPlate, setEditingPlate] = useState<{
    originalColor: string;
    price: number;
  } | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkEntries, setBulkEntries] = useState([0]);

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {(error as Error).message}</p>;
  if (!data) return <p>データが存在しません</p>;

  if (!userId) {
    return (
      <div className="p-6 mx-auto my-8 text-center max-w-xl rounded-xl">
        <h2 className="mb-4 text-xl">あなたは誰ですか？</h2>
        <ul className="flex flex-col gap-2">
          {members.map((m) => (
            <li key={m.userId}>
              <button onClick={() => handleSelectUser(m.userId)}>
                {m.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="max-w-xl p-6 mx-auto my-8 rounded-xl">
      {rankNotifications.length > 0 && (
        <RankNotifications notifications={rankNotifications} />
      )}

      <div className="mb-4 text-center">
        <h2>{data.groupName}</h2>
        <span>ルームID: {roomId}</span>
      </div>

      <div className="grid grid-cols-1 gap-2 pb-5 md:grid-cols-2">
        <button onClick={() => setShowRanking((prev) => !prev)}>
          ランキング
        </button>
        <button
          onClick={() => {
            localStorage.removeItem(`sushi-user-id-${roomId}`);
            setUserId(null);
          }}
        >
          ユーザーを選び直す
        </button>
      </div>

      <GroupSummary
        members={members}
        prices={template?.prices ?? {}}
        showRanking={showRanking}
        onToggleRanking={() => setShowRanking((prev) => !prev)}
        total={total}
      />

      {template && (
        <div className="p-4 mb-6 bg-gray-100 rounded">
          <PlateTemplateEditor
            template={template}
            onEdit={(color, price) =>
              setEditingPlate({originalColor: color, price})
            }
            onRemove={(color) => {
              const updated = {...template.prices};
              delete updated[color];
              handleUpdateTemplate(updated);
            }}
            onAdd={(price) => {
              const color = `${price}円 皿`;
              const updated = {...template.prices, [color]: price};
              handleUpdateTemplate(updated);
            }}
            onBulkClick={() => setShowBulkModal(true)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 mb-6">
        <MemberList
          members={members}
          currentUserId={userId}
          prices={template?.prices ?? {}}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      </div>

      <div className="mt-4">
        <ShareButton
          groupName={data.groupName}
          members={members}
          prices={template?.prices ?? {}}
          roomUrl={window.location.href}
        />
      </div>

      {editingPlate && (
        <EditPlateModal
          price={editingPlate.price}
          onChange={(newPrice) =>
            setEditingPlate({...editingPlate, price: newPrice})
          }
          onSave={() => {
            const updated = {...template!.prices};
            const oldColor = editingPlate.originalColor;
            const newColor = `${editingPlate.price}円皿`;
            delete updated[oldColor];
            updated[newColor] = editingPlate.price;
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
          onAddRow={() => setBulkEntries([...bulkEntries, 0])}
          onSave={() => {
            const updated = {...template?.prices};
            bulkEntries.forEach((price) => {
              if (price > 0) {
                const color = `${price}円皿`;
                updated[color] = price;
              }
            });
            handleUpdateTemplate(updated);
            setShowBulkModal(false);
            setBulkEntries([0]);
          }}
          onCancel={() => setShowBulkModal(false)}
        />
      )}
    </div>
  );
}
