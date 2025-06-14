import { useParams } from "@tanstack/react-router";
import { useRoom } from "../../../../hooks/useRoom";
import { plateTemplates } from "../../../../constants/templates";
import { generateShareText } from "../../../../util/shareText";
import "./result.css";

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

  const shareUrl = `${window.location.origin}/group/${roomId}/result`;
  const shareText = generateShareText(
    data.groupName,
    data.members,
    template.prices,
    shareUrl
  );

  return (
    <div className="sushi-result">
      <h2 className="sushi-result__heading">📋 {data.groupName} の会計結果</h2>

      <ul className="sushi-result__list">
        {data.members.map((m) => {
          const subtotal = Object.entries(m.counts).reduce(
            (sum, [color, count]) =>
              sum + count * template.prices[color as string],
            0
          );
          return (
            <li key={m.userId} className="sushi-result__item">
              <span className="sushi-result__name">{m.name}</span>
              <span className="sushi-result__amount">
                {subtotal.toLocaleString()}円
              </span>
            </li>
          );
        })}
      </ul>

      <p className="sushi-result__total">
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

      <textarea className="sushi-result__textarea" readOnly value={shareText} />

      <button
        className="sushi-result__button"
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
