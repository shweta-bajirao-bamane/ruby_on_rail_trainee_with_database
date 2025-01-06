import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase"; // Firebase configuration
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigate hook

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select a role before logging in.");
      return;
    }

    try {
      // Sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save the login data to Firestore
      const loginData = {
        email: user.email,
        role: role,
        loginTimestamp: Timestamp.now(),
      };

      // Save login data in the "loginHistory" collection
      await addDoc(collection(db, "loginHistory"), loginData);

      handleLogin(); // Set the authenticated state

      // Navigate based on role
      if (role === "Admin") {
        navigate("/admin-dash");
      } else if (role === "Store Owner") {
        navigate("/store-dash");
      } else if (role === "User") {
        navigate("/user-dash");
      } else {
        throw new Error("Invalid role selected.");
      }

      alert("Login successful!");
    } catch (err) {
      console.error("Error during authentication:", err);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", background: "linear-gradient(to right, #82a886, #36c0e6)", textAlign: "center" }}>
      <h1>Login</h1>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
        <button
          onClick={() => setRole("Admin")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50", // Green color for Admin/Store Owner
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            width: "48%",
            margin: "5px 0",
            transition: "background-color 0.3s ease"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#45a049"} // Hover effect
          onMouseOut={(e) => e.target.style.backgroundColor = "#4CAF50"} // Reset to original color
        >
          Admin/Store Owner
        </button>
        <button
          onClick={() => navigate("/signup")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#008CBA", // Blue color for User
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            width: "48%",
            margin: "5px 0",
            transition: "background-color 0.3s ease"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#007bb5"} // Hover effect
          onMouseOut={(e) => e.target.style.backgroundColor = "#008CBA"} // Reset to original color
        >
          User
        </button>
      </div>

      {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px", textAlign: "left" }}>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "15px", textAlign: "left" }}>
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "15px", textAlign: "left" }}>
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            onChange={handleRoleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="">Select Role</option>
            <option value="Admin">System Admin</option>
            <option value="Store Owner">Store Owner</option>
            <option value="User">Normal User</option>
          </select>
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: "100%"
          }}
          disabled={!email || !password || !role}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
