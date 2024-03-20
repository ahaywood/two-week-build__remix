import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Avatar } from "~/components/Avatar";
import Footer from "~/components/Footer";
import { LoginButton } from "~/components/LoginButton";
import Newsletter from "~/components/Newsletter";
import { Search } from "~/components/Search";
import { SignUpButton } from "~/components/SignUpButton";
import { createSupabaseServerClient } from "~/supabase.server";

/** -------------------------------------------------
* LOADER
---------------------------------------------------- */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Determine whether the user is logged in or not
  const supabase = createSupabaseServerClient(request);
  const { data, error } = await supabase.auth.getUser();
  if (error) console.error(error);

  // Get all the avatars for all the users
  const users = await supabase
    .from("users")
    .select("id, username, avatar, name");

  return { data: { data, users } };
};

/** -------------------------------------------------
* META DATA
---------------------------------------------------- */
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
/** -------------------------------------------------
* COMPONENT
---------------------------------------------------- */
export default function Index() {
  const {
    data: { data, users },
  } = useLoaderData<typeof loader>();

  return (
    <>
      <header className="p-page md:mb-12 pt-[80px] md:pt-0">
        <h1 className="uppercase text-[90px] md:text-[132px] leading-[80px] md:leading-[114px] text-springBud mb-8">
          Two
          <br />
          Week
          <br />
          Build{" "}
          <div className="text-[42px] leading-[40px] md:text-[62px] md:leading-[54px] capitalize text-white">
            Challenge
          </div>
        </h1>
        <Newsletter />

        {/* HEADER LINKS */}
        <div className="absolute right-6 top-6 flex items-center gap-3">
          <Search />
          <SignUpButton />
          <LoginButton isUserLoggedIn={false} />
          <LoginButton isUserLoggedIn={!!data.user} />
        </div>
      </header>

      <section className="bg-springBud px-page py-10">
        <h3 className="uppercase text-2xl mb-0 text-black">Cohort 2</h3>
        <h2 className="text-black leading-none text-[8.6vw]">
          April 1 - 14, 2024
        </h2>
      </section>

      <section className="py-10 how-it-works">
        <h2 className="text-springBud text-5xl md:text-6xl mb-3 px-page leading-none">
          How It Works
        </h2>
        <ul className="text-2xl md:text-6xl text-white">
          <li>Pick Something to Build</li>
          <li>Build it in 2 Weeks</li>
          <li>Ship it</li>
        </ul>
      </section>

      <section className="bg-white text-black py-10 px-page rules-guidelines">
        <h2 className="text-5xl md:text-6xl mb-3 leading-none text-black">
          Rules and Guidelines
        </h2>
        <ol className="list-decimal list-inside">
          <li>Have fun.</li>
          <li>Don’t overthink it.</li>
          <li>Don’t start until March 1, 2024.</li>
          <li>
            You can build anything. Write an ebook. Design a UI library. Build a
            web application.
          </li>
          <li>At the end of 2 weeks, ship what you have.</li>
        </ol>
      </section>

      <section className="px-page py-10">
        <h2 className="text-6xl leading-none mb-3 text-white">Join Us</h2>
        <div className="flex flex-wrap gap-3">
          {users.data &&
            users.data.map((participant) => (
              <a href={`/${participant.username}`} key={participant.id}>
                <Avatar
                  className="border-2 border-white"
                  size="72px"
                  src={participant.avatar}
                  alt={participant.name}
                />
              </a>
            ))}
        </div>
      </section>

      <section className="border-t-[3px] border-t-mineShaft pt-[100px] text-center px-5 md:px-0">
        <Newsletter />
      </section>

      <Footer />
    </>
  );
}
