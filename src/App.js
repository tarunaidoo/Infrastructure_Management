import React from 'react';

async function list() {
  const endpoint = '/data-api/rest/Person';
  const response = await fetch(endpoint);
  const data = await response.json();
  console.table(data.value);
}


function App() {
  

  const value = 'World';
  list();
  return <div>Hello and a aa{value}</div>;
}

export default App;
