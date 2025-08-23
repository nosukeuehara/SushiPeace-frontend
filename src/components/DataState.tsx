import type {ReactNode} from "react";

type Props<T> = {
  isLoading: boolean;
  error: unknown;
  data: T | undefined | null;
  children: ReactNode;
  className?: string;
  loadingText?: string;
  noDataText?: string;
};

export const DataState = <T,>({
  isLoading,
  error,
  data,
  children,
  className = "mx-auto mt-5 max-w-xl min-h-screen",
  loadingText = "読み込み中...",
  noDataText = "データが存在しません",
}: Props<T>) => {
  if (isLoading) return <p className={className}>{loadingText}</p>;
  if (error) return <p>エラーが発生しました: {(error as Error).message}</p>;
  if (!data) return <p>{noDataText}</p>;
  return <>{children}</>;
};
