import { Outlet } from "@remix-run/react";

export default function Index() {
  return (
    <div>
      <h1>Login</h1>
      <Outlet />
    </div>
  );
}
