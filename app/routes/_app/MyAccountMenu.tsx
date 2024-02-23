import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@remix-run/react";

import { Icon } from "~/components/Icon/Icon";
import { useEscapeKey } from "~/hooks/useEscapeKey";
import { useOutsideClick } from "~/hooks/useClickOutside";

export const MyAccountMenu = () => {
  const [isMenuShowing, setIsMenuShowing] = useState(false);
  const ref = useRef(null);

  useEscapeKey(() => setIsMenuShowing(false));
  useOutsideClick(() => setIsMenuShowing(false), ref);

  return (
    <div className="relative" ref={ref}>
      <AnimatePresence>
        {isMenuShowing && (
          <motion.div
            className="popup-menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <ul>
              <li>
                <Link
                  to="/account"
                  className="menu-item"
                  onClick={() => setIsMenuShowing(false)}
                >
                  <Icon name="account">My Account</Icon>
                </Link>
              </li>
              <li>
                <Link
                  to="/logout"
                  type="submit"
                  className="menu-item"
                  onClick={() => setIsMenuShowing(false)}
                >
                  <Icon name="logout">Logout</Icon>
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        className="text-springBud"
        onClick={() => setIsMenuShowing((prevValue) => !prevValue)}
      >
        <Icon name="threeDots" />
      </button>
    </div>
  );
};
