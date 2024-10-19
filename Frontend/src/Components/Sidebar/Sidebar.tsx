import { useContext, useEffect, useRef } from "react";
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
} from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";



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
  console.log("Sidebar open state:", isSidebarOpen); // Add this line
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const navbarRef = useRef<HTMLDivElement>(null);

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
    // Logout logic here
    console.log('logging out');
    localStorage.setItem('isLoggedIn', 'false'); // Update logged-in state
    navigate('/login');
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}
    >
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
              <NavLink to="/" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
                <span className="menu-link-icon">
                  <MdOutlineGridView size={18} />
                </span>
                <span className="menu-link-text">Dashboard</span>
              </NavLink>
            </li>

            <li className="menu-item">
              <NavLink to="/products" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
                <span className="menu-link-icon">
                  <MdAssignment size={20} />
                </span>
                <span className="menu-link-text">Create Team</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/orders" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
                <span className="menu-link-icon">
                  <MdOutlinePeople size={20} />
                </span>
                <span className="menu-link-text">Manage Team</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/announcement" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
                <span className="menu-link-icon">
                  <MdOutlineBarChart size={18} />
                </span>
                <span className="menu-link-text">Completed Task</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/message" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
                <span className="menu-link-icon">
                  <MdOutlineMessage size={18} />
                </span>
                <span className="menu-link-text">Message</span>
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
          <li className="menu-item">
              <NavLink to="/message" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
                <span className="menu-link-icon">
                  <MdOutlineSettings size={18} />
                </span>
                <span className="menu-link-text">Profile Settings</span>
              </NavLink>
            </li>
            <li className="menu-item">
              {isLoggedIn ? (
                <NavLink to="/login" onClick={handleLogout} className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
                  <span className="menu-link-icon">
                    <MdOutlineLogout size={20} />
                  </span>
                  <span className="menu-link-text">Logout</span>
                </NavLink>
              ) : (
                <NavLink to="/login" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
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
