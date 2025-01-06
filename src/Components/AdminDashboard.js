import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

const AdminDashboard = ({ isAuthenticated, fetchUsers, fetchStores, userData, storeData }) => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStores, setTotalStores] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const navigate = useNavigate(); 
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (userData.length === 0) fetchUsers();
    if (storeData.length === 0) fetchStores();

    setTotalUsers(userData.length);
    setTotalStores(storeData.length);
    setTotalRatings(storeData.filter((store) => store.rating).length); 
  }, [userData, storeData, fetchUsers, fetchStores]);

  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error during logout: ", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Admin Panel</h1>
      <hr/><br/>
      
      {isAuthenticated && (
        <nav style={styles.nav}>
          <div style={styles.navLinksContainer}>
            <NavLink to="/admin" style={({ isActive }) => isActive ? {...styles.navLink, ...styles.hoverNavLink} : styles.navLink}>
              Add User/Store
            </NavLink>
            <NavLink to="/users" style={({ isActive }) => isActive ? {...styles.navLink, ...styles.hoverNavLink} : styles.navLink}>
              View Users
            </NavLink>
            <NavLink to="/stores" style={({ isActive }) => isActive ? {...styles.navLink, ...styles.hoverNavLink} : styles.navLink}>
              View Stores
            </NavLink>
          </div>
          <button
            style={isLoggingOut ? { ...styles.logoutButton, ...styles.logoutButtonHover } : styles.logoutButton}
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging Out..." : "Logout"}
          </button>
        </nav>
      )}
      <div style={styles.cardFull}>
      <div style={styles.card}>
        <h3>Total Users</h3>
        <p>{totalUsers}</p>
      </div>
      <div style={styles.card}>
        <h3>Total Stores</h3>
        <p>{totalStores}</p>
      </div>
      <div style={styles.card}>
        <h3>Total Ratings</h3>
        <p>{totalRatings}</p>
      </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  nav: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: "10%",
  },
  navLinksContainer: {
    display: "flex",
    gap: "15px",
  },
  navLink: {
    textDecoration: "none",
    color: "white",
    fontSize: "22px",
    fontWeight: "bold",
    border: "1px solid #ccc",
    padding: "5px 10px",
    borderRadius: "4px",
    background: " linear-gradient(to right, #d96a4f, #feb47b)",
    transition: "background-color 0.3s, color 0.3s",
  },
  hoverNavLink: {
    background: "linear-gradient(to right, rgb(9, 50, 68), rgb(50, 206, 249))",
    color: "white",
    borderColor: "#007bff",
  },
  logoutButton: {
    padding: "8px 15px",
    fontSize: "22px",
    fontWeight: "bold",
    color: "white",
    background: "linear-gradient(to right, rgb(9, 50, 68), rgb(50, 206, 249))",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s, color 0.3s",
    marginLeft: "auto",
    marginRight: "5%",
  },
  logoutButtonHover: {
    background: "linear-gradient(to right, rgb(9, 50, 68), rgb(50, 206, 249))",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
  },
  card: {
    display: "inline-block",
    width: "200px",
    margin: "20px",
    marginTop: "90px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  },
  cardFull: {
    border: "2px solid gray",
    width: "74%",
    height: "300px",
    marginLeft: "150px",
    marginTop: "30px"
  }
};

export default AdminDashboard;
