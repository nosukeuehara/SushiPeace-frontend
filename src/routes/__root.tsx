// このファイルは全てのページのラッパーコンポーネントを定義。
// トップレベルのルートになる
import {createRootRoute, Outlet} from "@tanstack/react-router";
import {TanStackRouterDevtools} from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="flex justify-center py-4 bg-orange-600">
        <a
          className="text-2xl font-bold text-neutral-100 font-[Outfit]"
          href="/"
        >
          SushiPals
        </a>
      </header>
      <div className="container h-screen px-4">
        <Outlet />
      </div>
      <footer className="flex justify-center py-4 ">
        <span className="text-sm text-gray-600">© 2025 SushiPals</span>
      </footer>
      <TanStackRouterDevtools />
    </>
  ),
});
