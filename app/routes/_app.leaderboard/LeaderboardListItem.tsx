import { Link } from "@remix-run/react";
import { Avatar, AvatarProps } from "~/components/Avatar";
import { ProjectTracker } from "~/components/ProjectTracker";

interface LeaderboardListItemProps {
  avatar: AvatarProps;
  name: string;
  username: string;
  updates: {
    update_dates: string[];
  };
}

const LeaderboardListItem = ({
  avatar,
  name,
  username,
  updates,
}: LeaderboardListItemProps) => {
  // 14 days of updates
  const numberOfUpdates = new Array(14).fill(null);

  // look at the string swithin the numberOfUpdates array and see if the date matches the current Count
  // the strings in the array are in the format of 2024-02-01
  // in this case we're looking to see if the currentCount matches 01. Without leading zeroes does match
  const getStatus = (currentCount: number) => {
    // what's the current date?
    const today = new Date().getDate();

    // if today matches the current day, return today
    if (today === currentCount) return { status: "today" };

    // if the currentCount is in the future, return future
    if (today < currentCount) return { status: "future" };

    // if the currentCount is in the array of dates, return completed
    const foundIt = updates.update_dates.find((update) => {
      console.log({ update });
      if (!update) return false;
      const date = update.split("-");
      if (parseInt(date[2]) === currentCount) return true;
      return false;
    });
    if (foundIt) return { status: "completed" };

    // otherwise the user missed the date
    return { status: "missed" };
  };

  return (
    <div className="grid grid-cols-[72px_1fr] gap-4">
      <div>
        <Link to={`/${username}`}>
          <Avatar {...avatar} />
        </Link>
      </div>
      <div>
        <Link to={`/${username}`} className="hover:text-springBud">
          <h4 className="text-xl mb-2">{name}</h4>
        </Link>
        <ul className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          {numberOfUpdates.map((item, index) => {
            const status = getStatus(index + 1);
            console.log({ status });
            return (
              <li key={index}>
                <ProjectTracker number={index + 1} status={status.status} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export { LeaderboardListItem };
