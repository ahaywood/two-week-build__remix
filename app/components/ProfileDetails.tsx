import { User } from "~/global";
import { Icon } from "./Icon/Icon";

interface ProfileDetailsProps {
  user: User;
}

const ProfileDetails = ({ user }: ProfileDetailsProps) => {
  // TODO: Add TikTok, YouTube, and LinkedIn to the top section
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-2 font-sans text-mountainMist font-bold text-sm mb-8">
      {user?.location && (
        <div className="with-icon">
          <Icon name="location" size="md" />
          {user.location}
        </div>
      )}
      {user?.github && (
        <a
          href={`https://github.com/${user.github}`}
          className="with-icon hover:text-springBud"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="github" size="md">
            {user.github}
          </Icon>
        </a>
      )}
      {user?.website && (
        <a
          href={user.website}
          className="with-icon hover:text-springBud"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="link" size="md">
            {user.website}
          </Icon>
        </a>
      )}
      {user?.twitter && (
        <a
          href={`https://twitter.com/${user.twitter}`}
          className="with-icon hover:text-springBud"
        >
          <Icon name="x" size="md">
            @{user.twitter}
          </Icon>
        </a>
      )}
    </div>
  );
};

export { ProfileDetails };
