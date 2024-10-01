import React, { useState } from 'react';
import DownArrow from '../assets/down.svg';
import Display from '../assets/Display.svg';
import '../styles/DisplayOptions.css'; // Import external CSS

const DisplayOptions = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [groupBy, setGroupBy] = useState('');
  const [selectedNumber, setSelectedNumber] = useState('');

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  return (
   <div className='Navbar'>
     <div className="display-options-container">
      <button onClick={toggleOverlay} className="display-btn">
        <img src={Display} alt="Filter icon" className="filter-icon" />
        Display
        <img src={DownArrow} alt="Down arrow" className="down-arrow" />
      </button>

      {showOverlay && (
        <div className="overlay-panel">
          <div className="dropdown-container">
            <div className="dropdown">
              <label>Grouping</label>
              <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                <option value="status">Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>
            <div className="dropdown">
              <label>Ordering</label>
              <select value={selectedNumber} onChange={(e) => setSelectedNumber(e.target.value)}>
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
