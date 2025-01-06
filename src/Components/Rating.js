// RatingForm.js
import React, { useState } from 'react';

const Rating = ({ handleRatingSubmit, stores, isLoggedIn }) => {
  const [storeId, setStoreId] = useState("");
  const [rating, setRating] = useState(0);

  const handleStoreChange = (e) => {
    setStoreId(e.target.value);
  };

  const handleRatingChange = (e) => {
    setRating(Number(e.target.value));
  };

  const submitRating = () => {
    if (storeId && rating && isLoggedIn) {
      handleRatingSubmit(storeId, rating);
    } else {
      alert("Please login and select a store with a rating");
    }
  };

  return (
    <div>
      <h3>Submit Your Rating</h3>
      <select value={storeId} onChange={handleStoreChange}>
        <option value="">Select Store</option>
        {stores.map(store => (
          <option key={store.id} value={store.id}>{store.name}</option>
        ))}
      </select>
      <input
        type="number"
        value={rating}
        onChange={handleRatingChange}
        min="1"
        max="5"
        placeholder="Enter rating (1-5)"
      />
      <button onClick={submitRating}>Submit Rating</button>
    </div>
  );
};

export default Rating;
