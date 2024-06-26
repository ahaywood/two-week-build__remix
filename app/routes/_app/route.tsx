import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import Footer from "~/components/Footer";
import { MyAccountMenu } from "./MyAccountMenu";
import { Search } from "~/components/Search";
import { createSupabaseServerClient } from "~/supabase.server";
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { TopNav } from "./TopNav";
import { MobileNav } from "./MobileNav";
import { AddUpdateButton } from "./AddUpdateButton";
import { MyAccount } from "./MyAccount";
import { LoginButton } from "~/components/LoginButton";
import { EditProfileButton } from "~/components/EditProfileButton";
import { constants } from "~/lib/constants";
import { AddProjectButton } from "./AddProjectButton";
import { SignUpButton } from "~/components/SignUpButton";
import { currentMonth, currentYear } from "~/lib/dateHelpers";

/** -------------------------------------------------
* LOADER
---------------------------------------------------- */
export async function loader({ request }: LoaderFunctionArgs) {
  // get the current Supabase user session
  const supabase = createSupabaseServerClient(request);
  const { data, error } = await supabase.auth.getUser();
  if (error) console.error(error);

  // if the user is logged in, get their details
  let result;
  if (data.user) {
    // get the details for the current, logged in user
    result = await supabase
      .from("users")
      .select("name, username, avatar, projects(id, cohorts(id, year, month))")
      .eq("auth_id", data.user.id)
      .single();
  }
  if (result?.error) console.error(result.error);

  // send the user data to the component
  return {
    data: {
      ...result?.data,
      user: {
        email: data?.user?.email,
      },
    },
  };
}

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
  const { data } = useLoaderData<typeof loader>();
  const location = useLocation();

  const projectInCurrentCohort = (projects) => {
    if (projects) {
      return !!projects.find(
        (project) =>
          project.cohorts.year === currentYear &&
          project.cohorts.month === currentMonth
      );
    }
    return false;
  };

  return (
    <div className="bg-arrowLeft bg-no-repeat">
      <div className="hidden absolute right-8 top-8 lg:flex justify-end gap-4">
        <Search />
        <EditProfileButton username={data?.username} />
        <SignUpButton isUserLoggedIn={!!data?.user?.email} />
        <LoginButton isUserLoggedIn={!!data?.user?.email} />
      </div>

      <div>
        <aside className="lg:fixed border-r-[#2f2f2f] border-r-2 lg:h-screen w-screen lg:w-[200px] flex lg:flex-col justify-between">
          <div className="p-8 pb-0 w-full lg:block">
            <a href="/me">
              <img
                src="/images/logo.svg"
                alt="Two Week Build Challenge"
                className="mb-10"
              />
            </a>
          </div>

          {/* mobile nav */}
          <MobileNav
            pathname={location.pathname}
            isUserLoggedIn={!!data?.user?.email}
            username={data?.username}
          />

          {/* top navigation */}
          <div className="hidden p-8 pt-0 w-full h-full lg:block">
            <TopNav
              pathname={location.pathname}
              isUserLoggedIn={!!data?.user?.email}
              currentUsername={data?.username}
            />
          </div>

          {/* bottom navigation */}
          {data?.user?.email && (
            <div className="p-3 hidden lg:block">
              {data?.projects?.length < 1 ||
              !projectInCurrentCohort(data.projects) ? (
                <AddProjectButton />
              ) : (
                <AddUpdateButton currentUsername={data?.username} />
              )}
              <div className="flex gap-2 justify-between items-center">
                <MyAccount
                  name={data.name}
                  username={data.username}
                  avatar={data.avatar}
                />
                <MyAccountMenu />
              </div>
            </div>
          )}
        </aside>
        <main className="lg:pl-[200px] pt-[20px] lg:pt-[80px]">
          <Outlet />

          <Footer />
        </main>
      </div>
    </div>
  );
}
