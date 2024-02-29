import { getDateArray, getMonthName } from "~/lib/dateHelpers";

interface StackedDateProps {
  date: string;
}

const StackedDate = ({ date }: StackedDateProps) => {
  const [day, month, year] = getDateArray(date);
  return (
    <div className="flex items-center justify-center md:flex-col gap-2 lg:gap-0">
      <div className="uppercase text-[32px] lg:text-[42px] font-sans font-bold text-white leading-none">
        {getMonthName(month)}
      </div>
      <div className="text-springBud text-[72px] lg:text-[155px] font-sans leading-none font-bold">
        {day}
      </div>
      <div className="text-white text-3xl lg:text-4xl font-sans font-bold">
        {year}
      </div>
    </div>
  );
};

export { StackedDate };
