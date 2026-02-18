import { MemberPlateCounter } from "./MemberPlateCounter";
import type { MemberPlates } from "@/types";

type Props = {
  members: MemberPlates[];
  currentUserId: string;
  prices: Record<string, number>;
  onAdd: (userId: string, color: string) => void;
  onRemove: (userId: string, color: string) => void;
};

export const MemberList = ({ members, currentUserId, prices, onAdd, onRemove }: Props) => {
  const sortedMembers = [
    ...members.filter((m) => m.userId === currentUserId),
    ...members.filter((m) => m.userId !== currentUserId),
  ];

  return (
    <div className="flex flex-col">
      {sortedMembers.map((m) => {
        const total = Object.entries(m.counts).reduce(
          (sum, [color, count]) => sum + count * (prices[color] ?? 0),
          0,
        );
        const totalPlates = Object.values(m.counts).reduce((a, b) => a + b, 0);

        const isCurrentUser = m.userId === currentUserId;

        return (
          <div
            key={m.userId}
            className={
              isCurrentUser
                ? "scale-105 p-2"
                : "opacity-60 scale-95 px-2 py-4 border-t border-gray-200"
            }
          >
            {isCurrentUser ? (
              <MemberPlateCounter member={m} onAdd={onAdd} onRemove={onRemove} prices={prices} />
            ) : (
              <div className="flex justify-between items-baseline">
                <span className="text-base font-semibold text-gray-600">{m.name}</span>
                <span className="text-sm text-gray-600">
                  {totalPlates}皿 / {total.toLocaleString()}円
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
