export default function ErrorScreen({
  className,
  message = "ページを読み込めませんでした。",
  onRetry,
}: {
  className: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <h1 className="text-lg font-semibold text-gray-800 mb-1">
        エラーが発生しました
      </h1>
      <p className="text-sm text-gray-600 max-w-xs">{message}</p>
      <button
        onClick={onRetry ?? (() => location.reload())}
        className="mt-4 bg-rose-400 px-4 py-2 text-sm font-bold text-white transition-colors"
      >
        再読み込み
      </button>
    </div>
  );
}
