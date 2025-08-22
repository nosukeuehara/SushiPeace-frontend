import {StrictMode} from "react";
import ReactDOM from "react-dom/client";
import {RouterProvider, createRouter} from "@tanstack/react-router";
import {routeTree} from "./routeTree.gen";

const router = createRouter({routeTree});

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <div className="bg-red-50">
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </div>
    </StrictMode>
  );
}
