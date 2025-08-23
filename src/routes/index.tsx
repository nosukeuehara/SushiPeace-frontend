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

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold text-left text-neutral-50">
          使い方
        </h2>
        <ol className="flex flex-col gap-8 text-neutral-50">
          <li className="text-left">
            <p className="mb-2">1. ルームを作成します</p>
            <img
              src="/how-to/01-room.png"
              alt="ルームを作成する画面"
              className="w-full rounded shadow"
            />
          </li>
          <li className="text-left">
            <p className="mb-2">2. 招待リンクを共有します</p>
            <img
              src="/how-to/02-share-link.png"
              alt="リンクを共有する画面"
              className="w-full rounded shadow"
            />
          </li>
          <li className="text-left">
            <p className="mb-2">3. 参加者が自分を選択します</p>
            <img
              src="/how-to/03-who-are-you.png"
              alt="参加者を選択する画面"
              className="w-full rounded shadow"
            />
          </li>
          <li className="text-left">
            <p className="mb-2">4. 食べた皿をタップして記録します</p>
            <img
              src="/how-to/04-roompage.png"
              alt="皿をタップして記録する画面"
              className="w-full rounded shadow"
            />
          </li>
          <li className="text-left">
            <p className="mb-2">5. 枚数に応じて金額が自動計算されます</p>
            <img
              src="/how-to/05-roompage.png"
              alt="金額が自動計算される画面"
              className="w-full rounded shadow"
            />
          </li>
          <li className="text-left">
            <p className="mb-2">6. 食べた皿を確認しながら楽しみます</p>
            <img
              src="/how-to/06-roompage.png"
              alt="食べた皿を確認する画面"
              className="w-full rounded shadow"
            />
          </li>
          <li className="text-left">
            <p className="mb-2">7. 結果ページで明細を確認します</p>
            <img
              src="/how-to/07-result.png"
              alt="結果を確認する画面"
              className="w-full rounded shadow"
            />
          </li>
        </ol>
      </section>
    </div>
  );
}
