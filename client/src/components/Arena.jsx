import React, { useState, useEffect } from "react";
import "../static/css/addArena.css";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoIosCloseCircle } from "react-icons/io";

const Arena = ({ mode, arenaData, onSubmit, onDelete, onUpdateImage }) => {
  const [arenaName, setArenaName] = useState("");
  const [image, setImage] = useState(null);
  const [durationPricePairs, setDurationPricePairs] = useState([
    { duration: "", price: "" },
  ]);
  const [errors, setErrors] = useState({});
  const [existingImageUrl, setExistingImageUrl] = useState("");

  // Populate fields if updating or viewing details
  useEffect(() => {
    if (mode === "update" || mode === "view") {
      setArenaName(arenaData?.name || "");
      setExistingImageUrl(arenaData?.imageUrl || "");
      setDurationPricePairs(
        arenaData?.originalPricing || [{ duration: "", price: "" }]
      );
    }
  }, [mode, arenaData]);

  // Handle Image Upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  // Remove Image
  const handleImageRemove = () => {
    setImage(null);
    setExistingImageUrl("");
  };

  // Handle Input Change for Dynamic Fields
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPairs = [...durationPricePairs];
    updatedPairs[index][name] = value;
    setDurationPricePairs(updatedPairs);
  };

  // Add New Duration-Price Row
  const addNewRow = () => {
    setDurationPricePairs([...durationPricePairs, { duration: "", price: "" }]);
  };

  // Remove Row
  const removeRow = (index) => {
    const updatedPairs = durationPricePairs.filter((_, i) => i !== index);
    setDurationPricePairs(updatedPairs);
  };

  // Validate Inputs
  const validateInputs = () => {
    const newErrors = {};

    if (!arenaName.trim()) {
      newErrors.arenaName = "Arena Name is required";
    }

    durationPricePairs.forEach((pair, index) => {
      const durationRegex = /^\d+\smins$/;

      if (!pair.duration.trim()) {
        newErrors[`duration_${index}`] = "Duration is required";
      } else if (!durationRegex.test(pair.duration.trim())) {
        newErrors[`duration_${index}`] = "Duration must be 'X mins'";
      }

      if (!pair.price.trim()) {
        newErrors[`price_${index}`] = "Price is required";
      } else if (isNaN(pair.price.trim())) {
        newErrors[`price_${index}`] = "Price must be a valid number";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = () => {
    if (validateInputs()) {
      const formData = new FormData();
      formData.append("name", arenaName);
      if (image) formData.append("arenaImage", image);
        formData.append("originalPricing", JSON.stringify(durationPricePairs));
        if (mode === "update") {
            onSubmit(arenaName, durationPricePairs);
        } else {
            onSubmit(formData);
        }
    }
  };

  return (
    <div className="add-arena">
      <div className="add-arena-heading">
        <h3>
          {mode === "create"
            ? "Add Arena"
            : mode === "update"
            ? "Update Arena"
            : "Arena Details"}
        </h3>
      </div>

      <div className="add-arena-main-content">
        {/* Image Section */}
        <div className="add-arena-main-content-left">
          <label className="s2">Image</label>
          <div
            className="add-arena-main-content-image"
            style={{ position: "relative", width: "150px", height: "150px" }}
          >
            {existingImageUrl && !image ? (
              <>
                <div>
                  <img
                    src={existingImageUrl}
                    alt="Arena"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  {mode === "update" && (
                    <IoIosCloseCircle
                      onClick={handleImageRemove}
                      style={{
                        position: "absolute",
                        top: "-10px",
                        right: "-10px",
                        color: "red",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                      }}
                    />
                  )}
                </div>
                {mode === "update" && (
                  <button
                    onClick={onUpdateImage}
                    className="update-image-button"
                  >
                    Update Image
                  </button>
                )}
              </>
            ) : image ? (
              <>
                <div>
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Arena"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <IoIosCloseCircle
                    onClick={handleImageRemove}
                    style={{
                      position: "absolute",
                      top: "-10px",
                      right: "-10px",
                      color: "red",
                      fontSize: "1.5rem",
                      cursor: "pointer",
                    }}
                  />
                </div>
                {mode === "update" && (
                  <button
                    onClick={onUpdateImage}
                    className="update-image-button"
                  >
                    Update Image
                  </button>
                )}
              </>
            ) : (
              mode !== "view" && (
                <label>
                  <div>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                    />
                    <span style={{ cursor: "pointer", fontSize: "4rem" }}>
                      <IoMdAddCircleOutline />
                    </span>
                  </div>
                  {mode === "update" && (
                    <button
                      onClick={onUpdateImage}
                      className="update-image-button"
                    >
                      Update Image
                    </button>
                  )}
                </label>
              )
            )}
          </div>
        </div>

        <div className="add-arena-main-content-right">
          {/* Arena Name */}
          <div style={{ marginBottom: "20px" }}>
            <label>
              Arena Name<span style={{ color: "red" }}> *</span>
            </label>
            <br />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <input
                type="text"
                value={arenaName}
                onChange={(e) => setArenaName(e.target.value)}
                style={{
                  padding: "8px",
                  width: "300px",
                  marginTop: "5px",
                  border: errors.arenaName ? "1px solid red" : "1px solid #ccc",
                }}
                disabled={mode === "view"}
              />
              {errors.arenaName && (
                <span className="error-message">{errors.arenaName}</span>
              )}
            </div>
          </div>

          {/* Duration and Price */}
          <div>
            <label>
              Duration and Price<span style={{ color: "red" }}> *</span>
            </label>
            <div>
              {durationPricePairs.map((pair, index) => (
                <div
                  key={index}
                  style={{ display: "flex", marginBottom: "10px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <input
                      type="text"
                      name="duration"
                      placeholder="Duration (e.g., 60 mins)"
                      value={pair.duration}
                      onChange={(e) => handleInputChange(index, e)}
                      style={{
                        padding: "8px",
                        marginRight: "10px",
                        border: errors[`duration_${index}`]
                          ? "1px solid red"
                          : "1px solid #ccc",
                      }}
                      disabled={mode === "view"}
                    />
                    {errors[`duration_${index}`] && (
                      <span className="error-message">
                        {errors[`duration_${index}`]}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <input
                      type="text"
                      name="price"
                      placeholder="Price"
                      value={pair.price}
                      onChange={(e) => handleInputChange(index, e)}
                      style={{
                        padding: "8px",
                        marginRight: "10px",
                        border: errors[`price_${index}`]
                          ? "1px solid red"
                          : "1px solid #ccc",
                      }}
                      disabled={mode === "view"}
                    />
                    {errors[`price_${index}`] && (
                      <span className="error-message">
                        {errors[`price_${index}`]}
                      </span>
                    )}
                  </div>
                  {mode !== "view" && index !== 0 && (
                    <button
                      className="cross-button"
                      onClick={() => removeRow(index)}
                    >
                      ✖
                    </button>
                  )}
                </div>
              ))}
            </div>
            {mode !== "view" && (
              <button
                className="add-arena-main-content-add-new-button"
                onClick={addNewRow}
              >
                Add New
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="add-arena-button">
        {mode === "create" && (
          <button className="add-arena-create-button" onClick={handleSubmit}>
            Create Arena
          </button>
        )}
        {mode === "update" && (
          <button className="add-arena-create-button" onClick={handleSubmit}>
            Update Arena
          </button>
        )}
        {mode === "view" && (
          <>
            <button
              className="add-arena-create-button"
              onClick={() => onSubmit(arenaData._id)}
            >
              Update
            </button>
            <button
              className="add-arena-create-button"
              onClick={() => onDelete(arenaData._id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Arena;
