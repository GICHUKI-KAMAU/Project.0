import React, { useContext, useEffect, useRef, useState } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import "./AreaTop.scss";
import { SidebarContext } from "../../../context/SidebarContext";
import logo from "../../../assets/images/blog-logo.png";
import "react-date-range/dist/styles.css"; 
import "react-date-range/dist/theme/default.css"; 
import { addDays, format } from "date-fns";
import { DateRange, RangeKeyDict } from "react-date-range";

// Define the shape of the SidebarContext
interface SidebarContextType {
  openSidebar: () => void;
}

const AreaTop: React.FC = () => {
  const { openSidebar } = useContext(SidebarContext) as SidebarContextType;

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const dateRangeRef = useRef<HTMLDivElement | null>(null);

  const [username, setUsername] = useState<string>(""); // Mapping the 'name' field from API
  const [profilePicture, setProfilePicture] = useState<string | null>(null); // No profile picture in the API

  // Fetch the logged-in user ID (assumed to be stored in localStorage)
  useEffect(() => {
    const userId = localStorage.getItem("userId"); 
    if (userId) {
      fetchUserData(userId);
    }
  }, []);

  // Function to fetch user data based on the logged-in user ID
  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      setUsername(userData.name || ""); 
      
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Handle click outside of the date picker to close it
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dateRangeRef.current &&
      !dateRangeRef.current.contains(event.target as Node)
    ) {
      setShowDatePicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Formatting the selected startDate for display
  const formattedStartDate = format(state[0].startDate, "MMMM dd, yyyy");

  return (
    <section className="content-area-top">
      <div className="area-top-l">
        <button
          className="sidebar-open-btn"
          type="button"
          onClick={openSidebar}
        >
          <MdOutlineMenu size={24} />
        </button>
        <img src={logo} alt="" style={{ width: "70px", height: "auto" }} />
        <h2 className="area-top-title">HomePage</h2>
      </div>
      <div className="date-display">
        <p>Date: {formattedStartDate}</p>
      </div>

      {showDatePicker && (
        <div ref={dateRangeRef}>
          <DateRange
            editableDateInputs={true}
            onChange={(item: RangeKeyDict) => {
              const selection = item.selection;
              if (selection.startDate && selection.endDate) {
                setState([
                  {
                    startDate: selection.startDate,
                    endDate: selection.endDate,
                    key: selection.key || "selection",
                  },
                ]);
              }
            }}
            moveRangeOnFirstSelection={false}
            ranges={state}
          />
        </div>
      )}

      <div className="area-top-right">
        <p className="welcome-message">
          Welcome, {username ? username : "Guest"}
        </p>
        {profilePicture ? (
          <img
            src={profilePicture}
            alt="Profile"
            className="profile-picture"
          />
        ) : (
          <FaUserCircle size={40} className="profile-icon" />
        )}
      </div>
    </section>
  );
};

export default AreaTop;
