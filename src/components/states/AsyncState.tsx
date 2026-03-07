import type { ReactNode } from "react";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import NoDataState from "./NoDataState";

type QueryLike<T> = {
  isLoading: boolean;
  error: unknown;
  data: T | undefined | null;
};

type Props<T> = {
  query: QueryLike<T>;
  children: (data: T) => ReactNode;
  className?: string;
  loadingText?: string;
  noDataText?: string;
  isEmpty?: (data: T) => boolean;
};

export const AsyncState = <T,>({
  query,
  children,
  className = "mx-auto max-w-xl min-h-screen pt-[20%]",
  loadingText = "読み込み中...",
  noDataText = "データが存在しません",
  isEmpty,
}: Props<T>) => {
  if (query.isLoading) {
    return <LoadingState className={className} loadingText={loadingText} />;
  }

  if (query.error) {
    return <ErrorState className={className} />;
  }

  if (query.data == null) {
    return <NoDataState className={className} message={noDataText} />;
  }

  if (isEmpty?.(query.data)) {
    return <NoDataState className={className} message={noDataText} />;
  }

  return <>{children(query.data)}</>;
};
