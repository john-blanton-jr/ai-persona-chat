import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);  // Initialize to an empty array

  const fetchData = async () => {
    try {
      const url = `http://localhost:8000/`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUsers(data);  // Use nullish coalescing to default to an empty array
        console.log(users);
      } else {
        console.error("Server responded with an error");
      }
    } catch (error) {
      console.error("There was a problem fetching data", error);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []); // Add any dependencies here if needed

  return (
    <>
      <h1>Data Fool!!</h1>
      <div className="d-flex flex-wrap justify-content-around">
        {users.length > 0 ? users.map((user, index) => (
          <div className="p-2" key={index}>
            <div className="image-placeholders p-3 mt-3">
              {Object.entries(user).map(([key, value]) => (
                <div key={key}>{key}: {value}</div>
              ))}
            </div>
          </div>
        )) : <p>Loading...</p>}
      </div>
    </>
  );
}

export default App;
