import type { MemberPlates } from "../types/plate";
import "./MemberPlateCounter.css";

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
      <div className="member-header">
        <h4>{member.name}</h4>
        <p>合計: {total} 円</p>
      </div>
      <div className="sushi-plates">
        {Object.keys(prices).map((color) => (
          <div key={color} className="sushi-plate">
            <div className="sushi-plate__label">{color}皿</div>
            {!readonly ? (
              <div className="sushi-plate__counter">
                <button
                  className="sushi-plate__counter--minus"
                  onClick={() => onRemove(member.userId, color)}
                >
                  −
                </button>
                <div className="sushi-plate__num">
                  {member.counts[color] ?? 0}
                </div>
                <button
                  className="sushi-pate__counter--plus"
                  onClick={() => onAdd(member.userId, color)}
                >
                  ＋
                </button>
              </div>
            ) : (
              <div className="sushi-plate__counter--readonly">
                <div className="sushi-plate__num--readonly">
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
