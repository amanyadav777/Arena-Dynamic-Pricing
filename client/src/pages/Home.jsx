import React, { useEffect, useState } from 'react'
import ArenaCard from '../components/ArenaCard';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import {toast} from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
    const [arenaList, setArenaList] = useState(null);
    
    const getAllArena = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/arena/list-of-arenas`
        );
          if (response.data.statusCode === 200) {
            //   console.log(response?.data?.data);
              setArenaList(response?.data?.data);
        } else {
          toast.error("Failed to load arena details. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error.response || error.message);
        toast.error(error.response.data.message || error.message);
      }
  };
  
  const handleCreateNow = () => {
    navigate("/add-arena");
  };
    
    useEffect(() => {
        getAllArena();
      }, []);
    
    return (
      <div className="arena-home-container">
        {arenaList && arenaList.length > 0 ? (
          arenaList.map((arena, index) => (
            <ArenaCard key={index} arenaData={arena} />
          ))
        ) : (
          <div className="no-arena-container">
            <h2>No arenas to show</h2>
            <button onClick={handleCreateNow}>Create Now</button>
          </div>
        )}
      </div>
    );
}

export default Home