import React, { useState, useEffect } from 'react';

async function list() {
  const endpoint = '/data-api/rest/Person';
  const response = await fetch(endpoint);
  const data = await response.json();
  return data;
}

function App() {
  // State to store the fetched data
  const [data, setData] = useState(null);

  // Fetch data when the component is mounted
  useEffect(() => {
    async function fetchData() {
      const result = await list();
      setData(result);
    }
    
    fetchData();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <>
      <div>Hello, this is the data from the DB, {data ? JSON.stringify(data) : 'loading...'}</div>
      <p>Does it work ..?</p>
    </>
    
    
  );
}

export default App;
