import {Link} from "@tanstack/react-router";

export const Route = createFileRoute({
  component: Home,
});

type Step = {
  n: number;
  title: string;
  caption: string;
  img: string;
  alt: string;
};

const steps: Step[] = [
  {
    n: 1,
    title: "ルームを作成します",
    caption:
      "人数やグループ名を入れて開始。\nグループ名は必須です。メンバーは二人以上で登録してください。",
    img: "/how-to/01-room.png",
    alt: "ルームを作成する画面",
  },
  {
    n: 2,
    title: "招待リンクを共有します",
    caption:
      "LINEやAirDropでサッと共有。\n友達に送ってみんなで寿司ルームに集まろう！",
    img: "/how-to/02-share-link.png",
    alt: "リンクを共有する画面",
  },
  {
    n: 3,
    title: "リンク先の画面",
    caption: "自分の名前を選択します。間違っても後から変更可能です！",
    img: "/how-to/03-who-are-you.png",
    alt: "参加者を選択する画面",
  },
  {
    n: 4,
    title: "お皿の金額を設定",
    caption:
      "初めの一皿の金額を登録。\n二皿目以降は初めに登録した情報を使用できます。登録した皿の情報はグループ全員に共有されるのでみんなで利用可能！一括登録も可能です。",
    img: "/how-to/04-roompage.png",
    alt: "皿をタップして記録する画面",
  },
  {
    n: 5,
    title: "食べた皿をタップで記録",
    caption:
      "今の合計や内訳が一目で分かる。\n思ったより食べすぎちゃったを防止！逆に大食いに振り切るもよし。楽しく食べよう！",
    img: "/how-to/05-roompage.png",
    alt: "金額が自動計算される画面",
  },
  {
    n: 6,
    title: "通知で現在の金額を把握",
    caption:
      "リアルタイムでグループの金額が通知されるので安心して回転寿司に集中できます！",
    img: "/how-to/06-roompage.png",
    alt: "食べた皿を確認する画面",
  },
  {
    n: 7,
    title: "結果ページで明細を確認",
    caption:
      "綺麗に割勘じゃない、自分が食べた分の金額が分かって安心！\n結果画面をコピーして共有も可能です。",
    img: "/how-to/07-result.png",
    alt: "結果を確認する画面",
  },
];

function StepCard({n, title, caption, img, alt}: Step) {
  return (
    <figure className="group relative overflow-hidden bg-neutral-50 shadow-sm transition">
      <div className="pt-10 pb-4 font-extrabold text-rose-300 text-2xl text-center">
        {title}
      </div>
      <img
        src={img}
        alt={alt}
        loading="lazy"
        className=" p-2 w-full aspect-auto object-cover"
      />
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 grid h-9 w-9 place-items-center shadow bg-rose-300 text-white text-xl font-bold"
      >
        {n}
      </span>

      <figcaption className="px-4 pt-4 pb-10">
        <p className=" text-gray-700 whitespace-pre-line">{caption}</p>
      </figcaption>
    </figure>
  );
}

function Home() {
  return (
    <div className="text-center max-w-xl mx-auto">
      <div className="flex flex-col justify-between px-5 pt-16 pb-8 bg-rose-300 min-h-[52vh]">
        <div className="flex flex-col gap-10">
          <h1 className="text-4xl text-left font-extrabold text-neutral-50">
            自分の皿は<br></br>
            自分で管理運営
          </h1>
          <p className=" text-left text-neutral-50">
            友達との回転寿司、何皿食べたか数えられなくて会計が面倒じゃないですか？
            <br></br>
            このアプリは、食べた皿をその場で記録して自動で金額を計算、スムーズに明細を共有できる無料のサービスです。
          </p>
        </div>
        <Link
          to="/new-sushi"
          className="block px-4 py-2 font-bold text-rose-300 bg-neutral-100 shadow"
        >
          Let's Sushi
        </Link>
      </div>

      {/* How to */}
      <section className="px-5 py-16 bg-neutral-50 text-left">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700 text-center">
            <span className="font-[Outfit]">SushiPals</span> 機能紹介
          </h2>
          <p className="mt-2 text-center text-gray-500">
            すぐ始められます！（アカウント登録不要）
          </p>
        </header>

        {/* レスポンシブグリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s) => (
            <StepCard key={s.n} {...s} />
          ))}
        </div>

        {/* 補助CTA（任意） */}
        <div className="mt-10 text-center">
          <Link
            to="/new-sushi"
            className="block justify-center bg-rose-300 px-4 py-2 font-bold text-white shadow"
          >
            Let's Sushi
          </Link>
        </div>
      </section>
    </div>
  );
}
