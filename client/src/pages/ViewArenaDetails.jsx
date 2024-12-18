import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants.js";
import { toast } from "react-hot-toast";
import Arena from "../components/Arena.jsx";
import { useParams, useNavigate } from "react-router-dom";

const ViewArenaDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate(); 
  const [existingArenaDetails, setExistingArenaDetails] = useState(null);

  const getArenaDetails = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/arena/original-arena-details/${id}`
      );
      // console.log(response.data.data);
      setExistingArenaDetails(response?.data?.data);
    } catch (error) {
      // Error handling
      console.error("Error:", error.response || error.message);
      toast.error(error.response.data.message || error.message);
    }
  };

  const handleEdit = (arenaIdToUpdate) => {
    navigate(`/update-arena/${arenaIdToUpdate}`);
  };

  const handleDeleteArena = async (arenaIdToDelete) => {
    try {
        const response = await axios.delete(
          `${API_BASE_URL}/api/v1/arena/delete-arena/${arenaIdToDelete}`
        );
        
        if (response.data.statusCode === 200) {
            toast.success("Arena deleted successfully.");
            navigate("/");
        } else {
            toast.error("Error deleting arena. Please try again.");
        }
        
    } catch (error) {
      console.error("Error:", error.response || error.message);
      toast.error(error.response.data.message || error.message);
    }
  };

  useEffect(() => {
    getArenaDetails();
  }, [id]);
  return (
    existingArenaDetails && (
      <Arena
        mode="view"
        arenaData={existingArenaDetails}
        onSubmit={handleEdit}
        onDelete={handleDeleteArena}
      />
    )
  );
};

export default ViewArenaDetails;
