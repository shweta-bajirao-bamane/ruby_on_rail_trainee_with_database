import React, { useState } from "react";
import { auth } from "./firebase";  // Import the Firebase auth module
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"; 
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const user = auth.currentUser;

      if (user) {
        const credentials = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credentials);

        await updatePassword(user, newPassword);
        setSuccess("Password changed successfully!");
      } else {
        setError("User not authenticated.");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setError("Failed to change password. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Change Password</h1>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
      <form onSubmit={handleChangePassword}>
        <div style={styles.formGroup}>
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          Change Password
        </button>
      </form>
      <button onClick={() => navigate("/store-dash")} style={styles.button}>
        Back to Dashboard
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    fontSize: "20px",
    fontWeight: "bold",
    height:"80vh",
    marginTop: "2%",
    marginLeft: "20%",
    padding: "20px 60px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    background: "linear-gradient(to right, #82a886, #36c0e6)",
    textAlign: "center",
    
  },
  formGroup: {
    marginBottom: "15px",
    textAlign: "left",
  },
  input: {
    width: "96%",
    color: "white",
    padding: "8px",
    marginTop: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
 
  button: {
    padding: "10px 20px",
    marginTop: "10px",
    marginBottom: "5px",
    background: "linear-gradient(to right, rgb(9, 50, 68), rgb(55, 142, 166))",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
   
  },
  error: {
    color: "red",
    marginBottom: "15px",
  },
  success: {
    color: "green",
    marginBottom: "15px",
  },
};

export default ChangePassword;
