import { Link } from "@remix-run/react";
import { Icon } from "~/components/Icon";

const AddProjectButton = () => {
  return (
    <Link
      to={`/projects/new`}
      className="with-icon bg-springBud text-black center whitespace-nowrap text-sm w-full py-1 uppercase px-4 hover:bg-white mb-5"
    >
      <Icon name="plus-circle" className="size-4" />
      Add a Project
    </Link>
  );
};

export { AddProjectButton };
