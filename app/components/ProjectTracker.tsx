import { Icon } from "./Icon";

interface ProjectTrackerProps {
  number: number;
  status: "completed" | "missed" | "today" | "future";
}

const ProjectTracker = ({ number, status }: ProjectTrackerProps) => {
  if (status === "completed") {
    return (
      // - [ ] MARK: Link this update to the individual update page
      // I'll need to do a little bit of work to the Supabase function to get the individual update ID
      <div className="w-8 h-8 aspect-square center border-2 font-mono text-sm font-bold bg-springBud text-black border-springBud">
        <Icon name="check" />
      </div>
    );
  }

  return (
    <div
      className={`w-8 h-8 aspect-square center border-2 font-mono text-sm font-bold
    ${status === "missed" ? "bg-transparent text-chicago border-chicago" : ""}
    ${status === "today" ? "bg-white text-black border-white" : ""}
    ${status === "future" ? "bg-transparent text-white border-white" : ""}
  `}
    >
      {number}
    </div>
  );
};

export { ProjectTracker };
