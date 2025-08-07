import type { MemberPlates } from "../types/plate";

export function generateShareText(
  groupName: string,
  members: MemberPlates[],
  prices: Record<string, number>,
  shareUrl: string
): string {
  let total = 0;

  const memberTexts = members.map((m) => {
    const subtotal = Object.entries(m.counts).reduce(
      (sum, [color, count]) => sum + count * (prices[color as string] ?? 0),
      0
    );
    total += subtotal;
    return `- ${m.name}：${subtotal.toLocaleString()}円`;
  });

  return `🍣 ${groupName}の会計\n\n合計金額：${total.toLocaleString()}円\n${memberTexts.join(
    "\n"
  )}\n\n🔗 ${shareUrl}`;
}
