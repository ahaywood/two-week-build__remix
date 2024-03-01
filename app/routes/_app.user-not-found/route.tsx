import { MetaFunction } from "@remix-run/node";
import { constants } from "~/lib/constants";

/** -------------------------------------------------
*  Meta Data
---------------------------------------------------- */
export const meta: MetaFunction = () => {
  return [
    { title: `${constants.OG_TITLE} :: User Not Found` },
    {
      name: "description",
      content:
        "The Two Week Build Challenge is where ideas turn into reality in only two weeks! Embark on a thrilling journey of creation, whether you're coding an app, designing a website, or launching your latest e-book. Our community of developers and designers is ready to cheer you on from brainstorming to launch. Discover projects, share your progress, and get inspired by the endless possibilities. With new challenges around every corner and the coffee always hot, what will you build in your next two weeks? Dive in and let the adventure begin!",
    },
  ];
};

/** -------------------------------------------------
* COMPONENT
---------------------------------------------------- */
export default function Index() {
  return <div>Sorry! User Not Found</div>;
}
