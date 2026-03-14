export const RequireReloadPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-6 py-16">
      <div className="w-full max-w-md rounded-xs border border-neutral-200 bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          !
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">データを読み込めませんでした</h1>
        <p className="mt-3 text-sm text-gray-500">
          ページを再読み込みしても改善しない場合は、時間をおいて再度お試しください。
        </p>
        <button
          type="button"
          className="mt-6 inline-flex items-center justify-center rounded-xs bg-teal-600 px-6 py-2 text-sm font-semibold text-white shadow"
          onClick={() => window.location.reload()}
        >
          ページを再読み込み
        </button>
      </div>
    </div>
  );
};
