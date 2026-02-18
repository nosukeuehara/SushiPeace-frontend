export type PlateTemplate = {
  prices: Record<string, number>;
};

export type MemberPlates = {
  userId: string;
  name: string;
  counts: Record<string, number>;
};
