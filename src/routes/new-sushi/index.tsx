import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useCreateRoom } from "@/hooks/useCreateRoom";
import { type Member } from "@/api";
import { getRoomHistory, removeRoomHistory } from "@/util/roomHistory";

export const Route = createFileRoute({
  component: NewRoom,
});

export default function NewRoom() {
  const navigate = useNavigate();
  const [roomHistories, setRoomHistories] = useState(getRoomHistory());
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<Member[] | []>([]);
  const [memberName, setMemberName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useCreateRoom((data) => {
    navigate({ to: `/new-sushi/group/${data.roomId}/share` });
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

  const addMember = () => {
    const name = memberName.trim();
    if (!name) return;
    setMembers((prev) => [...prev, { userId: "", name }]);
    setMemberName("");

    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (el) {
        el.focus();
        const pos = el.value.length;
        try {
          el.setSelectionRange(pos, pos);
        } catch {}
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto bg-white min-h-screen px-5 py-16">
      <h1 className="mb-4 text-3xl font-bold text-center text-gray-600">寿司ルーム作成</h1>

      <div className="pt-6">
        <h3 className="mb-2 text-lg text-gray-600">ルーム名</h3>
        <input
          className="w-full p-2 mb-8 bg-white border border-gray-300 focus:outline-none focus:ring-0"
          value={groupName}
          name="groupName"
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="ルーム名"
        />
      </div>
      <h3 className="mb-2 text-lg text-gray-600">メンバーを追加してください</h3>

      <div className="flex gap-1 w-full mb-3">
        <input
          ref={inputRef}
          name="memberName"
          className="p-2 w-full bg-white border border-gray-300 focus:outline-none"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // モバイルでの予期せぬ submit/blur 回避
              addMember();
            }
          }}
          placeholder="メンバー名"
        />
        <button
          type="button"
          className="w-20 font-bold text-neutral-50 bg-teal-500 shadow"
          // ここがキモ：フォーカス移動を防ぎ、キーボードを閉じさせない
          onMouseDown={(e) => e.preventDefault()}
          onTouchStart={(e) => e.preventDefault()}
          onClick={addMember}
          tabIndex={-1} // 余計なフォーカス遷移をさらに抑止（任意）
        >
          追加
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {members.map((m, i) => (
          <div
            key={i}
            className="font-extrabold w-fit text-xs px-4 py-2 bg-rose-300 rounded-2xl text-neutral-50 shadow"
          >
            <span>{m.name}</span>
            <button
              onClick={() => {
                setMembers(members.filter((_, index) => index !== i));
              }}
            >
              <span className="ml-1">✕</span>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <button
          type="button"
          className="w-full px-4 py-2 font-bold text-neutral-50 bg-rose-400 shadow"
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
              <div key={h.roomId} className="p-2 border rounded border-gray-300">
                <Link to="/new-sushi/group/$roomId" params={{ roomId: h.roomId }}>
                  <div className="mb-1 font-bold text-left text-gray-600">{h.groupName}</div>
                  <div className="flex flex-col items-start text-sm text-gray-600 pb-2">
                    <span>作成: {new Date(h.createdAt).toLocaleDateString()}</span>
                    <span>最終アクセス: {new Date(h.lastAccessedAt).toLocaleDateString()}</span>
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
