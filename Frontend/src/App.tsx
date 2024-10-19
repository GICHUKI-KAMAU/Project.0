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
// import HomePage from "./pages/HomePage";

function App() {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) {
    throw new Error("ThemeContext is not provided");
  }
  const { theme, toggleTheme } = themeContext;

  const { openSidebar } = useContext(SidebarContext) || {};

  // adding dark-mode class if the dark mode is set on to the body tag
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
    <>
      <Router>
        <Routes>
          <Route element={<BaseLayout />}>
            <Route path='/' element={<Dashboard />} />
        
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
    </>
  )
}

export default App
