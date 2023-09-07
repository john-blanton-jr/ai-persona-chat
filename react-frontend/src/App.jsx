// import React, { useState } from "react";
import ChatApp from "./components/ChatApp";
import "./App.css";

function App() {
  return (
    <div>
      <ChatApp />
    </div>
  );
}

export default App;

// function App() {
//   const [users, setUsers] = useState([]);
//   const fetchData = async () => {
//     try {
//       const url = `http://localhost:8000/`;
//       const response = await fetch(url);
//       if (response.ok) {
//         const data = await response.json();
//         setUsers(data);
//       } else {
//         console.error("Server responded with an error");
//       }
//     } catch (error) {
//       console.error("There was a problem fetching data", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <>
//       <h1>Data Fool!!</h1>
//       <div className="d-flex flex-wrap justify-content-around">
//         {users.length > 0 ? users.map((user, index) => (
//           <div className="p-2" key={index}>
//             <div className="image-placeholders p-3 mt-3">
//               {Object.entries(user).map(([key, value]) => (
//                 <div key={key}>{key}: {value}</div>
//               ))}
//             </div>
//           </div>
//         )) : <p>Loading...</p>}
//       </div>
//     </>
//   );
// }

// export default App;
