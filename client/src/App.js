import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Home from "./pages/Home";
import AddArena from "./pages/AddArena";
import AddDynamicPricing from "./pages/AddDynamicPricing";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-arena" element={<AddArena />} />
        <Route path="/add-dynamic-pricing" element={<AddDynamicPricing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
