import {MemberPlateCounter} from "../../../../../components/MemberPlateCounter";
import type {MemberPlates} from "../../../../../types/plate";

type Props = {
  members: MemberPlates[];
  currentUserId: string;
  prices: Record<string, number>;
  onAdd: (userId: string, color: string) => void;
  onRemove: (userId: string, color: string) => void;
};

export const MemberList = ({
  members,
  currentUserId,
  prices,
  onAdd,
  onRemove,
}: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {members.map((m) => (
        <div
          key={m.userId}
          className={
            m.userId === currentUserId
              ? "scale-105 p-2"
              : "opacity-60 scale-95"
          }
        >
          <MemberPlateCounter
            member={m}
            onAdd={onAdd}
            onRemove={onRemove}
            readonly={m.userId !== currentUserId}
            prices={prices}
          />
        </div>
      ))}
    </div>
  );
};
