import React, {useState, useEffect} from 'react'
import DynamicPricing from '../components/DynamicPricing'
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../constants.js";
import { toast } from "react-hot-toast";

const AddDynamicPricing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [existingArenaDetails, setExistingArenaDetails] = useState(null);

  const getArenaDetails = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/arena/original-arena-details/${id}`
      );
      console.log(response.data.data);
      setExistingArenaDetails(response?.data?.data);
    } catch (error) {
      // Error handling
      console.error("Error:", error.response || error.message);
      toast.error("Failed to load arena details. Please try again.");
    }
  };

  // Submit Handler
  const handleCreateDynamicArena = async (formData) => {
    // console.log(formData);
    // { arenaId, date, day, startTime, endTime, price, duration }
    try {
      const payload = {
        arenaId: id,
        startTime: formData.startTime,
        endTime: formData.endTime,
        price: formData.price,
        duration: formData.selectedDuration,
      };

      // Conditionally add `date` and `day` if they are not "N/A"
      if (formData.date !== "N/A") {
        const [year, month, day] = formData.date.split("-");
        payload.date = `${day}-${month}-${year}`;
      }

      if (formData.day !== "N/A") {
        payload.day = formData.day;
      }
      
      // POST request
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/dynamic-pricing/create-dynamic-pricing-arena`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Success response handling
      if (response.data.statusCode === 200) {
        console.log("Dynamic Arena created successfully:", response.data);
        toast.success("Dynamic Arena created successfully!");
        navigate("/");
      } else {
        toast.error("Error in creating Dynamic Arena. Please try again.");
      }
    } catch (error) {
      // Error handling
      console.error("Error creating arena:", error.response || error.message);
      toast.error(error.response.data.message || error.message);
    }
  };
  
  useEffect(() => {
      getArenaDetails();
    }, [id]);
  
  return (
    existingArenaDetails && (
      <DynamicPricing
        mode="create"
        arenaData={existingArenaDetails}
        onSubmit={handleCreateDynamicArena}
      />
    )
  );
}

export default AddDynamicPricing