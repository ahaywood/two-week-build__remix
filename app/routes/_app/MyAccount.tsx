import { Link } from "@remix-run/react";
import { Avatar } from "~/components/Avatar";

interface MyAccountProps {
  name: string;
  username: string;
  avatar: string;
}

const MyAccount = ({ name, username, avatar }: MyAccountProps) => {
  return (
    <Link to="/me" className="flex items-center gap-2">
      <Avatar alt={name} src={avatar} size="42px" />
      <div className="font-sans text-xs flex-1">
        <strong>{name}</strong>
        <br />@{username}
      </div>
    </Link>
  );
};

export { MyAccount };
