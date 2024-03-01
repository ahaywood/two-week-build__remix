import { useState } from "react";
import { Icon } from "./Icon/Icon";
import { Form } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEscapeKey } from "~/hooks/useEscapeKey";

const Search = () => {
  const [isSearchShowing, setIsSearchShowing] = useState(false);
  useEscapeKey(() => setIsSearchShowing(false));

  const toggleSearch = () => {
    setIsSearchShowing((prevValue) => !prevValue);
  };

  return (
    <>
      <button
        className={`!hidden with-icon button bg-codGray z-searchButton ${
          isSearchShowing ? "hover:bg-white hover:text-black" : ""
        }`}
        onClick={toggleSearch}
      >
        {!isSearchShowing ? (
          <>
            <Icon name="search">SEARCH</Icon>
          </>
        ) : (
          <>
            <Icon name="close">CLOSE</Icon>
          </>
        )}
      </button>

      <AnimatePresence>
        {isSearchShowing && (
          <motion.div
            className="bg-springBud w-screen h-screen inset-0 fixed z-search text-black flex items-center flex-col pt-12"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
          >
            <div className="uppercase text-[300px] text-center leading-normal">
              SEARCH
            </div>
            <Form className="flex items-center">
              <input
                type="text"
                className="!border-black !hover:border-black !bg-black text-white"
              />
              <button>
                <Icon name="arrow" size="xxl">
                  SEARCH
                </Icon>
              </button>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export { Search };
