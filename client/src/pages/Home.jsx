import React, { useEffect, useState } from 'react'
import ArenaCard from '../components/ArenaCard';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import {toast} from 'react-hot-toast';

const Home = () => {
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
        toast.error("Failed to load arena details. Please try again.");
      }
    };
    
    useEffect(() => {
        getAllArena();
      });
    
    return (
      <div className="arena-home-container">
        {arenaList &&
          arenaList.map((arena, index) => (
            <ArenaCard key={index} arenaData={arena} />
          ))}
      </div>
    );
}

export default Home