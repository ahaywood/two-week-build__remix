import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import Footer from "~/components/Footer";
import Newsletter from "~/components/Newsletter";
import { MyAccountMenu } from "./MyAccountMenu";
import { Avatar } from "~/components/Avatar";
import { Icon } from "~/components/Icon/Icon";
import { Search } from "~/components/Search";
import { createSupabaseServerClient } from "~/supabase.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { removeFrontSlash } from "~/lib/stringHelpers";

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
      .select("name, username, avatar")
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

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  const location = useLocation();

  /**
   * Takes the current URL path and converts into a form that can be used as a CSS class name
   * @param path {string}
   */
  const cssClassify = (path: string) => {
    const newPath = stripPrependingSlash(path);
    return replaceSlashesWithUnderscores(newPath);
  };

  const stripPrependingSlash = (path: string) => {
    if (path.startsWith("/")) {
      return path.slice(1);
    }
    return path;
  };

  const replaceSlashesWithUnderscores = (path: string) => {
    return path.replace(/\//g, "_");
  };

  return (
    <div className="bg-arrowLeft bg-no-repeat">
      <div className="absolute right-8 top-8 flex justify-end gap-4">
        {/* If we're on the current user's profile page, then display an edit profile button */}
        {removeFrontSlash(location.pathname) === "me" ||
          (removeFrontSlash(location.pathname) === data?.username && (
            <Link to="/login" className="with-icon button bg-codGray">
              <Icon name="edit" /> EDIT PROFILE
            </Link>
          ))}

        <Search />
        {!data?.user?.email && (
          <Link to="/login" className="with-icon button bg-codGray">
            <Icon name="login" /> LOGIN
          </Link>
        )}
      </div>

      <div>
        <aside className="fixed border-r-[#2f2f2f] border-r-2 h-screen w-[200px] flex flex-col justify-between">
          <div className="p-8">
            <a href="/">
              <img
                src="/images/logo.svg"
                alt="Two Week Build Challenge"
                className="mb-10"
              />
            </a>
            <nav>
              <ul className={cssClassify(location.pathname)}>
                {data?.user?.email && (
                  <li className="me">
                    <Link to="/me">My Profile</Link>
                  </li>
                )}
                <li className="updates_all">
                  <Link to="/updates/all">All Updates</Link>
                </li>
                <li className="projects">
                  <Link to="/projects">All Projects</Link>
                </li>
                <li className="leaderboard">
                  <Link to="/leaderboard">Leaderboard</Link>
                </li>
              </ul>
            </nav>
          </div>

          {data?.user?.email && (
            <div className="p-3">
              <Link
                to="/me?new=true#new"
                className="with-icon bg-springBud text-black center whitespace-nowrap text-sm w-full py-1 uppercase px-4 hover:bg-white mb-5"
              >
                <Icon name="plus-circle" className="size-4" />
                Add an Update
              </Link>
              <div className="flex gap-2 justify-between items-center">
                <Link to="/me" className="flex items-center gap-2">
                  <Avatar alt={data?.name} src={data?.avatar} size="42px" />
                  <div className="font-sans text-xs flex-1">
                    <strong>{data?.name}</strong>
                    <br />@{data?.username}
                  </div>
                </Link>
                <MyAccountMenu />
              </div>
            </div>
          )}
        </aside>
        <main className="pl-[200px] pt-[80px]">
          <Outlet />

          {/*} if the user is not logged in, show an option to sign up at the bottom of the page */}
          {!data?.user?.email && (
            <section className="border-t-[3px] border-t-mineShaft pt-[100px] text-center">
              <Newsletter />
            </section>
          )}

          <Footer />
        </main>
      </div>
    </div>
  );
}
