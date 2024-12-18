import React, { useEffect, useState } from "react";
import DynamicArenaCard from "../components/DynamicArenaCard";
import axios from "axios";
import { API_BASE_URL } from "../constants";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const DynamicPricingHome = () => {
  const navigate = useNavigate();
    const [dynamicArenaList, setDynamicArenaList] = useState(null);
    const { id } = useParams();

  const getAllDynamicArena = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/dynamic-pricing/get-arena-dynamic-pricing-list/${id}`
      );
      if (response.data.statusCode === 200) {
        //   console.log(response?.data?.data);
        setDynamicArenaList(response?.data?.data);
      } else {
        toast.error("Failed to load arena details. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error.response || error.message);
      toast.error(error.response.data.message || error.message);
    }
  };
  
  const handleAddDynamicPricingNow = () => {
    navigate(`/add-dynamic-pricing/${id}`);
  };

  useEffect(() => {
    getAllDynamicArena();
  },[]);

  return (
    <div className="arena-home-container">
      {dynamicArenaList && dynamicArenaList.length > 0 ? (
        dynamicArenaList.map((dynamicArena, index) => (
          <DynamicArenaCard key={index} dynamicArenaData={dynamicArena} />
        ))
      ) : (
        <div className="no-arena-container">
          <h2>No Dynamic Arena Pricing to show</h2>
          <button onClick={handleAddDynamicPricingNow}>Add Now</button>
        </div>
      )}
    </div>
  );
};

export default DynamicPricingHome;
