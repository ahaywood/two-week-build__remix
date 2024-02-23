import { Outlet } from "@remix-run/react";

export default function Index() {
  return (
    <div>
      <h1>Interior</h1>
      <Outlet />
    </div>
  );
}
