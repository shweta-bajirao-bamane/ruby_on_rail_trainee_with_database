import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDocs, collection } from "firebase/firestore";
import { db } from "./firebase";
import "./UsersList.css";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    fetchUsers();
  }, []);
  

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map((doc) => ({
        userId: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users: ", error);
      alert("Failed to fetch users.");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSort = (key) => {
    setSortConfig((prevSortConfig) => {
      if (prevSortConfig.key === key) {
        return { key, direction: prevSortConfig.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
    const bValue = b[sortConfig.key]?.toString().toLowerCase() || "";
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredUsers = sortedUsers.filter((user) =>
    Object.entries(filters).every(([key, value]) =>
      value ? user[key]?.toLowerCase().includes(value.toLowerCase()) : true
    )
  );

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? " ▲" : " ▼";
    }
    return "";
  };

  return (
    <div className="container">
      <h2>Users List</h2>
      <button className="back-button" onClick={() => navigate("/admin-dash")}>
  Back
</button>

      <div className="filters">
        <input
          type="text"
          name="name"
          placeholder="Filter by Name"
          value={filters.name}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="email"
          placeholder="Filter by Email"
          value={filters.email}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="address"
          placeholder="Filter by Address"
          value={filters.address}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="role"
          placeholder="Filter by Role"
          value={filters.role}
          onChange={handleFilterChange}
          className="filter-input"
        />
      </div>
      {filteredUsers.length === 0 ? (
        <p className="no-users">No users to display.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("userId")}>
                User ID{getSortIndicator("userId")}
              </th>
              <th onClick={() => handleSort("name")}>
                Name{getSortIndicator("name")}
              </th>
              <th onClick={() => handleSort("email")}>
                Email{getSortIndicator("email")}
              </th>
              <th onClick={() => handleSort("role")}>
                Role{getSortIndicator("role")}
              </th>
              <th onClick={() => handleSort("address")}>
                Address{getSortIndicator("address")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersList;
