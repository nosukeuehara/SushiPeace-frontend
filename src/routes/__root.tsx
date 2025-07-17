// このファイルは全てのページのラッパーコンポーネントを定義。
// トップレベルのルートになる
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="flex justify-center py-4 bg-orange-700">
        <a className="text-2xl font-bold text-white font-[Outfit]" href="/">
          sushi-pals!!
        </a>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
