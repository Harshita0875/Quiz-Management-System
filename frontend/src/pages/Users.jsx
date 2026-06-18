import React, { useEffect, useState } from "react";
import "../styles/AdminTables.css";
function Users() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {

    const response = await fetch(
      "http://localhost:5000/users"
    );

    const data = await response.json();

    setUsers(data);
  };

  return (

    <div className="main">

      <h1 className="results-title">
        Registered Users
      </h1>

      <table className="quiz-table">

        <thead>

          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>

        </thead>

        <tbody>

          {users.map((user) => (

            <tr key={user.user_id}>

              <td>{user.user_id}</td>

              <td>{user.name}</td>

              <td>{user.email}</td>

              <td>{user.role}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Users;