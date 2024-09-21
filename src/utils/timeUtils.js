export function generateTimeOptions() {
    const times = [];
    let startTime = new Date();
    startTime.setHours(8, 0, 0, 0); // Start at 08:00
    
    for (let i = 0; i < 24; i++) { // 24 slots for the time range 08:00 to 20:00
      const timeString = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      times.push(timeString);
      startTime.setMinutes(startTime.getMinutes() + 30); // Increment by 30 minutes
    }
  
    return times;
  };