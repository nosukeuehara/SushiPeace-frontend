import { Activity } from "react";

export function ErrorViewer({ error }: { error: Error | null }) {
  const isVisible = error !== null;
  return (
    <Activity mode={isVisible ? "visible" : "hidden"}>
      <p role="alert" className="mb-1 text-sm font-bold text-red-600 text-center">
        {error instanceof Error ? error.message : "ルーム作成に失敗しました"}
      </p>
    </Activity>
  );
}
