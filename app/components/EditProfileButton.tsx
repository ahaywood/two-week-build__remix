import { Link, useLocation } from "@remix-run/react";
import { Icon } from "./Icon";

interface EditProfileButtonProps {
  callback?: () => void;
  username: string;
}

const EditProfileButton = ({
  callback = () => {},
  username,
}: EditProfileButtonProps) => {
  const location = useLocation();

  if (username && location.pathname === `/${username}`)
    return (
      <Link
        to="/account"
        className="with-icon button bg-codGray"
        onClick={callback}
      >
        <Icon name="edit" /> EDIT PROFILE
      </Link>
    );
  return null;
};

export { EditProfileButton };
