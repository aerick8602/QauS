import React, { useState, useRef, useEffect } from 'react';
import Display from "../assets/Display.svg";
import DownArrow from "../assets/down.svg";
import "../styles/DisplayOptions.css";

const DisplayOptions = ({ display, setDisplay, groupBy, setGroupBy, orderBy, setOrderBy }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayRef = useRef(null);

  const toggleOverlay = () => {
    setShowOverlay(prev => !prev);
  };

  const handleClickOutside = (event) => {
    if (overlayRef.current && !overlayRef.current.contains(event.target)) {
      setShowOverlay(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('groupBy', groupBy);
    localStorage.setItem('orderBy', orderBy);
  }, [groupBy, orderBy]);

  useEffect(() => {
    if (showOverlay) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showOverlay]);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setShowOverlay(false);
    }
  };

  useEffect(() => {
    setDisplay('Grouping');
  }, [groupBy]);

  useEffect(() => {
    setDisplay('Ordering');
  }, [orderBy]);

  return (
    <div className='Navbar'>
      <div className="display-options-container">
        <button 
          onClick={toggleOverlay} 
          className="display-btn" 
          aria-haspopup="true" 
          aria-expanded={showOverlay}
        >
          <img src={Display} alt="Filter icon" className="filter-icon" />
          Display
          <img src={DownArrow} alt="Down arrow" className="down-arrow" />
        </button>

        {showOverlay && (
          <div className="overlay-panel" ref={overlayRef}>
            <div className="dropdown-container">
              <div className="dropdown">
                <label htmlFor="groupBySelect">Grouping</label>
                <select
                  id="groupBySelect"
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                >
                  <option value="status">Status</option>
                  <option value="user">User</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
              <div className="dropdown">
                <label htmlFor="orderingSelect">Ordering</label>
                <select
                  id="orderingSelect"
                  value={orderBy}
                  onChange={(e) => setOrderBy(e.target.value)}
                >
                  <option value="Priority">Priority</option>
                  <option value="Title">Title</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayOptions;
