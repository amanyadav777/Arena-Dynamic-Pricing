import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants.js";
import { toast } from "react-hot-toast";
import Arena from "../components/Arena.jsx";
import { useParams, useNavigate } from "react-router-dom";

const UpdateArena = () => {
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
    
    const handleUpdateArena = async (arenaName, durationPricePairs) => {
      console.log(arenaName, durationPricePairs);
        try {
          // POST request
          const response = await axios.patch(
            `${API_BASE_URL}/api/v1/arena/update-arena/${id}`,
            { name: arenaName, originalPricing:durationPricePairs },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

            // Success response handling
            if (response.data.statusCode === 200) {
                toast.success("Arena updated successfully!");
                navigate("/");
            } else {
                toast.error("Error in updating arena details. Please try again.");
            }
        } catch (error) {
          // Error handling
          // console.log(error);
          console.error("Error creating arena:", error.response || error.message);
          toast.error(error.response.data.message || error.message);
        }
    };
    
    
    useEffect(() => {
        getArenaDetails();
    }, [id]);
    
    return (
      existingArenaDetails && (
    <Arena
      mode="update"
      arenaData={existingArenaDetails}
      onSubmit={handleUpdateArena}
    //   onUpdateImage={handleUpdateImage}
    />)
  );
};

export default UpdateArena;
