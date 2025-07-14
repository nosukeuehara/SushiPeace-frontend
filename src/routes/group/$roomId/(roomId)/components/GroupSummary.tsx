import type {MemberPlates} from "../../../../../types/plate";

type Props = {
  members: MemberPlates[];
  prices: Record<string, number>;
  showRanking: boolean;
  onToggleRanking: () => void;
  total: number;
};

export const GroupSummary = ({
  members,
  prices,
  showRanking,
  onToggleRanking,
  total,
}: Props) => {
  const ranking = [...members]
    .map((m) => {
      const subtotal = Object.entries(m.counts).reduce(
        (sum, [color, count]) => sum + count * (prices[color] ?? 0),
        0
      );
      return {...m, subtotal};
    })
    .sort((a, b) => b.subtotal - a.subtotal)
    .slice(0, 3);

  return (
    <div className="group-summary">
      <p className="group-accountant__price">
        合計：{total.toLocaleString()} 円
      </p>

      <button onClick={onToggleRanking}>
        {showRanking ? "ランキングを隠す" : "ランキング"}
      </button>

      {showRanking && (
        <ul>
          {ranking.map((m, i) => (
            <li key={m.userId}>
              {i + 1}位: {m.name}（{m.subtotal.toLocaleString()}円）
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
