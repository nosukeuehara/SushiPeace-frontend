export type Member = {
  userId: string;
  name: string;
};

export type Room = {
  groupName: string;
  members: Member[];
};
