import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import RoomCard from "../components/RoomCard";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";
// import Feedback from "../components/Feedback";
import React, { useState } from "react";

function Home() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  return (
   
    <>
    
      <Navbar />
      <SearchBar/>
      <FeatureCard/>
      <FeatureCard onOpenFeedback={() => setIsFeedbackOpen(true)} />
    
    {isFeedbackOpen && (
       <div className="feedback-overlay">
          <button onClick={() => setIsFeedbackOpen(false)}>Close</button>
          <Feedback /> 
       </div>
    )}
      
      <Footer  />
      
    </>
  );
}

export default Home;