import { motion } from "framer-motion";
import { useState } from "react";
import { Icon } from "~/components/Icon";
import { TopNav } from "./TopNav";
import { useEscapeKey } from "~/hooks/useEscapeKey";

interface MobileNavProps {
  pathname: string;
  isUserLoggedIn?: boolean;
}

const MobileNav = ({ pathname, isUserLoggedIn = false }: MobileNavProps) => {
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
      <div className="fixed right-8 top-8 lg:hidden">
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
        className="fixed lg:hidden bg-licorice inset-0 p-6 z-40 text-center"
        animate={{ y: isNavShowing ? 0 : "-100%" }}
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

          <TopNav pathname={pathname} isUserLoggedIn={isUserLoggedIn} />
        </ul>
      </motion.nav>
    </>
  );
};

export { MobileNav };
