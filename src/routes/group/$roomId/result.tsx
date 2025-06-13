import { useParams } from "@tanstack/react-router";
import { useRoom } from "../../../hooks/useRoom";
import { plateTemplates } from "../../../constants/templates";
import { generateShareText } from "../../../util/shareText";

export const Route = createFileRoute({
  component: SushiResultComponent,
});

function SushiResultComponent() {
  const { roomId } = useParams({ strict: false });
  const { data, isLoading, error } = useRoom(roomId);
  const template = plateTemplates.find((t) => t.id === data?.templateId);

  if (isLoading) return <p>読み込み中...</p>;
  if (error || !data) return <p>データの取得に失敗しました</p>;
  if (!template) return <p>テンプレートが見つかりません</p>;

  const shareUrl = `http://localhost:5173/group/${roomId}/result`;
  const shareText = generateShareText(
    data.groupName,
    data.members,
    template.prices,
    shareUrl
  );

  return (
    <div>
      <h2>📋 {data.groupName} の会計結果</h2>

      <ul>
        {data.members.map((m) => {
          const subtotal = Object.entries(m.counts).reduce(
            (sum, [color, count]) =>
              sum + count * template.prices[color as string],
            0
          );
          return (
            <li key={m.userId}>
              {m.name}：{subtotal.toLocaleString()}円
            </li>
          );
        })}
      </ul>

      <hr />
      <p>
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

      <hr />

      <textarea
        readOnly
        style={{ width: "100%", height: "150px" }}
        value={shareText}
      />

      <button
        onClick={() => {
          navigator.clipboard.writeText(shareText);
          alert("共有テキストをコピーしました！");
        }}
      >
        📋 コピーしてLINEで共有
      </button>
    </div>
  );
}
