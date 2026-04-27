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

export function calcTotal(m: MemberPlates): number {
  return Object.entries(m.counts).reduce((sum, [price, count]) => sum + Number(price) * count, 0);
}
