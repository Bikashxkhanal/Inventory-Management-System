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

export {
    formatDate,
    getStartDateOfCurrentYear,
    getDateBeforeCurrentDate
}