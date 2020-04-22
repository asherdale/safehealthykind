import heartbeat from '../assets/images/heartbeat.png';
import cardiothoracic from '../assets/images/cardiothoracic.png';
import femaleDoctor from '../assets/images/female-doctor.png';
import maleDoctor from '../assets/images/male-doctor.png';
import femaleNurse from '../assets/images/female-nurse.png';
import maleNurse from '../assets/images/male-nurse.png';
import heartPlus from '../assets/images/heart-plus.png';
import stethoscope from '../assets/images/stethoscope.png';
import femaleHospital from '../assets/images/female-hospital.png';
import maleHospital from '../assets/images/male-hospital.png';

const avatarMap = {
  'heartbeat': heartbeat,
  'cardiothoracic': cardiothoracic,
  'femaleDoctor': femaleDoctor,
  'maleDoctor': maleDoctor,
  'femaleNurse': femaleNurse,
  'maleNurse': maleNurse,
  'heartPlus': heartPlus,
  'stethoscope': stethoscope,
  'femaleHospital': femaleHospital,
  'maleHospital': maleHospital,
};

function formatDateString(num, unit) {
  return `${num} ${unit}${num > 1 ? 's' : ''} ago`;
}

export const timeSince = (dateString) => {
  const date = new Date(dateString);
  const secondsAgo = Math.floor((new Date() - date) / 1000);

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

export const getAvatar = (iconString) => {
  return avatarMap[iconString];
};
