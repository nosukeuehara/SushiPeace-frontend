import type { MemberPlates } from "@/types";

type Props = {
  member: MemberPlates;
  onAdd: (userId: string, label: string) => void;
  onRemove: (userId: string, label: string) => void;
  readonly?: boolean;
  prices: Record<string, number>;
};

export const PlateCounter = ({ member, onAdd, onRemove, prices }: Props) => {
  const total = Object.entries(member.counts).reduce(
    (sum, [label, count]) => sum + count * (prices[label] ?? 0),
    0,
  );

  return (
    <div>
      <div className="flex items-baseline justify-start gap-2 py-5">
        <h4 className="text-xl font-bold text-gray-600">{member.name}：</h4>
        <p className="font-bold">
          <span className="text-2xl font-semibold text-gray-600">{total.toLocaleString()} 円</span>
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        {Object.entries(prices)
          .sort((a, b) => b[1] - a[1])
          .map(([label, price]) => (
            <div key={`${label}-${price}`} className="flex items-center justify-between gap-2">
              <div className="font-bold text-base text-gray-600 flex items-center">
                <div className="w-[100px] text-right">
                  <span className="text-xl">{price}円</span>
                  <span className="text-base pl-2">皿</span>
                </div>
              </div>

              <div className="flex flex-1 justify-end gap-2">
                <div className="flex items-center gap-2">
                  <button
                    className="size-8 rounded-full"
                    onClick={() => onRemove(member.userId, label)}
                  >
                    <span className="text-gray-600 text-2xl">ー</span>
                  </button>
                  <div className="text-xl text-gray-600 font-bold w-8 text-center">
                    {member.counts[label] ?? 0}
                  </div>
                  <button
                    className="size-8 rounded-full"
                    onClick={() => onAdd(member.userId, label)}
                  >
                    <span className="text-gray-600 text-2xl font-bold">＋</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
