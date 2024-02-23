import { Outlet } from "@remix-run/react";
import Footer from "~/components/Footer";

export default function Index() {
  return (
    <div className="bg-interior bg-no-repeat">
      <div className="page-grid min-h-screen">
        <aside className="p-page md:p-8 md:fixed col-span-12">
          <a href="/">
            <img src="/images/logo.svg" alt="Two Week Build Challenge" />
          </a>
        </aside>
        <main className="col-span-12 md:col-start-5 md:col-span-6 md:pt-[130px] px-page md:px-0">
          <div className="content legal-content">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
