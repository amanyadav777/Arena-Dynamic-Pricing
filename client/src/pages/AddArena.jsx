import React from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants.js";
import { toast } from "react-hot-toast";
import Arena from "../components/Arena.jsx";
import { useNavigate } from "react-router-dom";

const AddArena = () => {
  const navigate = useNavigate();
  // Submit Handler
  const handleCreateArena = async (formData) => {
    try {
      // POST request
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/arena/create-arena`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Success response handling
      console.log("Arena created successfully:", response.data);
      toast.success("Arena created successfully!");
      navigate("/");
    } catch (error) {
      // Error handling
      console.error("Error creating arena:", error.response || error.message);
      toast.error(error.response.data.message || error.message);
    }
  };

  return <Arena mode="create" onSubmit={handleCreateArena} />;
};

export default AddArena;
