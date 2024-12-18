import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../constants";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../static/css/bookArena.css";

const BookArena = () => {
  const { id } = useParams();
  const [existingArenaDetails, setExistingArenaDetails] = useState(null);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [durationOptions, setDurationOptions] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [totalAmount, setTotalAmount] = useState(null);
  const [showBookNow, setShowBookNow] = useState(false);
  const [errors, setErrors] = useState({});
  const [isCheckAmountDisabled, setIsCheckAmountDisabled] = useState(false);

  const getArenaDetails = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/arena/original-arena-details/${id}`
      );
      if (response.data.statusCode === 200) {
        setExistingArenaDetails(response?.data?.data);
        setDurationOptions(response?.data?.data?.originalPricing);
      } else {
        toast.error("Failed to load arena details. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error.response || error.message);
      toast.error("Failed to load arena details. Please try again.");
    }
  };

  const getPricing = async () => {
    try {
      const [year, month, day] = date.split("-");
      const payload = {
        date: `${day}-${month}-${year}`,
        startTime,
        duration: selectedDuration,
      };
      const queryString = new URLSearchParams(payload).toString();
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/arena/get-arean-details/${id}?${queryString}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.statusCode === 200) {
        setTotalAmount(response?.data?.data?.amount);
        setShowBookNow(true);
        setIsCheckAmountDisabled(true);
      } else {
        toast.error("Failed to load arena price. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error.response || error.message);
      toast.error("Failed to load arena price. Please try again.");
    }
  };

  useEffect(() => {
    getArenaDetails();
  }, [id]);

  const validateFields = () => {
    const newErrors = {};
    if (!date) newErrors.date = "Date is required";
    if (!startTime) newErrors.startTime = "Start time is required";
    if (!selectedDuration) newErrors.duration = "Duration is required";
    return newErrors;
  };

  const handleCheckAmount = () => {
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedDurationDetails = durationOptions.find(
      (duration) => duration.duration === selectedDuration
    );

    if (selectedDurationDetails) {
      getPricing();
    } else {
      toast.error("Please select a valid duration.");
    }
  };

  const resetCheckAmountState = () => {
    setTotalAmount(null);
    setShowBookNow(false);
    setIsCheckAmountDisabled(false);
    setErrors({});
  };

  return (
    existingArenaDetails && (
      <div className="book-arena-container">
        <div className="book-arena-header">Book Arena</div>
        <div className="book-arena-content">
          <div className="book-arena-image-wrapper">
            <img
              className="book-arena-image"
              src={existingArenaDetails.imageUrl}
              alt="Arena"
            />
          </div>
          <div className="book-arena-details">
            <h2 className="book-arena-name">{existingArenaDetails.name}</h2>

            <div className="book-arena-input-wrapper">
              <label className="book-arena-label">
                Date <span className="book-arena-required">*</span>
              </label>
              <input
                type="date"
                name="date"
                className="book-arena-input"
                value={date}
                min={today}
                onChange={(e) => {
                  setDate(e.target.value);
                  resetCheckAmountState();
                }}
              />
              {errors.date && (
                <div className="book-arena-error">{errors.date}</div>
              )}
            </div>

            <div className="book-arena-input-wrapper">
              <label className="book-arena-label">
                Start Time <span className="book-arena-required">*</span>
              </label>
              <input
                type="time"
                name="startTime"
                className="book-arena-input"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  resetCheckAmountState();
                }}
              />
              {errors.startTime && (
                <div className="book-arena-error">{errors.startTime}</div>
              )}
            </div>

            <div className="book-arena-dynamic-pricing">
              <h4 className="book-arena-duration-title">
                Select Duration <span className="book-arena-required">*</span>
              </h4>
              <div className="book-arena-chips-wrapper">
                {durationOptions.map((duration, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`book-arena-chip ${
                      selectedDuration === duration.duration
                        ? "book-arena-chip-active"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedDuration(duration.duration);
                      resetCheckAmountState();
                    }}
                  >
                    {duration.duration}
                  </button>
                ))}
              </div>
              {errors.duration && (
                <div className="book-arena-error">{errors.duration}</div>
              )}
              <button
                className="book-arena-check-amount"
                onClick={handleCheckAmount}
                disabled={isCheckAmountDisabled}
              >
                {isCheckAmountDisabled ? "Amount Checked" : "Check Amount"}
              </button>

              {/* Display Total Amount */}
              {totalAmount !== null && (
                <div className="book-arena-amount">
                  Total Amount is Rs. {totalAmount}
                </div>
              )}

              {/* Show Book Now button */}
              {showBookNow && (
                <button className="book-arena-book-now">Book Now</button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default BookArena;
