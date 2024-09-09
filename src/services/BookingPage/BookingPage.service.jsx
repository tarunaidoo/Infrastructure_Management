
async function createBooking(data) {
    const endpoint = '/data-api/rest/BOOKING';  // Full URL
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        alert("Event booked successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error Response: ", errorData);
        alert("Failed to book event.");
      }
    } catch (error) {
      console.error("Error booking event:", error);
      alert("An error occurred while booking the event.");
    }
  }
  

  export{createBooking}
