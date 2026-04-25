import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomCard from "../components/RoomCard";
import Navbar from "../components/Navbar";

import "../App.css";

const PGFinder = () => {
  const [pgs, setPgs] = useState([]); 
  const [filteredPgs, setFilteredPgs] = useState([]);
  const [search, setSearch] = useState("");
  const [priceLimit, setPriceLimit] = useState(50000);

  useEffect(() => {
    axios.get('http://localhost:5000/api/pgs/all')
      .then(res => {
        setPgs(res.data);
        setFilteredPgs(res.data);
      })
      .catch(err => console.error("Error fetching PGs:", err));
  }, []);

  useEffect(() => {
    const results = pgs.filter(pg => {
      const matchesLocation = pg.location.toLowerCase().includes(search.toLowerCase());
      const matchesName = pg.name.toLowerCase().includes(search.toLowerCase());
      const matchesPrice = pg.price <= priceLimit;
      return (matchesLocation || matchesName) && matchesPrice;
    });
    setFilteredPgs(results);
  }, [search, priceLimit, pgs]);

  return (
    <>
      <Navbar />
      <div className="pg-finder-full-width">
        {/* Massive Attractive Center Text */}
        <header className="finder-hero-wide">
          <h1 className="hero-title-big">Find Your Perfect Stay</h1>
          <p className="hero-subtitle-big">Discover comfortable PGs and Hostels near DBUU, Dehradun</p>
        </header>
        
        {/* Short, Modern Search Section */}
        <div className="search-bar-center">
          <div className="compact-search-box">
            <input 
              type="text" 
              placeholder="Search area or PG name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select 
              className="compact-select" 
              onChange={(e) => setPriceLimit(Number(e.target.value))}
            >
              <option value="50000">Any Budget</option>
              <option value="5000">Under ₹5k</option>
              <option value="8000">Under ₹8k</option>
              <option value="12000">Under ₹12k</option>
            </select>
          </div>
        </div>

        {/* 2-Column Full Width Grid */}
        <div className="pg-grid-full">
          {filteredPgs.length > 0 ? (
            filteredPgs.map((item) => (
              <RoomCard key={item._id} pg={item} />
            ))
          ) : (
            <div className="no-results-full">
              <h3>No rooms found matching your criteria.</h3>
              <p>Try resetting your filters or searching for a different area.</p>
            </div>
          )}
        </div>
      </div>

    </>
  );
};

export default PGFinder;