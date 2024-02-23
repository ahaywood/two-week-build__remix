import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Two Week Build" },
    {
      name: "description",
      content:
        "A Two Week Build Challenge. The rules are simple. Pick something to build. Build it in 2 weeks. Ship it.",
    },
  ];
};

export default function Index() {
  return (
    <div>
      YOLO
      <Outlet />
    </div>
  );
}
