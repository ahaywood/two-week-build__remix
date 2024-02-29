import { Avatar, AvatarProps } from "~/components/Avatar";
import { ProjectTracker } from "~/components/ProjectTracker";
import { Update } from "~/global";

interface LeaderboardListItemProps {
  avatar: AvatarProps;
  name: string;
  slug: string;
  updates: Update[];
}

const LeaderboardListItem = ({
  avatar,
  name,
  slug,
  updates,
}: LeaderboardListItemProps) => {
  // 14 days of updates
  const numberOfUpdates = new Array(14).fill(null);

  return (
    <div className="flex gap-4">
      <div>
        <Avatar {...avatar} />
      </div>
      <div>
        <h4 className="text-xl mb-2">Amy Dutton</h4>
        <ul className="flex items-center gap-3">
          {numberOfUpdates.map((item, index) => (
            <li key={index}>
              <ProjectTracker number={index + 1} status="missed" />
            </li>
            // <li><ProjectTracker number={1} status="completed" /></li>
            // <li><ProjectTracker number={1} status="today" /></li>
            // <li><ProjectTracker number={1} status="future" /></li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export { LeaderboardListItem };
