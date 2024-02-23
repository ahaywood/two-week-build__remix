import { formatDistanceToNow, parseISO } from "date-fns";

export const currentMonth = new Date().getMonth();
export const currentDay = new Date().getDate();
export const currentYear = new Date().getFullYear();

export const getCurrentMonthWithZeros = () => {
  const month = currentMonth + 1;
  return month < 10 ? `0${month}` : month;
};

/**
 * This is the format of the date coming from the database: 2024-01-25T06:45:03.044958+00:00
 * Returns an array of the date in the format: [day, month, year]
 */

export const getDateArray = (dateString: string): string[] => {
  // Take a date formatted like this: 2024-01-25T06:45:03.044958+00:00
  // and return an array like this: ['01', '25', '2024']
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
  const year = String(date.getUTCFullYear());
  return [day, month, year];
};

export const getMonthName = (month: string) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[parseInt(month) - 1];
};

export const getFullMonthName = (month: number) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "October",
    "November",
    "December",
  ];
  return months[month - 1];
}

/**
 * Takes a timestamp, formatted like 2024-02-23T14:39:39.638854+00:00 and turns into a relative time
 */
export const relativeTime = (timestamp: string) => {
  const date = parseISO(timestamp);
  return formatDistanceToNow(date, { addSuffix: true });
}
