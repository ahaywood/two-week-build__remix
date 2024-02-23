import { useState } from "react";
import { Icon } from "./Icon/Icon";
import { Form } from "@remix-run/react";

const Search = () => {
  const [isSearchShowing, setIsSearchShowing] = useState(false);

  const toggleSearch = () => {
    setIsSearchShowing((prevValue) => !prevValue);
  };

  return (
    <>
      <button
        className={`with-icon button bg-codGray z-searchButton ${
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

      {isSearchShowing && (
        <div className="bg-springBud w-screen h-screen inset-0 fixed z-search text-black flex items-center flex-col pt-12">
          <div className="uppercase text-[200px] text-center leading-normal">
            SEARCH
          </div>
          <Form>
            <input
              type="text"
              className="!border-black !hover:border-black !bg-black text-white"
            />
            <button>
              <Icon name="arrow" size="xl" />
            </button>
          </Form>
        </div>
      )}
    </>
  );
};

export { Search };
