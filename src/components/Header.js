import "../styles/Header.css"
import downArrow from "../assets/down.svg";
import Filter from "../assets/Display.svg";
import { useState, useEffect, useRef } from "react";

function Header({ grouping, setGrouping, ordering, setOrdering }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference for the dropdown

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown state
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close dropdown if clicked outside
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="header">
      <div className="dropdown-button" onClick={toggleDropdown}>
        <img src={Filter} alt="Filter icon" className="Filter-smb" />
        Display
        <img src={downArrow} alt="Down arrow" className="down-arrow" />
      </div>

      {isDropdownOpen && (
        <div className="dropdown-content" ref={dropdownRef}>
          <div className="dropdown-group">
            <label htmlFor="grouping">Grouping</label>
            <select
              id="grouping"
              className="dropdown-select"
              value={grouping}
              onChange={(e) => setGrouping(e.target.value)} // Update state on change
            >
              <option value="Status">Status</option>
              <option value="User">User</option>
              <option value="Priority">Priority</option>
            </select>
          </div>
          <div className="dropdown-group">
            <label htmlFor="ordering">Ordering</label>
            <select
              id="ordering"
              className="dropdown-select"
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)} // Update state on change
            >
              <option value="Priority">Priority</option>
              <option value="Title">Title</option>
            </select>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;