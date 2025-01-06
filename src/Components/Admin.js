import React, { useState } from "react";
import { db } from "./firebase"; // Import your Firebase configuration
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const Admin = ({ fetchUsers, fetchStores }) => {
  const [formType, setFormType] = useState("user"); // 'user' or 'store'
  const navigate = useNavigate(); // Initialize navigate hook
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Normal User",
    address: "",
    rating: "",
  });

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


   
    try {
      if (formType === "user") {
        await addDoc(collection(db, "users"), {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          address: formData.address,
        });
        alert("User added successfully!");
        fetchUsers();
      } else {
        await addDoc(collection(db, "stores"), {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          rating: parseFloat(formData.rating),
        });
        alert("Store added successfully!");
        fetchStores();
      }

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "Normal User",
        address: "",
        rating: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to add. Please try again.");
    }
    fetchStores();
  };

  return (
    <div className="container">
       <button className="back-button" onClick={() => navigate("/admin-dash")}>
  Back
</button>
      <h1 className="heading">Add {formType === "user" ? "User" : "Store"}</h1>
      <div className="formTypeButtons">
        <button className="button" onClick={() => setFormType("user")}>
          Add User
        </button>
        <button className="button" onClick={() => setFormType("store")}>
          Add Store
        </button>
      </div>
      <form onSubmit={handleSubmit} className="form">
        <div>
          <label className="label">Name:</label>
          <input
            className="input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="label">Email:</label>
          <input
            className="input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {formType === "user" && (
          <>
            <div>
              <label className="label">Password:</label>
              <input
                className="input"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">Role:</label>
              <select
                className="select"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Normal User">Normal User</option>
                <option value="Admin User">Admin User</option>
                <option value="Store Owner">Store Owner</option>
              </select>
            </div>
          </>
        )}

        {formType === "store" && (
          <div>
            <label className="label">Rating:</label>
            <input
              className="input"
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              required
              min="0"
              max="5"
              step="0.1"
            />
          </div>
        )}

        <div>
          <label className="label">Address:</label>
          <textarea
            className="textarea"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <button className="button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Admin;
