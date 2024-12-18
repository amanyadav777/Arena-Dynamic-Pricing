import React from "react";
import "../static/css/dynamicArenaCard.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../constants";
import axios from "axios";
import { toast } from "react-hot-toast";

const DynamicArenaCard = ({ dynamicArenaData }) => {
  const navigate = useNavigate();

  const handleDelete = async (id, arenaId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/dynamic-pricing/delete-dynamic-pricing-arena/${id}`
      );

      if (response.data.statusCode === 200) {
        toast.success("Dynamic Arena deleted successfully.");
        window.location.reload();
      } else {
        toast.error("Error deleting Dynamic arena. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error.response || error.message);
      toast.error(error.response.data.message || error.message);
    }
  };
  return (
    <div className="dynamic-arena-card-container">
      <div className="dynamic-arena-card-image">
        <img
          src={dynamicArenaData.arenaDetails.imageUrl}
          alt="Arena"
          className="dynamic-arena-card-img"
        />
      </div>
      <h2 className="dynamic-arena-card-title">
        {dynamicArenaData.arenaDetails.name}
      </h2>
      <div className="dynamic-arena-card-details">
        <div className="dynamic-arena-card-row">
          <span className="dynamic-arena-card-label">Type:</span>
          {dynamicArenaData.date === "N/A" &&
            dynamicArenaData.day === "N/A" && (
              <span className="dynamic-arena-card-value">
                Only Time
              </span>
            )}
          {dynamicArenaData.day !== "N/A" && (
            <span className="dynamic-arena-card-value">
              Day-time
            </span>
          )}
          {dynamicArenaData.date !== "N/A" && (
            <span className="dynamic-arena-card-value">
              Date-Time
            </span>
          )}
        </div>
        {dynamicArenaData.date !== "N/A" && (
          <div className="dynamic-arena-card-row">
            <span className="dynamic-arena-card-label">Date:</span>
            <span className="dynamic-arena-card-value">
              {dynamicArenaData.date}
            </span>
          </div>
        )}
        {dynamicArenaData.day !== "N/A" && (
          <div className="dynamic-arena-card-row">
            <span className="dynamic-arena-card-label">Day:</span>
            <span className="dynamic-arena-card-value">
              {dynamicArenaData.day}
            </span>
          </div>
        )}
        <div className="dynamic-arena-card-row">
          <span className="dynamic-arena-card-label">Start Time:</span>
          <span className="dynamic-arena-card-value">
            {dynamicArenaData.startTime} hrs
          </span>
        </div>
        <div className="dynamic-arena-card-row">
          <span className="dynamic-arena-card-label">End Time:</span>
          <span className="dynamic-arena-card-value">
            {dynamicArenaData.endTime} hrs
          </span>
        </div>
        <div className="dynamic-arena-card-row">
          <span className="dynamic-arena-card-label">Price Change:</span>
          <span className="dynamic-arena-card-value">
            Rs. {dynamicArenaData.priceChange}
          </span>
        </div>
      </div>
      <div className="dynamic-arena-card-buttons">
        <button
          className="dynamic-arena-card-button dynamic-arena-card-update"
          onClick={() => {
            navigate(`/update-dynamic-pricing/${dynamicArenaData._id}`);
          }}
        >
          Update
        </button>
        <button
          className="dynamic-arena-card-button dynamic-arena-card-delete"
          onClick={() =>
            handleDelete(
              dynamicArenaData._id,
              dynamicArenaData.arenaDetails._id
            )
          }
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DynamicArenaCard;
