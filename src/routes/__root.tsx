// このファイルは全てのページのラッパーコンポーネントを定義。
// トップレベルのルートになる
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "./__root.css";

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="header_container">
        <a className="header_container__home header_homelink" href="/">
          sushi-pals!!
        </a>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
