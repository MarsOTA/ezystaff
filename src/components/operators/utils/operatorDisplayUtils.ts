
export const formatGender = (gender: string | undefined): string => {
  if (!gender) return '-';
  switch (gender.toLowerCase()) {
    case 'maschio':
    case 'male':
    case 'm':
      return 'M';
    case 'femmina':
    case 'female':
    case 'f':
      return 'F';
    default:
      return gender.charAt(0).toUpperCase();
  }
};

export const formatDateRange = (start: Date, end: Date) => {
  const { format } = require("date-fns");
  const { it } = require("date-fns/locale");
  
  const sameDay = start.getDate() === end.getDate() && 
                  start.getMonth() === end.getMonth() && 
                  start.getFullYear() === end.getFullYear();
  
  const startDateStr = format(start, "d MMMM yyyy", { locale: it });
  const endDateStr = format(end, "d MMMM yyyy", { locale: it });
  const startTimeStr = format(start, "HH:mm");
  const endTimeStr = format(end, "HH:mm");
  
  if (sameDay) {
    return `${startDateStr}, ${startTimeStr} - ${endTimeStr}`;
  } else {
    return `Dal ${startDateStr}, ${startTimeStr} al ${endDateStr}, ${endTimeStr}`;
  }
};
