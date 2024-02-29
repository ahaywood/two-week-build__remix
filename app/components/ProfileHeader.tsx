import { User } from "~/global";
import { Avatar } from "./Avatar";
import { ProfileDetails } from "./ProfileDetails";

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  return (
    <div className="page-grid content-start md:gap-y-14 p-5 md:p-0">
      <div className="md:col-start-2 col-span-3 text-center bg-no-repeat">
        <div className="relative -top-[20px] md:-top-[50px]">
          <div className="hidden md:block md:absolute md:-left-[100px] lg:-left-[70px] xl:-left-10 -top-6">
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
      <div className="col-span-9 md:col-span-7">
        <h1 className="text-[32px] sm:text-[48px] md:text-[80px] font-sans font-bold text-springBud leading-none sm:mb-8">
          {user?.name && user.name}
        </h1>
        <div className="hidden sm:block">
          <ProfileDetails user={user} />
        </div>
      </div>

      {/* profile details for mobile version. not crazy about listing this twice,
       but necessary to achieve different columns in the responsive views */}
      <div className="col-span-12 sm:hidden">
        <ProfileDetails user={user} />
      </div>
    </div>
  );
};

export { ProfileHeader };
