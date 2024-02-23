import { Outlet } from "@remix-run/react";
import Footer from "~/components/Footer";

export default function Index() {
  return (
    <div className="bg-no-repeat bg-arrowAuth">
      <div className="page-grid min-h-screen">
        <aside className="p-8 fixed">
          <a href="/">
            <img src="/images/logo.svg" alt="Two Week Build Challenge" />
          </a>
        </aside>
        <main className="col-start-5 col-span-4 pt-[200px]">
          <div className="content auth-content">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
