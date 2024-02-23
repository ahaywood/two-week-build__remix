import { Outlet } from "@remix-run/react";

export default function Index() {
  return (
    <div>
      YOLO
      <Outlet />
    </div>
  );
}
