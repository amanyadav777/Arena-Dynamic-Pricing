import React, { useState, useEffect } from "react";
import DynamicPricing from "../components/DynamicPricing";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../constants.js";
import { toast } from "react-hot-toast";

const UpdateDynamicPricing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [existingDynamicArenaDetails, setExistingDynamicArenaDetails] =
    useState(null);

  const getDynamicArenaDetails = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/dynamic-pricing/get-arena-dynamic-pricing-details/${id}`
      );
        console.log(response.data.data);
        setExistingDynamicArenaDetails(response?.data?.data);
    } catch (error) {
      // Error handling
      console.error("Error:", error.response || error.message);
      toast.error(error.response.data.message || error.message);
    }
  };

  // Submit Handler
  const handleUpdateDynamicArena = async (formData) => {
      try {
        const payload = {
          startTime: formData.startTime,
          endTime: formData.endTime,
          price: formData.price,
          duration: formData.selectedDuration,
          selectedOption: formData.selectedOption,
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
        const response = await axios.patch(
          `${API_BASE_URL}/api/v1/dynamic-pricing/update-dynamic-pricing-arena/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Success response handling
        if (response.data.statusCode === 200) {
          console.log("Dynamic Arena updated successfully:", response.data);
          toast.success("Dynamic Arena updated successfully!");
          navigate("/");
        } else {
          toast.error(
            "Error in updating Dynamic arena details. Please try again."
          );
        }
      } catch (error) {
        // Error handling
        console.error(
          "Error in updating Dynamic arena details:",
          error.response || error.message
        );
        toast.error(error.response.data.message || error.message);
      }
  };

  useEffect(() => {
    getDynamicArenaDetails();
  }, [id]);

  return (
    existingDynamicArenaDetails && (
      <DynamicPricing
        mode="update"
        arenaData={existingDynamicArenaDetails}
        onSubmit={handleUpdateDynamicArena}
      />
    )
  );
};

export default UpdateDynamicPricing;
