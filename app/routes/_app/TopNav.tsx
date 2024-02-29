import { Link } from "@remix-run/react";

interface TopNavProps {
  pathname: string;
  isUserLoggedIn?: boolean;
}

const TopNav = ({ pathname, isUserLoggedIn = false }: TopNavProps) => {
  /**
   * Takes the current URL path and converts into a form that can be used as a CSS class name
   * @param path {string}
   */
  const cssClassify = (path: string) => {
    const newPath = stripPrependingSlash(path);
    return replaceSlashesWithUnderscores(newPath);
  };

  const stripPrependingSlash = (path: string) => {
    if (path.startsWith("/")) {
      return path.slice(1);
    }
    return path;
  };

  const replaceSlashesWithUnderscores = (path: string) => {
    return path.replace(/\//g, "_");
  };

  return (
    <nav>
      <ul className={cssClassify(pathname)}>
        {isUserLoggedIn && (
          <li className="me">
            <Link to="/me">My Profile</Link>
          </li>
        )}
        <li className="updates_all">
          <Link to="/updates/all">All Updates</Link>
        </li>
        <li className="projects">
          <Link to="/projects">All Projects</Link>
        </li>
        <li className="leaderboard">
          <Link to="/leaderboard">Leaderboard</Link>
        </li>
      </ul>
    </nav>
  );
};

export { TopNav };
