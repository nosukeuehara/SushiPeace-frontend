import React from "react";

export const ActionButtonsRow = ({ children }: { children: React.ReactNode }) => {
  return <div className="grid gap-2 pb-2 grid-cols-2">{children}</div>;
};
