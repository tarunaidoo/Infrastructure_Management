export function formatDateToISO(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so add 1
    const day = date.getDate().toString().padStart(2, '0'); // Pad single-digit days with a leading zero
  
    return `${year}-${month}-${day}`;
  }
  
  export function getFormattedDate() {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }