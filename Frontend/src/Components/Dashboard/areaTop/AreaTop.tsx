import React, { useContext, useEffect, useRef, useState } from "react";
import { MdOutlineMenu } from "react-icons/md";
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

  const [username, setUsername] = useState<string>("Guest"); 
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null); 

  // Assume the logged-in email is passed from the login process
  useEffect(() => {
    const email = localStorage.getItem("loggedInEmail"); 
    setLoggedInEmail(email);
  }, []);

  useEffect(() => {
    if (loggedInEmail) {
      fetchUsersData();
    }
  }, [loggedInEmail]);

  const fetchUsersData = async () => {
    try {
      const response = await fetch("http://localhost:3500/api/auth/login", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const users = await response.json();
      console.log(users)


      const loggedInUser = users.find((user: { email: string }) => user.email === loggedInEmail);

      if (loggedInUser) {
        setUsername(loggedInUser.name); 
      } else {
        setUsername("Guest");        }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsername("Guest");  
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
          Welcome, {username}
        </p>
      </div>
    </section>
  );
};

export default AreaTop;
