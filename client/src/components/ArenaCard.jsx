import React from "react";
import "../static/css/arenaCard.css";
import { useNavigate } from "react-router-dom";

const ArenaCard = ({ arenaData }) => {
    const navigate = useNavigate();
  return (
    <div className="arena-card-container">
      <div className="arena-card-image">
        <img src={arenaData.imageUrl} alt="Arena" className="arena-card-img" />
      </div>
      <h2 className="arena-card-title">{arenaData.name}</h2>
      <div className="arena-card-buttons">
        <button
          className="arena-card-button arena-card-btn-original"
          onClick={() => navigate(`/view-arena/${arenaData._id}`)}
        >
          View Original Price
        </button>
        <button
          className="arena-card-button arena-card-btn-dynamic-all"
          onClick={() => navigate(`/dynamic-arena-list/${arenaData._id}`)}
        >
          View All Dynamic Pricing
        </button>
        <button
          className="arena-card-button arena-card-btn-create"
          onClick={() => navigate(`/add-dynamic-pricing/${arenaData._id}`)}
        >
          Create Dynamic Pricing
        </button>
        <button
          className="arena-card-button arena-card-btn-book"
          onClick={() => navigate(`/book-arena/${arenaData._id}`)}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default ArenaCard;
