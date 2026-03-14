import type { PlateTemplate } from "@/types";

export function removePlate(targetLabel: string, template: PlateTemplate): PlateTemplate {
  const updated = { ...template.prices };
  delete updated[targetLabel];
  return { ...template, prices: updated };
}

export function addPlate(price: number, template: PlateTemplate): PlateTemplate {
  const updated = { ...template.prices };
  updated[`${price}円皿`] = price;
  return { ...template, prices: updated };
}

export function overwritePlatePrice(
  oldColor: string,
  newColor: string,
  newPrice: number,
  template: PlateTemplate,
): PlateTemplate {
  const updated = { ...template.prices };
  delete updated[oldColor];
  updated[newColor] = newPrice;
  return { ...template, prices: updated };
}
