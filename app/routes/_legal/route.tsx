// Reference: https://www.perplexity.ai/search/I-have-a-bqCmKkTPQimXhW4fiLr5Hw?s=c

import { Outlet } from "@remix-run/react";
import Footer from "~/components/Footer";

export default function LegalLayout() {
  return (
    <div className="bg-interior bg-no-repeat">
      <div className="page-grid min-h-screen">
        <aside className="p-page md:p-8 md:fixed col-span-12">
          <a href="/">
            <img src="/images/logo.svg" alt="Two Week Build Challenge" />
          </a>
        </aside>
        <main className="col-span-12 md:col-start-5 md:col-span-6 md:pt-[130px] px-page md:px-0">
          <h1 className="text-springBud text-4xl md:text-6xl lg:text-8xl font-mono leading-none mb-8 -tracking-tight">
            Legal
          </h1>
          <div className="content">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
