// plate.ts
export const plateColors = ["赤", "青", "黄"] as const;

export type PlateColor = typeof plateColors[number];

export type PriceMap = {
  [color in PlateColor]: number;
};

export type MemberPlates = {
  userId: string;
  name: string;
  counts: PriceMap;
};

export type PlateTemplate = {
  id: string;
  name: string;
  prices: PriceMap;
};
