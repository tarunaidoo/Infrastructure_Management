
async function createBooking(data) {
    const endpoint = '/data-api/rest/BOOKING'; 
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  
    return response;
  }
  

  export{createBooking}
