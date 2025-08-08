import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {useCreateRoom} from "../hooks/useCreateRoom";
import {type Member} from "../api/room";

export const Route = createFileRoute({
  component: NewRoom,
});

export default function NewRoom() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<Member[]>([{userId: "", name: ""}]);

  const {mutate, isPending} = useCreateRoom((data) => {
    navigate({to: `/group/${data.roomId}/share`});
  });

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
    <main className="max-w-xl p-6 mx-auto my-8 rounded-xl">
      <h1 className="mb-4 text-2xl font-bold text-center">寿司ルーム作成</h1>

      <div className="flex flex-col gap-2 pt-10">
        <h3 className="mb-2 text-lg text-gray-600">ルーム名</h3>
        <input
          className="w-full p-2 mb-4 bg-gray-100 border rounded"
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
            className="w-full p-2 mb-4 bg-gray-100 border rounded"
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
          className="px-4 py-2 font-bold text-neutral-100 bg-teal-600 rounded shadow"
          onClick={() => setMembers([...members, {userId: "", name: ""}])}
        >
          ＋ メンバー追加
        </button>
        <button
          type="button"
          className="px-4 py-2 font-bold text-neutral-100 bg-orange-600 rounded shadow"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? "作成中..." : "ルームを作成"}
        </button>
      </div>
    </main>
  );
}
