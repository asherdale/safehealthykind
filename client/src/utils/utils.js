
function formatDateString(num, unit) {
  return `${num} ${unit}${num > 1 ? 's' : ''} ago`;
}

export const timeSince = (dateObj) => {
  const curSeconds = new Date().getTime() / 1000;
  const secondsAgo = Math.floor(curSeconds - dateObj._seconds);

  const numYears = Math.floor(secondsAgo / 31536000);
  if (numYears >= 1) {
    return formatDateString(numYears, 'year');
  }

  const numMonths = Math.floor(secondsAgo / 2628000);
  if (numMonths >= 1) {
    return formatDateString(numMonths, 'month');
  }

  const numDays = Math.floor(secondsAgo / 86400);
  if (numDays >= 1) {
    return formatDateString(numDays, 'day');
  }

  const numHours = Math.floor(secondsAgo / 3600);
  if (numHours >= 1) {
    return formatDateString(numHours, 'hour');
  }

  const numMinutes = Math.floor(secondsAgo / 60);
  if (numMinutes >= 1) {
    return formatDateString(numMinutes, 'minute');
  }

  return formatDateString(secondsAgo, 'second');
};

export const example = 'hi';
