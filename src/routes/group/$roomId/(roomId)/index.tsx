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
import "./index.css";

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
    color: string;
    price: number;
  } | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkEntries, setBulkEntries] = useState([{color: "", price: 0}]);

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {(error as Error).message}</p>;
  if (!data) return <p>データが存在しません</p>;

  if (!userId) {
    return (
      <div className="groupRoom select">
        <h2 className="subheading">あなたは誰ですか？</h2>
        <ul className="memberList">
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
    <div className="groupRoom">
      {rankNotifications.length > 0 && (
        <RankNotifications notifications={rankNotifications} />
      )}

      <div className="header">
        <h2>{data.groupName}</h2>
        <span>ルームID: {roomId}</span>
      </div>

      <div className="controls">
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
        <div className="templateEditor">
          <PlateTemplateEditor
            template={template}
            onEdit={(color, price) => setEditingPlate({color, price})}
            onRemove={(color) => {
              const updated = {...template.prices};
              delete updated[color];
              handleUpdateTemplate(updated);
            }}
            onAdd={(color, price) => {
              const updated = {...template.prices, [color]: price};
              handleUpdateTemplate(updated);
            }}
            onBulkClick={() => setShowBulkModal(true)}
          />
        </div>
      )}

      <div className="memberList">
        <MemberList
          members={members}
          currentUserId={userId}
          prices={template?.prices ?? {}}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      </div>

      <div className="shareButton">
        <ShareButton
          groupName={data.groupName}
          members={members}
          prices={template?.prices ?? {}}
          roomUrl={window.location.href}
        />
      </div>

      {editingPlate && (
        <EditPlateModal
          color={editingPlate.color}
          price={editingPlate.price}
          onChange={(newColor, newPrice) =>
            setEditingPlate({color: newColor, price: newPrice})
          }
          onSave={() => {
            const updated = {...template!.prices};
            const oldColor = editingPlate.color;
            delete updated[oldColor];
            updated[editingPlate.color] = editingPlate.price;
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
          onAddRow={() =>
            setBulkEntries([...bulkEntries, {color: "", price: 0}])
          }
          onSave={() => {
            const updated = {...template?.prices};
            bulkEntries.forEach(({color, price}) => {
              if (color.trim() && price > 0) {
                updated[color.trim()] = price;
              }
            });
            handleUpdateTemplate(updated);
            setShowBulkModal(false);
            setBulkEntries([{color: "", price: 0}]);
          }}
          onCancel={() => setShowBulkModal(false)}
        />
      )}
    </div>
  );
}
