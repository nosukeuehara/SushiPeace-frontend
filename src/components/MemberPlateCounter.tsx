import {
  plateColors,
  type MemberPlates,
  type PlateColor,
} from "../types/plate";

type Props = {
  member: MemberPlates;
  onAdd: (userId: string, color: PlateColor) => void;
  onRemove: (userId: string, color: PlateColor) => void;
  readonly?: boolean;
  prices: Record<PlateColor, number>;
};

export const MemberPlateCounter = ({
  member,
  onAdd,
  onRemove,
  readonly,
  prices,
}: Props) => {
  return (
    <div>
      <p>
        合計:{" "}
        {Object.entries(member.counts).reduce(
          (sum, [color, count]) => sum + count * prices[color as PlateColor],
          0
        )}{" "}
        円
      </p>
      <h4>{member.name}</h4>
      {plateColors.map((color) => (
        <div key={color}>
          {color}皿: {member.counts[color]}
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
