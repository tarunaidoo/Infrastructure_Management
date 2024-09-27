// Utility function to add weeks to a date
export const addWeeksToDate = (date, weeks) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + (7 * weeks));
    return newDate;
  };