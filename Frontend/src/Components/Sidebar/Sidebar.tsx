import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import {
  MdOutlineBarChart,
  MdOutlineClose,
  MdOutlineGridView,
  MdOutlineLogout,
  MdOutlineLogin,
  MdOutlineMessage,
  MdOutlinePeople,
  MdAssignment,
  MdOutlineSettings,
  MdOutlineAdd,
} from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";

// Define the notification structure
interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
}

const Sidebar: React.FC = () => {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) {
    throw new Error("ThemeContext must be used within a ThemeProvider");
  }

  const navigate = useNavigate();
  const sidebarContext = useContext(SidebarContext);
  if (!sidebarContext) {
    throw new Error("SidebarContext must be used within a SidebarProvider");
  }

  const { isSidebarOpen, closeSidebar } = sidebarContext;
  const navbarRef = useRef<HTMLDivElement>(null);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(false);

  // Fetch notifications from API and check for unread notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:3000/notifications");
        const data: Notification[] = await response.json();
        
        // Check if there are unread notifications
        const unread = data.some((notification) => !notification.isRead);
        setHasUnreadNotifications(unread);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []); // Empty dependency array means this runs once on component mount

  // Closing the navbar when clicked outside the sidebar area
  const handleClickOutside = (event: MouseEvent) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target as Node) &&
      (event.target as HTMLElement).className !== "sidebar-open-btn"
    ) {
      closeSidebar();
    }
  };

  const handleLogout = () => {
    console.log("Logging out");
    localStorage.setItem("isLoggedIn", "false"); // Update localStorage
    setIsLoggedIn(false); // Update state
    navigate("/login");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`} ref={navbarRef}>
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img src="" alt="" />
          <span className="sidebar-brand-text">Devs Diaries</span>
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className="menu-item">
              <NavLink to="/" className={({ isActive }) => (isActive ? "menu-link active" : "menu-link")}>
                <span className="menu-link-icon">
                  <MdOutlineGridView size={18} />
                </span>
                <span className="menu-link-text">Dashboard</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/createTeam" className={({ isActive }) => (isActive ? "menu-link active" : "menu-link")}>
                <span className="menu-link-icon">
                  <MdAssignment size={20} />
                </span>
                <span className="menu-link-text">Create Team</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/addproject" className={({ isActive }) => (isActive ? "menu-link active" : "menu-link")}>
                <span className="menu-link-icon">
                  <MdOutlineAdd size={20} />
                </span>
                <span className="menu-link-text">Add Project</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/orders" className={({ isActive }) => (isActive ? "menu-link active" : "menu-link")}>
                <span className="menu-link-icon">
                  <MdOutlinePeople size={20} />
                </span>
                <span className="menu-link-text">Manage Team</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/addtask" className={({ isActive }) => (isActive ? "menu-link active" : "menu-link")}>
                <span className="menu-link-icon">
                  <MdOutlineBarChart size={18} />
                </span>
                <span className="menu-link-text">Add Member Task</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/announcement" className={({ isActive }) => (isActive ? "menu-link active" : "menu-link")}>
                <span className="menu-link-icon">
                  <MdOutlineBarChart size={18} />
                </span>
                <span className="menu-link-text">Add Team Task</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/notification" className={({ isActive }) => (isActive ? "menu-link active" : "menu-link")}>
                <span className="menu-link-icon">
                  <MdOutlineMessage size={18} />
                </span>
                <span className="menu-link-text">
                  Notification
                  {hasUnreadNotifications && <span className="red-dot"></span>} {/* Red dot for unread notifications */}
                </span>
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <li className="menu-item">
              <NavLink to="/message" className={({ isActive }) => (isActive ? "menu-link active" : "menu-link")}>
                <span className="menu-link-icon">
                  <MdOutlineSettings size={18} />
                </span>
                <span className="menu-link-text">Profile Settings</span>
              </NavLink>
            </li>
            <li className="menu-item">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="menu-link">
                  <span className="menu-link-icon">
                    <MdOutlineLogout size={20} />
                  </span>
                  <span className="menu-link-text">Logout</span>
                </button>
              ) : (
                <NavLink to="/login" className={({ isActive }) => (isActive ? "menu-link active" : "menu-link")}>
                  <span className="menu-link-icon">
                    <MdOutlineLogin size={20} />
                  </span>
                  <span className="menu-link-text">Login</span>
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
