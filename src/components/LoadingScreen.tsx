export default function LoadingScreen({
  className,
  loadingText,
}: {
  className?: string;
  loadingText?: string;
}) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="h-13 w-13 animate-spin rounded-full border-4 border-gray-200 border-t-blue-400" />
      <p className="mt-3 text-base text-gray-700">{loadingText}</p>
    </div>
  );
}
