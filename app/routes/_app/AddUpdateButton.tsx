import { Link } from "@remix-run/react";
import { Icon } from "~/components/Icon";

interface AddUpdateButtonProps {
  className?: string;
  currentUsername: string;
}

const AddUpdateButton = ({
  className = "",
  currentUsername,
}: AddUpdateButtonProps) => {
  return (
    <Link
      to={`/${currentUsername}?new=true#new`}
      className={`with-icon bg-springBud text-black center whitespace-nowrap text-sm w-full py-1 uppercase px-4 hover:bg-white mb-5 ${
        className ? className : ""
      }`}
    >
      <Icon name="plus-circle" className="size-4" />
      Add an Update
    </Link>
  );
};

export { AddUpdateButton };
