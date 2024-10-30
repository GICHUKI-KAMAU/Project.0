import { useContext, useEffect } from "react";
import { ThemeContext } from "./context/ThemeContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// @ts-ignore
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import './App.scss'
import BaseLayout from "./layout/BaseLayout";
import { Dashboard} from "./screens";
import { SidebarContext } from "./context/SidebarContext";
import CreateTeamForm from "./Components/CreateTeam/CreateTeamForm";
import RegisterForm from "./Components/Authentication/RegisterForm";
import Login from "./Components/Authentication/Login";
import AddProjectForm from "./Components/AddProject/AddProject";
import AssignTaskForm from "./Components/AddTask/AssignTask";
import Notifications from "./Components/Notification/Notification";
import { AuthProvider } from './context/AuthContext'; 
import ProtectedRoute from './ProtectedRoute';

function App() {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) {
    throw new Error("ThemeContext is not provided");
  }
  const { theme, toggleTheme } = themeContext;

  const { openSidebar } = useContext(SidebarContext) || {};


  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  if (!openSidebar) {
    return null;
  }


  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<BaseLayout />}>
            <Route path='/' element={<Dashboard />} />
            <Route path="/register" element={<RegisterForm />} /> 
            <Route path="/login" element={<Login />} />

            <Route path='/createTeam' element={<ProtectedRoute element={<CreateTeamForm />} />} />
            <Route path="/addproject" element={<ProtectedRoute element={<AddProjectForm />} />} />
            <Route path="/addtask" element={<AssignTaskForm />} />
            <Route path="/notification" element={<Notifications />} />
        
            {/* <Route index element={<HomePage />} /> */}
          </Route>
        </Routes>

        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
        >
          <img
            className="theme-icon"
            src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
          />
        </button>

      </Router>
    </AuthProvider>
  )
}

export default App
