import { Project, User } from "~/global";
import { Avatar } from "~/components/Avatar";
import { Icon } from "~/components/Icon/Icon";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { motion } from "framer-motion";

interface ProjectOverviewProps {
  isAvatarShowing?: boolean;
  isUpdatesLinkShowing?: boolean;
  isProfileDetailsShowing?: boolean;
  project: Project;
  user: User;
}

const ProjectOverview = ({
  isAvatarShowing = true,
  isUpdatesLinkShowing = false,
  isProfileDetailsShowing = false,
  project,
  user,
}: ProjectOverviewProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setIsCollapsed((prevValue) => !prevValue);
  };

  return (
    <div className="flex gap-4">
      {isAvatarShowing && (
        <a href={`/${user?.username && user.username}`}>
          <Avatar
            alt={user?.name && user.name}
            src={user?.avatar && user.avatar}
            size="72px"
          />
        </a>
      )}
      <div
        className={`collapsing-box bg-licorice pt-5 pb-10 px-8 flex-1 overflow-x-hidden ${
          !isCollapsed ? "expanded" : ""
        }`}
      >
        <motion.div
          initial={{ height: "125px" }}
          animate={{ height: isCollapsed ? "100px" : "auto" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between">
            <div className="font-sans text-battleshipGray">
              {isProfileDetailsShowing && (
                <>
                  <Link
                    to={`/${user?.username && user.username}`}
                    className="font-bold underline hover:text-white inline-block mb-4"
                  >
                    <strong>{user?.name && user.name}</strong>
                  </Link>{" "}
                  &bull;{" "}
                  <Link to={`/${user?.username && user.username}`}>
                    @{user?.username && user.username}
                  </Link>
                </>
              )}
            </div>
            <div>
              {isUpdatesLinkShowing && (
                <Link
                  to={`/${user?.username && user.username}`}
                  className="flex text-springBud items-center hover:text-white mb-4"
                >
                  <Icon name="arrow" size="lg">
                    UPDATES
                  </Icon>
                </Link>
              )}
            </div>
          </div>
          <h2 className="font-sans font-bold text-lg md:text-2xl">
            <Link
              to={`/${user.username}/${project?.id}`}
              className="hover:text-springBud"
            >
              {project?.name && project.name}
            </Link>
          </h2>
          <p className="font-sans md:text-lg leading-normal">
            {project?.description && project.description}
          </p>
          <button
            className="bg-licorice w-full text-left absolute bottom-0 py-2 text-springBud font-sans z-collapsingBoxTrigger"
            onClick={toggleCollapsed}
          >
            {!isCollapsed ? "Show less" : "Show more..."}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export { ProjectOverview };
