import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCreateRoom } from "../hooks/useCreateRoom";
import { type Member } from "../api/room";
import "./new.css";

export const Route = createFileRoute({
  component: NewRoom,
});

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

    if (groupName === "") {
      alert("グループ名を入力してください");
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
    <main className="new-room">
      <h1 className="new-room__heading">グループ作成</h1>

      <div className="new-room__form">
        <h3 className="new-room__subheading">グループ名</h3>
        <input
          className="new-room__input"
          value={groupName}
          name="groupName"
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="グループ名"
        />

        <h3 className="new-room__subheading">メンバーを追加してください</h3>
        {members.map((m, i) => (
          <input
            key={i}
            className="new-room__input"
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

      <div className="new-room__actions">
        <button
          type="button"
          className="new-room__button new-room__button--add"
          onClick={() => setMembers([...members, { userId: "", name: "" }])}
        >
          ＋ メンバー追加
        </button>
        <button
          type="button"
          className="new-room__button new-room__button--create"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? "作成中..." : "ルームを作成"}
        </button>
      </div>
    </main>
  );
}
