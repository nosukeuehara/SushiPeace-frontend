import type { ReactNode } from "react";
import LoadingScreen from "./LoadingScreen";
import ErrorScreen from "./ErrorScreen";
import NoDataScreen from "./NoDataScreen";

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
  className = "mx-auto max-w-xl min-h-screen pt-[20%]",
  loadingText = "読み込み中...",
  noDataText = "ルームに関するデータが存在しません",
}: Props<T>) => {
  if (isLoading) return <LoadingScreen className={className} loadingText={loadingText} />;
  if (error) return <ErrorScreen className={className} />;
  if (!data || (Array.isArray(data) && data.length === 0))
    return <NoDataScreen className={className} message={noDataText} />;
  return <>{children}</>;
};
