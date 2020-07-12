
export const timeSince = (dateObj) => {
  const curSeconds = new Date().getTime() / 1000;
  const secondsAgo = Math.floor(curSeconds - dateObj._seconds);

  const numYears = Math.floor(secondsAgo / 31536000);
  if (numYears >= 1) {
    return `${numYears}y`;
  }

  const numMonths = Math.floor(secondsAgo / 2628000);
  if (numMonths >= 1) {
    return `${numMonths} mo`;
  }

  const numDays = Math.floor(secondsAgo / 86400);
  if (numDays >= 1) {
    return `${numDays}d`;
  }

  const numHours = Math.floor(secondsAgo / 3600);
  if (numHours >= 1) {
    return `${numHours}h`;
  }

  const numMinutes = Math.floor(secondsAgo / 60);
  if (numMinutes >= 1) {
    return `${numMinutes}m`;
  }

  return `${secondsAgo}s`;
};

export const example = 'hi';
