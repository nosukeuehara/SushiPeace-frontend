import type { MemberPlates } from "../types/plate";

type Props = {
  member: MemberPlates;
  onAdd: (userId: string, color: string) => void;
  onRemove: (userId: string, color: string) => void;
  readonly?: boolean;
  prices: Record<string, number>;
};

export const MemberPlateCounter = ({
  member,
  onAdd,
  onRemove,
  readonly,
  prices,
}: Props) => {
  const total = Object.entries(member.counts).reduce(
    (sum, [color, count]) => sum + count * (prices[color] ?? 0),
    0
  );

  return (
    <div>
      <div className="flex items-baseline justify-start gap-2 pb-2">
        <h4>{member.name}</h4>
        <p>合計: {total.toLocaleString()} 円</p>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        {Object.entries(prices).map(([color, price]) => (
          <div key={`${color}-${price}`} className="flex items-center justify-between gap-2">
            <div className="font-bold text-base text-gray-900">
              {color}皿（{price}円）
            </div>

            {!readonly ? (
              <div className="flex flex-1 justify-end gap-2">
                <button
                  className="text-base"
                  onClick={() => onRemove(member.userId, color)}
                >
                  −
                </button>
                <div className="font-bold text-base">
                  {member.counts[color] ?? 0}
                </div>
                <button
                  className="text-base"
                  onClick={() => onAdd(member.userId, color)}
                >
                  ＋
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="font-bold text-base">
                  {member.counts[color] ?? 0} 枚
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
