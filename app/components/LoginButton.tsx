import { Link } from "@remix-run/react";
import { Icon } from "./Icon";

interface LoginButtonProps {
  callback?: () => void;
  isUserLoggedIn: boolean;
}

const LoginButton = ({
  callback = () => {},
  isUserLoggedIn,
}: LoginButtonProps) => {
  if (!isUserLoggedIn)
    return (
      <Link
        to="/login"
        className="with-icon button bg-codGray"
        onClick={callback}
      >
        <Icon name="login" size="md" /> LOGIN
      </Link>
    );
  return null;
};

export { LoginButton };
