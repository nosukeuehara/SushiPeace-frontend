import type { MemberPlates } from "@/types";

type SplitMembersResult = {
  currentUser: MemberPlates | null;
  otherMembers: MemberPlates[];
};

export function splitMembersByCurrentUser(
  members: MemberPlates[],
  currentUserId: string | null,
): SplitMembersResult {
  if (!currentUserId) return { currentUser: null, otherMembers: members };
  const currentMember = members.find((m) => m.userId === currentUserId) ?? null;
  const otherMembers = members.filter((m) => m.userId !== currentUserId);
  return { currentUser: currentMember, otherMembers };
}
