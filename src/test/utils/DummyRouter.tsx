import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { type FC, type ReactNode } from "react";

export const DummyRouter: FC<{ component: () => ReactNode }> = ({ component }) => {
  const rootRoute = createRootRoute({
    component: Outlet,
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component,
  });

  const routeTree = rootRoute.addChildren([indexRoute]);
  const history = createMemoryHistory({ initialEntries: ["/"] });
  const router = createRouter({ routeTree, history });
  return <RouterProvider router={router} />;
};
