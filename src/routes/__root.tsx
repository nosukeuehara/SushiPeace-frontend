// このファイルは全てのページのラッパーコンポーネントを定義。
// トップレベルのルートになる
import {Maintenance} from "@/components/page/Maintenace";
import {createRootRoute, Outlet} from "@tanstack/react-router";
import {TanStackRouterDevtools} from "@tanstack/react-router-devtools";

const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === "true";

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
      <div className="sm:w-full md:w-full lg:w-1/3 mx-auto">
        <header className="flex justify-center max-w-xl mx-auto py-3 bg-rose-300">
          <a
            className="text-2xl font-bold text-neutral-50 font-[Outfit]"
            href="/"
          >
            SushiPals
          </a>
        </header>
        <main className="max-w-screen mx-auto bg-neutral-50">
          {isMaintenance ? <Maintenance /> : <Outlet />}
        </main>
        <footer className="flex justify-center max-w-xl mx-auto py-4 flex-col items-center bg-rose-300">
          <div className="mb-2 mt-2">
            <a
              href="https://forms.gle/pm4nnWRqcaiEgMCb6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-50 ml-2 external-link text-sm "
            >
              改善フォーム
            </a>
          </div>
          <span className="text-sm text-neutral-50">© 2025 SushiPals</span>
        </footer>
        <TanStackRouterDevtools />
      </div>
    </>
  ),
});
