import { AreaCards, TaskBoard } from "../../Components";
import AreaTop from "../../Components/Dashboard/areaTop/AreaTop";
import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="content-area">
      <AreaTop />
      <AreaCards />
      {/* <AreaCharts /> */}
      <TaskBoard />
    </div>
  );
};

export default Dashboard;
