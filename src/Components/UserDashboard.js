import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "./firebase"; // Import Firestore and Firebase Auth
import "./UserDashboard.css";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rating, setRating] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate(); // Initialize navigate hook

  // Get the logged-in user's ID
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch all stores from Firestore
  const fetchStores = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "stores"));
      const storesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStores(storesList);
    } catch (error) {
      console.error("Error fetching stores:", error);
      alert("Failed to fetch store data.");
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // Handle rating change
  const handleRatingChange = (storeId, newRating) => {
    setRating({ ...rating, [storeId]: newRating });
  };

  // Handle rating submission
  const handleRatingSubmit = async (storeId) => {
    const newRating = parseInt(rating[storeId], 10);
    if (!currentUserId) {
      alert("You must be logged in to submit a rating.");
      return;
    }

    if (newRating && newRating >= 1 && newRating <= 5) {
      try {
        // Add the rating to Firestore
        await addDoc(collection(db, "Ratings"), {
          userId: currentUserId,
          storeId: storeId,
          rating: newRating,
          timestamp: new Date(),
        });

        alert("Rating submitted successfully!");
        setRating({ ...rating, [storeId]: "" }); // Clear the input
      } catch (error) {
        console.error("Error submitting rating:", error);
        alert("Failed to submit rating.");
      }
    } else {
      alert("Please provide a valid rating between 1 and 5.");
    }
  };

  // Filter stores based on the search term
  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container1">
      <h1>Normal User Dashboard</h1>
      <button className="back-button1" onClick={() => navigate("/change-pass")}>
  Change Password
</button>
     
      <button className="back-button2" onClick={() => navigate("/")}>
  Logout
</button><hr/>
      <div>
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <h2>Available Stores:</h2>
        {filteredStores.length > 0 ? (
          <table className="stores-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Overall Rating</th>
                <th>Your Rating</th>
                <th>Submit</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store, index) => (
                <tr key={store.id}>
                  <td>{index + 1}</td>
                  <td>{store.name}</td>
                  <td>{store.email}</td>
                  <td>{store.address}</td>
                  <td>{store.rating ?? "N/A"}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={rating[store.id] || ""}
                      onChange={(e) =>
                        handleRatingChange(store.id, e.target.value)
                      }
                      placeholder="1-5"
                    />
                  </td>
                  <td>
                    <button onClick={() => handleRatingSubmit(store.id)}>
                      Submit Rating
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No stores available.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
