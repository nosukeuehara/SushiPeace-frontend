interface NoDataScreenProps {
  className?: string;
  message?: string;
  onRetry?: () => void;
}

export default function NoDataScreen({
  className,
  message = "データが存在しません。",
}: NoDataScreenProps) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <h1 className="text-2xl font-semibold text-gray-700 mb-1">データなし</h1>
      <p className="text-lg text-gray-500 max-w-xs">{message}</p>
    </div>
  );
}
