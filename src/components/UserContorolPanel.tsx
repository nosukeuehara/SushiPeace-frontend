import type { MemberPlates } from "@/types";
import { PlateCounter } from "./PlateCounter";

type Props = {
  currentUser: MemberPlates;
  prices: Record<string, number>;
  onAdd: (userId: string, color: string) => void;
  onRemove: (userId: string, color: string) => void;
};

export function UserControlPanel({ currentUser, prices, onAdd, onRemove }: Props) {
  return <PlateCounter member={currentUser} onAdd={onAdd} onRemove={onRemove} prices={prices} />;
}
