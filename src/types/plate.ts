export type PlateTemplate = {
  id: string;
  name: string;
  prices: Record<string, number>;
};

export type MemberPlates = {
  userId: string;
  name: string;
  counts: Record<string, number>;
};
