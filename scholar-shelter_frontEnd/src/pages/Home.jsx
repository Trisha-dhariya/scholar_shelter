import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import RoomCard from "../components/RoomCard";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
function Home() {
  return (
   
    <>
    
      <Navbar />
      <SearchBar/>
      
      <FeatureCard />
      <Footer  />
      
    </>
  );
}

export default Home;