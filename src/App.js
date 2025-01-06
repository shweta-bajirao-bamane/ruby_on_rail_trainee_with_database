import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { db, auth } from "./Components/firebase";
import { collection, getDocs } from "firebase/firestore";
import Login from "./Components/Login";
import AdminDashboard from "./Components/AdminDashboard";
import Admin from "./Components/Admin";
import UsersList from "./Components/UsersList";
import StoresList from "./Components/StoresList";
import ChangePassword from "./Components/ChangePassword";
import UserDashboard from "./Components/UserDashboard";
import Rating from "./Components/Rating";
import StoreDashboard from "./Components/StoreDashboard";
import SignUp from "./Components/SignUp";
import Register from "./Components/Register";


const App = () => {
  const [userData, setUserData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map((doc) => doc.data());
      setUserData(usersList);
    } catch (error) {
      console.error("Error fetching users: ", error);
      alert("Failed to fetch users.");
    }
  };

  const fetchStores = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "stores"));
      const storesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStoreData(storesList);
    } catch (error) {
      console.error("Error fetching stores: ", error);
      alert("Failed to fetch stores.");
    }
  };
 
    // Function to handle login status change
    const handleLogin = () => {
      setIsAuthenticated(true);
    };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  };

  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Login handleLogin={() => setIsAuthenticated(true)} />} />
          <Route
            path="/admin-dash"
            element={
              <AdminDashboard
                isAuthenticated={isAuthenticated}
                fetchUsers={fetchUsers}
                fetchStores={fetchStores}
                userData={userData}
                storeData={storeData}
              />
            }
          />
          <Route path="/admin" element={<Admin fetchUsers={fetchUsers} fetchStores={fetchStores}  />} />
          <Route path="/users" element={<UsersList users={userData} />} />
          <Route path="/stores" element={<StoresList stores={storeData} />} />

          <Route path="/store-dash" element={<StoreDashboard></StoreDashboard>}></Route>
          <Route path="/change-pass" element={<ChangePassword />} />
          <Route path="/user-dash" element={<UserDashboard    isAuthenticated={isAuthenticated}  stores={storeData} userRatings={userRatings} />} />
          <Route path="/rate-store" element={<Rating stores={storeData} />} />
          <Route path="/signup" element={<SignUp></SignUp>}></Route>
          <Route path="/login" element={<Register  handleLogin={handleLogin}></Register>}></Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;