import type { MemberPlates } from "@/types";
import { calcTotal, calcTotalPerMember } from "./utils";

export function generateShareText(
  groupName: string,
  members: MemberPlates[],
  shareUrl: string,
): string {
  return `🍣 ${groupName}の会計\n\n${generateShareTotalText(members)}\n${generateShareMemberText(members)}\n\n🔗 ${shareUrl}`;
}

export function generateShareMemberText(members: MemberPlates[]) {
  const memberTexts = members.map((m) => {
    const subtotal = calcTotalPerMember(m);
    return `🍵 ${m.name}：${subtotal.toLocaleString()}円`;
  });

  return memberTexts.join("\n");
}

export function generateShareTotalText(members: MemberPlates[]): string {
  const total = calcTotal(members);

  return `合計金額：${total.toLocaleString()}円`;
}
