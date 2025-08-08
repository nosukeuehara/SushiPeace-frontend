import {useParams} from "@tanstack/react-router";
import {useRoom} from "../../../../hooks/useRoom";
import {generateShareText} from "../../../../util/shareText";

export const Route = createFileRoute({
  component: SushiResultComponent,
});

function SushiResultComponent() {
  const {roomId} = useParams({strict: false});
  const {data, isLoading, error} = useRoom(roomId);
  const template = data?.template;

  if (isLoading) return <p>読み込み中...</p>;
  if (error || !data) return <p>データの取得に失敗しました</p>;
  if (!template) return <p>テンプレートが見つかりません</p>;

  const shareUrl = `${window.location.origin}/group/${roomId}/result`;
  const shareText = generateShareText(
    data.groupName,
    data.members,
    template.prices,
    shareUrl
  );

  return (
    <div className="max-w-xl mx-auto rounded-xl">
      <h2 className="mb-10 text-2xl font-bold text-center text-gray-700">
        📋 {data.groupName} の会計結果
      </h2>

      <ul className="mb-8 gap-4 flex flex-col">
        {data.members.map((m) => {
          const subtotal = Object.entries(m.counts).reduce(
            (sum, [color, count]) =>
              sum + count * template.prices[color as string],
            0
          );
          return (
            <li key={m.userId} className="flex justify-between ">
              <span className="font-bold text-gray-700">{m.name}</span>
              <span className="text-gray-700 text-xl">
                {subtotal.toLocaleString()}円
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mb-4 text-2xl font-bold text-center text-orange-600">
        合計金額：{" "}
        {data.members
          .reduce(
            (total, m) =>
              total +
              Object.entries(m.counts).reduce(
                (sum, [color, count]) =>
                  sum + count * template.prices[color as string],
                0
              ),
            0
          )
          .toLocaleString()}{" "}
        円
      </p>

      <textarea
        className="w-full min-h-[300px] py-3 px-2 mb-4 text-sm text-gray-700 bg-gray-100 border rounded border-gray-300 focus:outline-none focus:ring-0"
        readOnly
        value={shareText}
      />

      <button
        className="block w-full px-4 py-2 font-bold text-neutral-100 rounded shadow bg-teal-500 hover:bg-teal-600"
        onClick={() => {
          navigator.clipboard.writeText(shareText);
          alert("共有テキストをコピーしました！");
        }}
      >
        📋 コピーして共有
      </button>
    </div>
  );
}
