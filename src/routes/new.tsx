// "/new" にマッチするルートを定義
export const Route = createFileRoute({
  component: NewRoom,
});

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCreateRoom } from "../hooks/useCreateRoom";
import { type Member } from "../api/room";
import { plateTemplates } from "../constants/templates";

export default function NewRoom() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<Member[]>([{ userId: "", name: "" }]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("template1");

  const { mutate, isPending } = useCreateRoom((data) => {
    navigate({ to: `/group/${data.roomId}/share` });
  });

  const handleSubmit = () => {
    const selectedTemplate = plateTemplates.find(
      (tpl) => tpl.id === selectedTemplateId
    );
    if (!selectedTemplate) return;

    const validMembers = members
      .filter((m) => m.name.trim() !== "")
      .map((m, i) => ({
        userId: `u${i}-${m.name}`,
        name: m.name,
        counts: Object.fromEntries(
          Object.keys(selectedTemplate.prices).map((color) => [color, 0])
        ),
      }));

    if (validMembers.length === 0) {
      alert("1人以上のメンバー名を入力してください");
      return;
    }

    mutate({
      groupName,
      members: validMembers,
      templateId: selectedTemplate.id, // これをバックエンドに渡して保存
    });
  };

  return (
    <div>
      <h1>グループ作成</h1>
      <input
        value={groupName}
        name="groupName"
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="グループ名（任意）"
      />
      {members.map((m, i) => (
        <input
          key={i}
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
      <select
        value={selectedTemplateId}
        onChange={(e) => setSelectedTemplateId(e.target.value)}
      >
        {plateTemplates.map((tpl) => (
          <option key={tpl.id} value={tpl.id}>
            {tpl.name}
          </option>
        ))}
      </select>
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
