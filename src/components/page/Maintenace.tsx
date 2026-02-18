export const Maintenance = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-rose-100 via-rose-50 to-rose-100 text-center">
    <div className="animate-bounce mb-8">
      <span className="text-6xl">🍣</span>
    </div>

    <h1 className="text-3xl sm:text-4xl font-extrabold text-rose-400 mb-4 tracking-tight">
      ただいま<span className="text-rose-400">メンテナンス中</span>です
    </h1>

    <p className="text-gray-600 text-base sm:text-lg leading-relaxed px-6 max-w-md">
      いつも <span className="font-semibold text-rose-300">SushiPals</span> を ご利用いただき
      <br />
      ありがとうございます。
      <br />
      <br />
      快適にご利用いただくため、
      <br />
      現在メンテナンスを行っております。
      <br />
      しばらくしてから、またお越しください。
    </p>

    {/* 進行演出 */}
    <div className="mt-10 flex items-center gap-2 text-rose-400 animate-pulse">
      <span className="text-2xl">⏳</span>
      <span className="text-sm">もうしばらくお待ちください</span>
    </div>
  </div>
);
