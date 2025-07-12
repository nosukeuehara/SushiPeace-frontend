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
    <div className="group-room__member-list">
      {members.map((m) => (
        <div
          key={m.userId}
          className={`member-wrapper ${
            m.userId === currentUserId
              ? "member-wrapper--self"
              : "member-wrapper--readonly"
          }`}
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
