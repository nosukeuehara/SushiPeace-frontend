// このファイルは全てのページのラッパーコンポーネントを定義。
// トップレベルのルートになる
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Maintenance } from "@/components/page/maintenance/Maintenance";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === "true";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="sm:w-full md:w-full lg:w-1/3 mx-auto">
        <Header />
        <main className="max-w-screen mx-auto bg-neutral-50">
          {isMaintenance ? <Maintenance /> : <Outlet />}
        </main>
        <Footer />
        {import.meta.env.DEV ? <TanStackRouterDevtools /> : null}
      </div>
    </>
  ),
});
