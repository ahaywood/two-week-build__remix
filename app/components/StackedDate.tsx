import { getDateArray, getMonthName } from "~/lib/dateHelpers";

interface StackedDateProps {
  date: string;
}

const StackedDate = ({ date }: StackedDateProps) => {
  const [day, month, year] = getDateArray(date);
  return (
    <div className="flex items-center flex-col">
      <div className="uppercase text-[42px] font-sans font-bold text-white leading-none">
        {getMonthName(month)}
      </div>
      <div className="text-springBud text-[155px] font-sans leading-none font-bold">
        {day}
      </div>
      <div className="text-white text-4xl font-sans font-bold">{year}</div>
    </div>
  );
};

export { StackedDate };
