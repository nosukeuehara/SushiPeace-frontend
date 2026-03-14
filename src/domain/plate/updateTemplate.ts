// wip: 皿の金額編集機能のリファクタリング
import type { PlateTemplate } from "@/types";

export function removePlate(targetColor: string, template: PlateTemplate): PlateTemplate {
  const updated = { ...template.prices };
  delete updated[targetColor];
  return { ...template, prices: updated };
}

export function addPlate(newColor: string, price: number, template: PlateTemplate): PlateTemplate {
  const updated = { ...template.prices };
  updated[newColor] = price;
  return { ...template, prices: updated };
}

export function overwritePlatePrice(
  originalColor: string,
  newColor: string,
  template: PlateTemplate,
): PlateTemplate {
  const updated = { ...template.prices };
  const price = updated[originalColor];
  delete updated[originalColor];
  updated[newColor] = price;
  return { ...template, prices: updated };
}
