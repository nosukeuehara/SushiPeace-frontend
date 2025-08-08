// このファイルは全てのページのラッパーコンポーネントを定義。
// トップレベルのルートになる
import {createRootRoute, Outlet} from "@tanstack/react-router";
import {TanStackRouterDevtools} from "@tanstack/react-router-devtools";

// 外部リンクアイコンのスタイル
const externalLinkStyle = `
  .external-link::after {
    content: "";
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-left: 4px;
    background-color: currentColor;
    mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>');
    mask-repeat: no-repeat;
    mask-size: contain;
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>');
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: contain;
  }
`;

export const Route = createRootRoute({
  component: () => (
    <>
      <style dangerouslySetInnerHTML={{__html: externalLinkStyle}} />
      <header className="flex justify-center py-4 bg-orange-600">
        <a
          className="text-2xl font-bold text-neutral-100 font-[Outfit]"
          href="/"
        >
          SushiPals
        </a>
      </header>
      <div className="container h-screen max-w-screen mx-auto px-4">
        <Outlet />
      </div>
      <footer className="flex justify-center py-4 flex-col items-center bg-neutral-100">
        <div className="mb-5 mt-2">
          <a
            href="https://forms.gle/pm4nnWRqcaiEgMCb6"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 ml-2 external-link text-sm "
          >
            改善フォーム
          </a>
        </div>
        <span className="text-sm text-gray-600">© 2025 SushiPals</span>
      </footer>
      <TanStackRouterDevtools />
    </>
  ),
});
