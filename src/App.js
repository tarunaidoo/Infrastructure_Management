import React, { useState } from 'react';

async function list() {
  const endpoint = '/data-api/rest/Person';
  const response = await fetch(endpoint);
  const data = await response.json();
  return data;
}

async function update(id, name) {
  const data = {
    Name: name
  };

  const endpoint = '/data-api/rest/Person/Id';
  const response = await fetch(`${endpoint}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  console.table(result.value);
}

async function create(name) {
  const data = {
    Name: name
  };

  const endpoint = `/data-api/rest/Person/`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  console.table(result.value);
}

async function del(id) {
  const endpoint = '/data-api/rest/Person/Id';
  const response = await fetch(`${endpoint}/${id}`, {
    method: "DELETE"
  });
  if(response.ok) {
    console.log(`Record deleted: ${id}`)
  } else {
    console.log(response);
  }
}

async function get(id) {
  const endpoint = `/data-api/rest/Person/Id`;
  const response = await fetch(`${endpoint}/${id}`);
  const result = await response.json();
  return result;
}

function App() {
  const [data, setData] = useState(null);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [newName, setNewName] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [fetchId, setFetchId] = useState('');
  const [fetchedData, setFetchedData] = useState(null); // State for fetched data

  const handleListButtonClick = async () => {
    const result = await list();
    setData(result);
  };

  const handleUpdateButtonClick = async () => {
    if (id && name) {
      await update(id, name);
      alert(`Updated record with ID: ${id} to name: ${name}`);
    } else {
      alert('Please enter both ID and name');
    }
  };

  const handleCreateButtonClick = async () => {
    if (newName) {
      await create(newName);
      alert(`Added new person: ${newName}`);
      setNewName('');
    } else {
      alert('Please enter a name');
    }
  };

  const handleDeleteButtonClick = async () => {
    if (deleteId) {
      await del(deleteId);
      alert(`Deleted person with ID: ${deleteId}`);
      setDeleteId('');
    } else {
      alert('Please enter an ID');
    }
  };

  const handleFetchButtonClick = async () => {
    if (fetchId) {
      const result = await get(fetchId);
      setFetchedData(result); // Set fetched data in state
    } else {
      alert('Please enter an ID');
    }
  };

  return (
    <>
      <button onClick={handleListButtonClick}>List</button>
      <div>Hello, this is the data from the DB: {data ? JSON.stringify(data) : 'No data yet'}</div>
      
      <div>
        <input 
          type="text" 
          placeholder="Enter ID" 
          value={id} 
          onChange={(e) => setId(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Enter New Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <button onClick={handleUpdateButtonClick}>Update</button>
      </div>
      
      <div>
        <input 
          type="text" 
          placeholder="Enter New Person's Name" 
          value={newName} 
          onChange={(e) => setNewName(e.target.value)} 
        />
        <button onClick={handleCreateButtonClick}>Create</button>
      </div>

      <div>
        <input 
          type="text" 
          placeholder="Enter ID to Delete" 
          value={deleteId} 
          onChange={(e) => setDeleteId(e.target.value)} 
        />
        <button onClick={handleDeleteButtonClick}>Delete</button>
      </div>

      <div>
        <input 
          type="text" 
          placeholder="Enter ID to Fetch" 
          value={fetchId} 
          onChange={(e) => setFetchId(e.target.value)} 
        />
        <button onClick={handleFetchButtonClick}>Fetch by ID</button>
      </div>

      {fetchedData && (
        <div>
          <h3>Fetched Data:</h3>
          <pre>{JSON.stringify(fetchedData, null, 2)}</pre>
        </div>
      )}
      
      <p>Does it work ..?</p>
    </>
  );
}

export default App;
