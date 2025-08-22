import {useState} from "react";
import {Link} from "@tanstack/react-router";
import {useNavigate} from "@tanstack/react-router";
import {useCreateRoom} from "../../hooks/useCreateRoom";
import {type Member} from "../../api/room";
import {getRoomHistory, removeRoomHistory} from "../../util/roomHistory";

export const Route = createFileRoute({
  component: NewRoom,
});

export default function NewRoom() {
  const navigate = useNavigate();
  const [roomHistories, setRoomHistories] = useState(getRoomHistory());
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<Member[]>([{userId: "", name: ""}]);

  const {mutate, isPending} = useCreateRoom((data) => {
    navigate({to: `/new-sushi/group/${data.roomId}/share`});
  });

  const handleRemoveRoomHistory = (roomId: string) => {
    if (window.confirm("本当に削除しますか？")) {
      removeRoomHistory(roomId);
      setRoomHistories(getRoomHistory());
    }
  };

  const handleSubmit = () => {
    const validMembers = members
      .filter((m) => m.name.trim() !== "")
      .map((m, i) => ({
        userId: `u${i}-${m.name}`,
        name: m.name,
      }));

    if (groupName === "") {
      alert("ルーム名を入力してください");
      return;
    }

    if (validMembers.length < 2) {
      alert("2人以上のメンバー名を入力してください");
      return;
    }

    mutate({
      groupName,
      members: validMembers,
    });
  };

  return (
    <div className="max-w-xl mx-auto bg-white min-h-screen px-5 py-16">
      <h1 className="mb-4 text-2xl font-bold text-center text-gray-600">
        寿司ルーム作成
      </h1>

      <div className="flex flex-col gap-2 pt-10">
        <h3 className="mb-2 text-lg text-gray-600">ルーム名</h3>
        <input
          className="w-full p-2 mb-4 bg-white border border-gray-300 focus:outline-none focus:ring-0"
          value={groupName}
          name="groupName"
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="ルーム名"
        />

        <h3 className="mb-2 text-lg text-gray-600">
          メンバーを追加してください
        </h3>
        {members.map((m, i) => (
          <input
            key={i}
            className="w-full p-2 mb-4 bg-white border border-gray-300 focus:outline-none focus:ring-0"
            name="memberName"
            value={m.name}
            onChange={(e) => {
              const newMembers = [...members];
              newMembers[i].name = e.target.value;
              setMembers(newMembers);
            }}
            placeholder={`メンバー ${i + 1}`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2 mt-6 sm:flex-row sm:justify-between">
        <button
          type="button"
          className="px-4 py-2 font-bold text-neutral-50 bg-teal-500 shadow"
          onClick={() => setMembers([...members, {userId: "", name: ""}])}
        >
          メンバー追加
        </button>
        <button
          type="button"
          className="px-4 py-2 font-bold text-neutral-50 bg-rose-400  shadow"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? "作成中..." : "ルームを作成"}
        </button>
      </div>
      {roomHistories.length > 0 && (
        <div className="mt-8">
          <h2 className="pb-2 mb-3 text-lg border-b border-gray-300 text-gray-600 font-bold">
            過去のルーム
          </h2>
          <div className="flex flex-col gap-3">
            {roomHistories.map((h) => (
              <div
                key={h.roomId}
                className="p-2 border rounded border-gray-300"
              >
                <Link to="/new-sushi/group/$roomId" params={{roomId: h.roomId}}>
                  <div className="mb-1 font-bold text-left text-gray-600">
                    {h.groupName}
                  </div>
                  <div className="flex flex-col items-start text-sm text-gray-600 pb-2">
                    <span>
                      作成: {new Date(h.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      最終アクセス:{" "}
                      {new Date(h.lastAccessedAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
                <button
                  className="pt-2 text-sm text-red-600 w-full"
                  onClick={() => handleRemoveRoomHistory(h.roomId)}
                >
                  削除する
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
