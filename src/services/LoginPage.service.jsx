//function to get users by their PK
async function list(id) {
    const endpoint = '/data-api/rest/USERS/USER_ID';
    const response = await fetch(`${endpoint}/${id}`);
    const data = await response.json();
    return data.value;
}

//function to create user
async function createUser(email,firstName,lastName) {
    const data = {
      USER_ID: email,
      FIRST_NAME: firstName,
      LAST_NAME:lastName,
      USER_ROLE: "Student"
    };
  
    const endpoint = `/data-api/rest/USERS/`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;
  }

  export{list,createUser}