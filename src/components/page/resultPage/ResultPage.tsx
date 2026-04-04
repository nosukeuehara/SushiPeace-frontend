import type { RoomData } from "@/types";
import { Link } from "@tanstack/react-router";

type ResultPageProps = {
  data: RoomData;
  safeRoomId: string;
  shareText: string | undefined;
};

export const ResultPage = ({ data, safeRoomId, shareText }: ResultPageProps) => {
  const { template } = data;
  if (!template) {
    return <p>テンプレートが見つかりません</p>;
  }
  return (
    <div className="max-w-xl mx-auto bg-white min-h-screen px-5 py-16">
      <div className="flex flex-col items-center mb-10">
        <h2 className="mb-3 text-3xl font-bold text-center text-gray-600">📋 {data.groupName}</h2>
        <span className="text-gray-600">の会計結果</span>
      </div>

      <div className="text-center text-lg mb-10 text-gray-600">
        <Link to="/new-sushi/group/$roomId" params={{ roomId: safeRoomId }}>
          <span className="font-bold">寿司ルームへ戻る</span>
        </Link>
      </div>

      <ul className="mb-8 gap-7 flex flex-col">
        {data?.members?.map((m) => {
          const subtotal = Object.entries(m.counts).reduce(
            (sum, [color, count]) => sum + count * (template.prices[color] ?? 0),
            0,
          );
          return (
            <li key={m.userId} className="flex justify-between">
              <span className="font-bold text-gray-600 text-lg">{m.name}</span>
              <span className="text-gray-600 text-xl">{subtotal.toLocaleString()}円</span>
            </li>
          );
        })}
      </ul>

      <p className="mb-4 text-2xl font-bold text-center text-rose-400">
        合計金額：{" "}
        {data?.members
          ?.reduce(
            (total, m) =>
              total +
              Object.entries(m.counts).reduce(
                (sum, [color, count]) => sum + count * (template.prices[color] ?? 0),
                0,
              ),
            0,
          )
          ?.toLocaleString()}{" "}
        円
      </p>

      <textarea
        className={
          "w-full min-h-[300px] py-3 px-2 mb-4 text-sm text-gray-600 bg-neutral-50 border  border-gray-300 " +
          "focus:outline-none focus:ring-0"
        }
        readOnly
        value={shareText ?? ""}
      />

      <button
        className="block w-full px-4 py-2 font-bold text-neutral-50  shadow bg-teal-500"
        onClick={() => {
          navigator.clipboard.writeText(shareText ?? "");
          alert("共有テキストをコピーしました！");
        }}
      >
        📋 コピーして共有
      </button>
    </div>
  );
};
