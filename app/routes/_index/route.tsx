import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Icon } from "~/components/Icon/Icon";

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
    <div className="text-white">
      YOLO
      <Icon name="github">GitHub</Icon>
      <Outlet />
    </div>
  );
}
