import { currentDay, currentMonth, getFullMonthName } from "../lib/dateHelpers";
import Banner from "./Banner";
import UpdateNav from "./UpdateNav";

const UpdateHeader = () => {
  const numberOfUpdates = new Array(14).fill(null);

  return (
    <Banner>
      <div className="page-grid">
        <div className="col-start-2 col-span-8">
          <h1 className="mb-8">Updates</h1>
          <ul className="flex items-center gap-4">
            <li className="h-10 text-3xl center text-springBud bg-black px-5 uppercase">
              {getFullMonthName(currentMonth + 1)}
            </li>
            {numberOfUpdates.map((update, index: number) => (
              <li key={index}>
                {/* MARK - NEED TO MAKE THE DATE DYNAMIC, RIGHT NOW IT'S HARD CODED TO MARCH 2024 */}
                <UpdateNav
                  month="3"
                  year="2024"
                  number={index + 1}
                  status={
                    currentDay === index + 1
                      ? "current"
                      : currentDay < index + 1
                      ? "future"
                      : "default"
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Banner>
  );
};

export { UpdateHeader };
