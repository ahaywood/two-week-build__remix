import { motion } from "framer-motion";
import { useState } from "react";
import { Icon } from "~/components/Icon";
import { TopNav } from "./TopNav";
import { useEscapeKey } from "~/hooks/useEscapeKey";
import { LoginButton } from "~/components/LoginButton";
import { SignUpButton } from "~/components/SignUpButton";
import { LogoutButton } from "~/components/LogoutButton";
import { Search } from "~/components/Search";
import { EditProfileButton } from "~/components/EditProfileButton";
import { AddUpdateButton } from "./AddUpdateButton";
import { Link } from "@remix-run/react";

interface MobileNavProps {
  pathname: string;
  isUserLoggedIn?: boolean;
  username?: string;
}

const MobileNav = ({
  pathname,
  isUserLoggedIn = false,
  username,
}: MobileNavProps) => {
  const [isNavShowing, setIsNavShowing] = useState(false);

  useEscapeKey(() => {
    setIsNavShowing(false);
  });

  const toggleNav = () => {
    setIsNavShowing((prevValue) => !prevValue);
  };

  return (
    <>
      {/* mobile nav trigger  */}
      <div className="fixed right-8 top-8 lg:hidden z-hamburger">
        <button
          className="bg-codGray p-4 flex flex-col gap-2 text-springBud hover:text-black hover:bg-white z-50 relative"
          aria-label="Toggle the navigation"
          onClick={toggleNav}
        >
          <div className="bg-current w-10 h-1" />
          <div className="bg-current w-10 h-1" />
          <div className="bg-current w-10 h-1" />
        </button>
      </div>

      {/* mobile nav */}
      <motion.nav
        className="fixed lg:hidden bg-licorice inset-0 p-6 z-mobileMenu text-center flex flex-col justify-between opacity-0"
        animate={{
          y: isNavShowing ? 0 : "-100%",
          opacity: isNavShowing ? 1 : 0,
        }}
      >
        <ul>
          <li>
            <button
              onClick={() => setIsNavShowing(false)}
              className="border-b-2 border-b-chicago pb-4 mb-4 text-chicago hover:text-white"
            >
              <Icon name="close" size="xxl" aria-label="Close Navigation" />
            </button>
          </li>

          <TopNav
            pathname={pathname}
            isUserLoggedIn={isUserLoggedIn}
            callback={() => setIsNavShowing(false)}
          />
        </ul>

        {/* LOGIN & SIGN UP BUTTONS */}
        <ul className="flex gap-4 flex-wrap justify-center">
          {!isUserLoggedIn && (
            <li className="flex gap-5 justify-center">
              <LoginButton
                isUserLoggedIn={isUserLoggedIn}
                callback={() => setIsNavShowing(false)}
              />
              <SignUpButton callback={() => setIsNavShowing(false)} />
            </li>
          )}

          {/* EDIT PROFILE BUTTON */}
          {username && (
            <>
              <li className="text-center flex justify-center">
                <div className="max-w-[220px] mx-auto relative">
                  {/* I'm not using the AddUpdate Button because I need the Link to be Styled a little different for mobile nav */}
                  <Link
                    to={`/${username}?new=true#new`}
                    className="button bg-springBud text-black center whitespace-nowrap uppercase hover:bg-white px-6"
                  >
                    <Icon name="plus-circle" size="lg">
                      Add an Update
                    </Icon>
                  </Link>
                </div>
              </li>

              <li className="text-center flex justify-center">
                <div className="max-w-[200px] mx-auto relative">
                  <EditProfileButton
                    username={username}
                    callback={() => {
                      setIsNavShowing(false);
                    }}
                  />
                </div>
              </li>
            </>
          )}

          {/* LOGOUT */}
          {isUserLoggedIn && (
            <li>
              <LogoutButton className="bg-codGray button uppercase center mx-auto relative" />
            </li>
          )}

          {/* SEARCH */}
          <li className="flex justify-center">
            <Search />
          </li>
        </ul>
      </motion.nav>
    </>
  );
};

export { MobileNav };
