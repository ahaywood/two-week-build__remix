import { Project, User } from "~/global";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon/Icon";

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
      <div className="bg-licorice py-5 px-8 flex-1">
        <div className="flex justify-between">
          <div className="font-sans text-battleshipGray">
            {isProfileDetailsShowing && (
              <>
                <a
                  href={`/${user?.username && user.username}`}
                  className="font-bold underline hover:text-white inline-block mb-4"
                >
                  <strong>{user?.name && user.name}</strong>
                </a>{" "}
                &bull;{" "}
                <a href={`/${user?.username && user.username}`}>
                  @{user?.username && user.username}
                </a>
              </>
            )}
          </div>
          <div>
            {isUpdatesLinkShowing && (
              <a
                href={`/${user?.username && user.username}`}
                className="flex text-springBud items-center hover:text-white mb-4"
              >
                <Icon name="arrow" size="lg">
                  UPDATES
                </Icon>
              </a>
            )}
          </div>
        </div>
        <h2 className="font-sans font-bold text-2xl">
          {project?.name && project.name}
        </h2>
        <p className="font-sans text-lg leading-normal">
          {project?.description && project.description}
        </p>
      </div>
    </div>
  );
};

export { ProjectOverview };