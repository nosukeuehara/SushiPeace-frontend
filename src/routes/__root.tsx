import { Maintenance } from "@/components/page/Maintenace";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === "true";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="sm:w-full md:w-full lg:w-1/3 mx-auto">
        <header className="flex justify-center max-w-xl mx-auto py-3 bg-rose-300">
          <a className="text-2xl font-bold text-neutral-50 font-[Outfit]" href="/">
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
              className="text-neutral-50 ml-2 text-sm "
            >
              改善フォーム
              <img className="inline w-4 h-4 ml-1" src="./externalLink.svg" alt="External Link" />
            </a>
          </div>
          <span className="text-sm text-neutral-50">
            © {new Date().getFullYear() - 1} SushiPals
          </span>
        </footer>
        {import.meta.env.DEV ? <TanStackRouterDevtools /> : null}
      </div>
    </>
  ),
});
