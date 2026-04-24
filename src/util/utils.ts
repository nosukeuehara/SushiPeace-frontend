import type { MemberPlates } from "@/types";

type SplitMembersResult = {
  currentUser: MemberPlates | undefined;
  otherMembers: MemberPlates[];
};

export function splitMembersByCurrentUser(
  members: MemberPlates[],
  currentUserId: string,
): SplitMembersResult {
  const currentMember = members.find((m) => m.userId === currentUserId);
  const otherMembers = members.filter((m) => m.userId !== currentUserId);
  return { currentUser: currentMember, otherMembers };
}

export function calcTotal(m: MemberPlates, prices: Record<string, number>): number {
  return Object.entries(m.counts).reduce(
    (sum, [plate, count]) => sum + count * (prices[plate] ?? 0),
    0,
  );
}
