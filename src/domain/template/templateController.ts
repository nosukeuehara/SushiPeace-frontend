import type { PlateTemplate } from "@/types";

export function removePlate(targetLabel: string, template: PlateTemplate): PlateTemplate {
  const updated = { ...template.prices };
  delete updated[targetLabel];
  return { ...template, prices: updated };
}

export function addPlate(price: number, template: PlateTemplate): PlateTemplate {
  const updated = { ...template.prices };
  updated[price] = price;
  return { ...template, prices: updated };
}

export function updatePlate(
  oldLabel: string,
  newPrice: number,
  template: PlateTemplate,
): PlateTemplate {
  const updated = { ...template.prices };
  delete updated[oldLabel];
  updated[newPrice] = newPrice;
  return { ...template, prices: updated };
}

import type { MemberPlates } from "@/types";

export function removePlateCounts(targetLabel: string, members: MemberPlates[]): MemberPlates[] {
  return members.map((member) => {
    const updatedCounts = { ...member.counts };
    delete updatedCounts[targetLabel];
    return { ...member, counts: updatedCounts };
  });
}

export function renamePlateCounts(
  oldLabel: string,
  newPrice: number,
  members: MemberPlates[],
): MemberPlates[] {
  const newLabel = newPrice;

  return members.map((member) => {
    const updatedCounts = { ...member.counts };
    const currentCount = updatedCounts[oldLabel];

    if (currentCount === undefined) {
      return member;
    }

    delete updatedCounts[oldLabel];
    updatedCounts[newLabel] = currentCount;

    return { ...member, counts: updatedCounts };
  });
}
