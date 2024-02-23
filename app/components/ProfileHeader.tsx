import { User } from "~/global";
import { Avatar } from "./Avatar";
import { ProfileDetails } from "./ProfileDetails";

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  return (
    <div className="page-grid content-start gap-y-14">
      <div className="col-start-2 col-span-3 text-center bg-no-repeat">
        <div className="relative -top-[50px]">
          <div className="absolute -left-10 -top-6">
            <img src="/images/arrow--profile.svg" alt="hand drawn arrow" />
          </div>
          <Avatar
            size="215px"
            alt={user?.name && user.name}
            src={user?.avatar && user.avatar}
            className="mx-auto relative"
          />
        </div>
      </div>
      <div className="col-span-7">
        <h1 className="text-[80px] font-sans font-bold text-springBud leading-none mb-8">
          {user?.name && user.name}
        </h1>
        <ProfileDetails user={user} />
      </div>
    </div>
  );
};

export { ProfileHeader };
