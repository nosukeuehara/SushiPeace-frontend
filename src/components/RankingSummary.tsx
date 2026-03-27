import type { MemberPlates } from "@/types";

type Props = {
  members: MemberPlates[];
  prices: Record<string, number>;
  showRanking: boolean;
  total: number;
};

export const RankingSummary = ({ members, prices, showRanking, total }: Props) => {
  const ranking = [...members]
    .map((m) => {
      const subtotal = Object.entries(m.counts).reduce(
        (sum, [color, count]) => sum + count * (prices[color] ?? 0),
        0,
      );
      return { ...m, subtotal };
    })
    .sort((a, b) => b.subtotal - a.subtotal)
    .slice(0, 3);

  return (
    <div className="mb-6 text-center">
      {showRanking && (
        <ul className="px-10 pt-3 pb-2 text-left space-y-2">
          {ranking.map((m, i) => {
            const rankColors = [
              "text-gray-600 text-xl font-bold",
              "text-gray-600 text-lg font-semibold",
              "text-gray-600 text-lg font-semibold",
            ];
            const rankEmojis = ["🥇", "🥈", "🥉"];

            return (
              <li key={m.userId}>
                <span className={rankColors[i] || "text-gray-600"}>
                  <span className="text-xl">{rankEmojis[i] || `${i + 1}位`}</span>
                  {m.name}（{m.subtotal.toLocaleString()}円）
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mb-2 pt-3 text-3xl font-extrabold text-rose-400">
        合計：{total.toLocaleString()} 円
      </p>
    </div>
  );
};
