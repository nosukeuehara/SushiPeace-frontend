import {Link} from "@tanstack/react-router";

export const Route = createFileRoute({
  component: Home,
});

function Home() {
  return (
    <main className="text-center rounded-xl sm:max-w-[480px] sm:mx-auto sm:my-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-700">SushiPalsへようこそ</h1>
      <p className="mb-4 text-base text-gray-600">
        SushiPalsは回転寿司のお皿管理をみんなで楽しめるサービスです。
      </p>
      <Link
        to="/sushi"
        className="inline-block px-4 py-2 font-bold text-neutral-100 bg-orange-600 rounded shadow"
      >
        🍣 はじめる
      </Link>
    </main>
  );
}
