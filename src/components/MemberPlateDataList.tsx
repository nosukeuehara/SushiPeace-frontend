import type { MemberPlates } from "@/types";

type Props = {
  otherMembers: MemberPlates[];
  prices: Record<string, number>;
};

export const MemberPlateDataList = ({ otherMembers, prices }: Props) => {
  return (
    <div className="flex flex-col mb-16">
      {otherMembers.map((m) => {
        const total = Object.entries(m.counts).reduce(
          (sum, [plate, count]) => sum + count * (prices[plate] ?? 0),
          0,
        );
        const totalPlates = Object.values(m.counts).reduce((a, b) => a + b, 0);

        return (
          <div key={m.userId} className="flex justify-between items-baseline">
            <span className="text-base font-semibold text-gray-600">{m.name}</span>
            <span className="text-sm text-gray-600">
              {totalPlates}皿 / {total.toLocaleString()}円
            </span>
          </div>
        );
      })}
    </div>
  );
};
