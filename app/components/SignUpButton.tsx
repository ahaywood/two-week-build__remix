import { Link } from "@remix-run/react";
import { Icon } from "./Icon";

interface SignUpButtonProps {
  callback?: () => void;
  isUserLoggedIn?: boolean;
}

const SignUpButton = ({
  isUserLoggedIn = false,
  callback = () => {},
}: SignUpButtonProps) => {
  if (isUserLoggedIn) return null;
  return (
    <Link
      to="/register"
      className="with-icon button bg-codGray inline-block"
      onClick={callback}
    >
      <Icon name="check" /> SIGN UP
    </Link>
  );
};

export { SignUpButton };
