
import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import PolicySimulator from "../pages/policy-simulator/page";
import RegionMap from "../pages/region-map/page";
import HealthDashboard from "../pages/health-dashboard/page";
import PolicyVoting from "../pages/policy-voting/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/policy-simulator",
    element: <PolicySimulator />,
  },
  {
    path: "/region-map",
    element: <RegionMap />,
  },
  {
    path: "/health-dashboard",
    element: <HealthDashboard />,
  },
  {
    path: "/policy-voting",
    element: <PolicyVoting />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
