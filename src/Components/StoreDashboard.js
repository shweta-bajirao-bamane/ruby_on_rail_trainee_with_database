import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // Import your Firebase configuration
import './StoreDashboard.css'; // Import the CSS file
import { useNavigate } from "react-router-dom";


const StoreDashboard = () => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const navigate = useNavigate(); // Initialize navigate hook

  const fetchRatings = async () => {
    try {
      const ratingsSnapshot = await getDocs(collection(db, "Ratings"));
      const ratingsList = ratingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRatings(ratingsList);
      calculateAverageRating(ratingsList);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      alert("Failed to fetch ratings.");
    }
  };

  const calculateAverageRating = (ratingsList) => {
    if (ratingsList.length > 0) {
      const totalRating = ratingsList.reduce((acc, rating) => acc + rating.rating, 0);
      setAverageRating((totalRating / ratingsList.length).toFixed(2));
    } else {
      setAverageRating(0);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  return (
    <div className="store-dashboard">
      <button className="back-button1" onClick={() => navigate("/change-pass")}>
  Change Password
</button>
     
      <button className="back-button2" onClick={() => navigate("/")}>
  Logout
</button>



      <h1>Store Dashboard</h1>
      <h2>All Ratings</h2>
      <div>
        {ratings.length > 0 ? (
          <table className="ratings-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User ID</th>
                <th>Store ID</th>
                <th>Rating</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((rating, index) => (
                <tr key={rating.id}>
                  <td>{index + 1}</td>
                  <td>{rating.userId}</td>
                  <td>{rating.storeId}</td>
                  <td>{rating.rating}</td>
                  <td>{new Date(rating.timestamp.seconds * 1000).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No ratings yet.</p>
        )}
      </div>
      <h2>Average Rating: {averageRating}</h2>
    </div>
  );
};

export default StoreDashboard;
