import type { MemberPlates } from "@/types";
import { calcTotalPerMember } from "@/util/utils";

type Props = {
  otherMembers: MemberPlates[];
};

export const MemberPlateDataList = ({ otherMembers }: Props) => {
  return (
    <div className="flex flex-col mb-16">
      {otherMembers.map((m) => {
        const totalPlates = Object.values(m.counts).reduce((a, b) => a + b, 0);

        return (
          <div key={m.userId} className="flex justify-between items-baseline">
            <span className="text-base font-semibold text-gray-600">{m.name}</span>
            <span className="text-sm text-gray-600">
              {totalPlates}皿 / {calcTotalPerMember(m).toLocaleString()}円
            </span>
          </div>
        );
      })}
    </div>
  );
};
