import { Outlet } from "react-router-dom";
import { Sidebar } from "../Components/index.ts";

const BaseLayout: React.FC = () => {
  return (
    <main className="page-wrapper">
      {/* left of page */}
      <Sidebar />
      {/* right side/content of the page */}
      <div className="content-wrapper">
        <Outlet />
      </div>
    </main>
  );
};

export default BaseLayout;
