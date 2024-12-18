import React, { useEffect, useState } from "react";
import "../static/css/dynamicPricing.css";

const DynamicPricing = ({ mode, arenaData, onSubmit }) => {
  const [arenaName, setArenaName] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [durationOptions, setDurationOptions] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [selectedOption, setSelectedOption] = useState("date-time");
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (mode === "update") {
      setArenaName(arenaData?.arenaDetails?.name);
      setImageUrl(arenaData?.arenaDetails?.imageUrl);
      setDurationOptions([
        { duration: "all", price: "0" },
        ...arenaData?.arenaDetails?.originalPricing,
      ]);
      setSelectedDuration(arenaData?.duration || "all");
      if (arenaData?.date === "N/A" && arenaData?.day === "N/A") {
        setSelectedOption("time-only");
      } else if (arenaData?.date === "N/A" && arenaData?.day !== "N/A") {
        setDay(arenaData?.day);
        setSelectedOption("day-time");
      } else if (arenaData?.date !== "N/A" && arenaData?.day === "N/A") {
        const [day, month, year] = arenaData?.date?.split("-");
        setDate(`${year}-${month}-${day}`);
        setSelectedOption("date-time");
      }
      setStartTime(arenaData?.startTime);
      setEndTime(arenaData?.endTime);
      setPrice(arenaData?.priceChange);
    } else if (mode === "create") {
      setArenaName(arenaData?.name);
      setImageUrl(arenaData?.imageUrl);
      setDurationOptions([
        { duration: "all", price: "0" },
        ...arenaData?.originalPricing,
      ]);
    }
  }, [mode, arenaData]);

  const dynamicPricingSwitcher = (value) => {
    if (value !== selectedOption) {
      setDay("");
      setDate("");
      setSelectedOption(value);
    }
  };

  const validateFields = () => {
    const errors = {};
    if (selectedOption === "date-time" && !date) {
      errors.date = "Date is required.";
    }
    if (selectedOption === "day-time" && !day) {
      errors.day = "Day is required.";
    }
    if (!startTime) {
      errors.startTime = "Start time is required.";
    }
    if (!endTime) {
      errors.endTime = "End time is required.";
    }
    if (price === "" || isNaN(price) || price < -1e9 || price > 1e9) {
      errors.price = "Valid price is required.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0; 
  };

  const handleSubmit = () => {
    if (!validateFields()) {
      return; // Stop submission if validation fails
    }

    const data = {
      arenaName,
      selectedDuration,
      selectedOption,
      date: date === "" ? "N/A" : date,
      day: day === "" ? "N/A" : day,
      startTime,
      endTime,
      price,
    };
    onSubmit(data);
  };

  return (
    <div className="dynamic-pricing-container">
      <div>
        <h3>{mode === "create" ? "Create" : "Update"} Dynamic Arena</h3>
      </div>
      {/* Image and Arena Name */}
      <div className="dynamic-pricing-header">
        <img src={imageUrl} alt="Arena" className="dynamic-pricing-image" />
        <h2 className="dynamic-pricing-arena-name">{arenaName}</h2>
      </div>

      {/* Duration Chips */}
      <div className="dynamic-pricing-duration">
        <h4>Select Duration</h4>
        <div className="dynamic-pricing-chips">
          {durationOptions.map((duration, index) => (
            <button
              key={index}
              type="button"
              className={`chip ${
                selectedDuration === duration.duration ? "chip-active" : ""
              }`}
              onClick={() => setSelectedDuration(duration.duration)}
            >
              {duration.duration === "all" ? "All" : `${duration.duration}`}
            </button>
          ))}
        </div>
      </div>

      {/* Switch Between Date & Time, Day & Time, and Time Only */}
      <div className="dynamic-pricing-switcher">
        <button
          className={selectedOption === "date-time" ? "active" : ""}
          onClick={() => dynamicPricingSwitcher("date-time")}
        >
          Date and Time
        </button>
        <button
          className={selectedOption === "day-time" ? "active" : ""}
          onClick={() => dynamicPricingSwitcher("day-time")}
        >
          Day and Time
        </button>
        <button
          className={selectedOption === "time-only" ? "active" : ""}
          onClick={() => dynamicPricingSwitcher("time-only")}
        >
          Time Only
        </button>
      </div>

      {/* Dynamic Form Rendering */}
      {selectedOption === "date-time" && (
        <div className="dynamic-pricing-fields">
          <label>
            Date<span className="book-arena-required"> *</span>
          </label>
          <input
            type="date"
            name="date"
            id="date"
            value={date}
            min={today} // Restrict past dates
            onChange={(e) => setDate(e.target.value)}
            onKeyDown={(e) => e.preventDefault()}
          />
          {errors.date && <p className="error-text">{errors.date}</p>}
          <label>
            Start Time <span className="book-arena-required"> *</span>
          </label>
          <input
            type="time"
            name="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          {errors.startTime && <p className="error-text">{errors.startTime}</p>}
          <label>
            End Time <span className="book-arena-required"> *</span>
          </label>
          <input
            type="time"
            name="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          {errors.endTime && <p className="error-text">{errors.endTime}</p>}
        </div>
      )}

      {selectedOption === "day-time" && (
        <div className="dynamic-pricing-fields">
          <label>
            Day <span className="book-arena-required"> *</span>
          </label>
          <select
            name="day"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          >
            <option value="">Select Day</option>
            {[
              "MONDAY",
              "TUESDAY",
              "WEDNESDAY",
              "THURSDAY",
              "FRIDAY",
              "SATURDAY",
              "SUNDAY",
            ].map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          {errors.day && <p className="error-text">{errors.day}</p>}
          <label>
            Start Time<span className="book-arena-required"> *</span>
          </label>
          <input
            type="time"
            name="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          {errors.startTime && <p className="error-text">{errors.startTime}</p>}
          <label>
            End Time<span className="book-arena-required"> *</span>
          </label>
          <input
            type="time"
            name="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          {errors.endTime && <p className="error-text">{errors.endTime}</p>}
        </div>
      )}

      {selectedOption === "time-only" && (
        <div className="dynamic-pricing-fields">
          <label>
            Start Time<span className="book-arena-required"> *</span>
          </label>
          <input
            type="time"
            name="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          {errors.startTime && <p className="error-text">{errors.startTime}</p>}
          <label>
            End Time<span className="book-arena-required"> *</span>
          </label>
          <input
            type="time"
            name="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          {errors.endTime && <p className="error-text">{errors.endTime}</p>}
        </div>
      )}

      {/* Price Input */}
      <div className="dynamic-pricing-field">
        <label>
          Price<span className="book-arena-required"> *</span>
        </label>
        <input
          type="number"
          name="price"
          placeholder="Enter Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {errors.price && <p className="error-text">{errors.price}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="dynamic-pricing-submit"
        onClick={handleSubmit}
      >
        {mode === "create" ? "Create" : "Update"} Dynamic Arena
      </button>
    </div>
  );
};

export default DynamicPricing;
