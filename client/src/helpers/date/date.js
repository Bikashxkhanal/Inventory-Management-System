const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');    
    return `${year}-${month}-${day}`;
}

function getStartDateOfCurrentYear(date) {
    const startDate = new Date(date.getFullYear(), 0, 1); // Fix: month 0 = January
    return formatDate(startDate);
}

function getDateBeforeCurrentDate(numberOfDaysBackTo) {
    const date = new Date();
    date.setDate(date.getDate() - numberOfDaysBackTo);
    return formatDate(date); // Reuse formatDate for consistency
}

//must return the 2 week of before of current date that has already passed eg. if the date is 16 Dec 2025 then there might be 2 weeks already passed 1-7, 8-14 , with the date:: 2025-12-01 - 2025-12-07
function getLastTwoWeekWithStartAndEndDate() {
  const currentDate = new Date();
  
  // start of the current week (Monday)
  const currentDayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ...
  const daysToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  
  const startOfCurrentWeek = new Date(currentDate);
  startOfCurrentWeek.setDate(currentDate.getDate() - daysToMonday);
  startOfCurrentWeek.setHours(0, 0, 0, 0);

  // Week 1 ago: Monday to Sunday
  const startOfWeek1 = new Date(startOfCurrentWeek);
  startOfWeek1.setDate(startOfCurrentWeek.getDate() - 7);

  const endOfWeek1 = new Date(startOfWeek1);
  endOfWeek1.setDate(startOfWeek1.getDate() + 6);

  // Week 2 ago: Monday to Sunday
  const startOfWeek2 = new Date(startOfCurrentWeek);
  startOfWeek2.setDate(startOfCurrentWeek.getDate() - 14);

  const endOfWeek2 = new Date(startOfWeek2);
  endOfWeek2.setDate(startOfWeek2.getDate() + 6);

  return [
    { startDate: formatDate(startOfWeek2), endDate: formatDate(endOfWeek2) },
    { startDate: formatDate(startOfWeek1), endDate: formatDate(endOfWeek1) },
  ];
}

const convertDateIntoWeekDay = (date) => {

    // date must be in yyyy-mm-dd format 
    const currentDay = new Date(date);
    const day = currentDay.getDay();
    return days[day];
    
}



export {
    formatDate,
    getStartDateOfCurrentYear,
    getDateBeforeCurrentDate,
    getLastTwoWeekWithStartAndEndDate,
    convertDateIntoWeekDay
}