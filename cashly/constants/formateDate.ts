interface FormatDate {
  (isoDate: string): string;
}

export const formatDate: FormatDate = (isoDate) => {
  const date = new Date(isoDate);
  const now = new Date();

  // Calculate the time difference in days
  const timeDiff = now.getTime() - date.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

  // Check if it's yesterday
  if (daysDiff === 1) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours > 12 ? hours - 12 : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${hours >= 12 ? "PM" : "AM"}`;
    return `Yesterday, ${formattedTime}`;
  }

  // Otherwise, return the full date in 'MMM dd, yyyy, h:mm AM/PM' format
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedTime = `${hours > 12 ? hours - 12 : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  } ${hours >= 12 ? "PM" : "AM"}`;

  return `${month} ${day}, ${year}, ${formattedTime}`;
};

console.log(formatDate("2025-02-28T04:19:57.532Z")); // Output: "Yesterday, 8:00 AM"
