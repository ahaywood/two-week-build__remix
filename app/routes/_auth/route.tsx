import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import Footer from "~/components/Footer";
import { MobileNav } from "../_app/MobileNav";
import { MetaFunction } from "@remix-run/node";
import { constants } from "~/lib/constants";

/** -------------------------------------------------
* META DATA
---------------------------------------------------- */
export const meta: MetaFunction = () => {
  return [{ "og:image": constants.OG_IMAGE }];
};

/** -------------------------------------------------
* COMPONENT
---------------------------------------------------- */
export default function Index() {
  const location = useLocation();

  return (
    <div className="background-arrowAuth">
      <div className="page-grid min-h-screen">
        {/* TODO: Check the reset password page */}
        {/* we still want to pass in the current user because on pages, like
          the reset password page, users will be logged in */}
        <MobileNav
          pathname={location.pathname}
          isUserLoggedIn={false}
          username={""}
        />
        <aside className="p-8 absolute md:fixed top-0 left-0">
          <a href="/">
            <img src="/images/logo.svg" alt="Two Week Build Challenge" />
          </a>
        </aside>
        <main className="col-span-12 px-page md:px-0 md:col-start-3 md:col-span-8 lg:col-start-5 lg:col-span-4 pt-[200px]">
          <div className="content auth-content">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
