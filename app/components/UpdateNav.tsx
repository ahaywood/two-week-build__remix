import { Link } from "@remix-run/react";

interface UpdateNavProps {
  status?: "current" | "future" | "default";
  number: number;
  month: string;
  year: string;
}

const UpdateNav = ({
  status = "default",
  number,
  month,
  year,
}: UpdateNavProps) => {
  // if the date is in the future
  if (status === "future") {
    return (
      <div className="text-lg aspect-square inline-block w-10 h-10 center font-mono font-bold border-2 border-transparent bg-transparent text-black opacity-30">
        {number}
      </div>
    );
  }
  return (
    <Link
      to={`/updates/daily/${year}-${month}-${number}`}
      className={`text-lg aspect-square inline-block w-10 h-10 center font-mono font-bold border-2 hover:bg-white hover:text-black
      ${status === "default" ? "text-black border-black" : ""}
      ${status === "current" ? "bg-black text-springBud border-black" : ""}
    `}
    >
      {number}
    </Link>
  );
};

export default UpdateNav;
