import {Link} from "@tanstack/react-router";

export const Route = createFileRoute({
  component: Home,
});

function Home() {
  return (
    <div className="text-center min-h-screen px-5 py-16 bg-rose-300 max-w-xl mx-auto">
      <h1 className="mb-6 text-4xl text-left font-extrabold text-neutral-50">
        自分の皿は<br></br>
        自分で管理運営
      </h1>
      <p className="mb-4 text-left text-neutral-50">
        友達との回転寿司、何皿食べたか数えられなくて会計が面倒じゃないですか？
        <br></br>
        このアプリは、食べた皿をその場で記録して自動で金額を計算、スムーズに明細を共有できる無料のサービスです。
      </p>
      <Link
        to="/new-sushi"
        className="block px-4 py-2 font-bold text-rose-300 bg-neutral-100 shadow"
      >
        Let's Sushi
      </Link>
    </div>
  );
}
