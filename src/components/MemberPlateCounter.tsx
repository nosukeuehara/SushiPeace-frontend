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
      <p>合計: {total} 円</p>
      <h4>{member.name}</h4>
      {Object.keys(prices).map((color) => (
        <div key={color}>
          {color}皿: {member.counts[color] ?? 0}
          {!readonly && (
            <>
              <button onClick={() => onAdd(member.userId, color)}>＋</button>
              <button onClick={() => onRemove(member.userId, color)}>−</button>
            </>
          )}
        </div>
      ))}
      <hr />
    </div>
  );
};
