export const Route = createFileRoute({
  component: NewRoom,
});

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCreateRoom } from "../hooks/useCreateRoom";
import { type Member } from "../api/room";

export default function NewRoom() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<Member[]>([{ userId: "", name: "" }]);

  const { mutate, isPending } = useCreateRoom((data) => {
    navigate({ to: `/group/${data.roomId}/share` });
  });

  const handleSubmit = () => {
    const validMembers = members
      .filter((m) => m.name.trim() !== "")
      .map((m, i) => ({
        userId: `u${i}-${m.name}`,
        name: m.name,
      }));

    if (validMembers.length === 0) {
      alert("1人以上のメンバー名を入力してください");
      return;
    }

    mutate({ groupName, members: validMembers });
  };

  return (
    <div>
      <h1>グループ作成</h1>
      <input
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="グループ名（任意）"
      />
      {members.map((m, i) => (
        <input
          key={i}
          value={m.name}
          onChange={(e) => {
            const newMembers = [...members];
            newMembers[i].name = e.target.value;
            setMembers(newMembers);
          }}
          placeholder={`メンバー ${i + 1}`}
        />
      ))}
      <button
        onClick={() => setMembers([...members, { userId: "", name: "" }])}
      >
        ＋ メンバー追加
      </button>
      <button onClick={handleSubmit} disabled={isPending}>
        {isPending ? "作成中..." : "ルームを作成"}
      </button>
    </div>
  );
}
