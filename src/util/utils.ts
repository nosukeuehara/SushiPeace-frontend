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

export function calculateMemberAmount(m: MemberPlates): number {
  return Object.entries(m.counts).reduce((sum, [price, count]) => sum + Number(price) * count, 0);
}

export function calculateGroupAmount(members: MemberPlates[]): number {
  const total = members.reduce((t, m) => t + calculateMemberAmount(m), 0);

  return total;
}

export async function copyTextToClipboard(shareText: string) {
  await navigator.clipboard.writeText(shareText);
}

export function generateShareUrl(origin: string, roomId: string) {
  return new URL(`/new-sushi/group/${roomId}/result`, origin).toString();
}
