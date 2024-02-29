import { User } from "~/global";
import { Icon } from "./Icon/Icon";

interface ProfileDetailsProps {
  user: User;
}

const ProfileDetails = ({ user }: ProfileDetailsProps) => {
  const removeHttp = (url: string) => {
    return url.replace(/(^\w+:|^)\/\//, "");
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-2 font-sans text-mountainMist font-bold text-sm mb-8">
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
      {user?.twitter && (
        <a
          href={`https://twitter.com/${user.twitter}`}
          className="with-icon hover:text-springBud"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="x" size="md">
            @{user.twitter}
          </Icon>
        </a>
      )}
      {user?.website && (
        <a
          href={user.website}
          className="with-icon hover:text-springBud truncate"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="link" size="md">
            {removeHttp(user.website)}
          </Icon>
        </a>
      )}
      {user?.discord && (
        <a
          href={`https://</div>discordapp.com/users/${user.discord}`}
          className="with-icon hover:text-springBud"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="discord" size="md">
            @{user.discord}
          </Icon>
        </a>
      )}
      {user?.youtube && (
        <a
          href={`${user.youtube}`}
          className="with-icon hover:text-springBud"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="youtube" size="md">
            YouTube
          </Icon>
        </a>
      )}
      {user?.tiktok && (
        <a
          href={`${user.tiktok}`}
          className="with-icon hover:text-springBud"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="tiktok" size="md">
            @{user.tiktok}
          </Icon>
        </a>
      )}
      {user?.linkedin && (
        <a
          href={`${user.linkedin}`}
          className="with-icon hover:text-springBud"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="linkedin" size="md">
            LinkedIn
          </Icon>
        </a>
      )}
    </div>
  );
};

export { ProfileDetails };
